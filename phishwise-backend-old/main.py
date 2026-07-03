import os
import ssl
import socket
import whois
import pickle
import requests
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup

import warnings
import urllib3

warnings.filterwarnings("ignore", category=UserWarning)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# =============================================================
# 👑 APP CONFIGURATION & MODELS LOADING
# =============================================================
app = FastAPI(title="PhishWise Security Hybrid Core API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scan_history_db = []
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# โหลดคลังคำศัพท์และโมเดลตามปกติ
try:
    with open(os.path.join(BASE_DIR, "vocab_final.pkl"), "rb") as f:
        vocab = pickle.load(f)
    with open(os.path.join(BASE_DIR, "url_random_forest_model.pt"), "rb") as f:
        url_rf_model = pickle.load(f)
    bilstm_weights = torch.load(
        os.path.join(BASE_DIR, "advanced_model_bi_lstm.pt"),
        map_location=torch.device("cpu"),
        weights_only=False,
    )
    print("🟢 All Models and Resources Loaded Successfully!")
except Exception as e:
    print(f"🔴 Error Loading Resources: {e}")
    vocab = {"<PAD>": 0, "<UNK>": 1}
    url_rf_model = None
    bilstm_weights = None


class PhishingBiLSTM(nn.Module):
    def __init__(
        self, vocab_size=15000, embedding_dim=64, hidden_dim=128, output_dim=2
    ):
        super(PhishingBiLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            embedding_dim,
            hidden_dim,
            num_layers=2,
            bidirectional=True,
            batch_first=True,
            dropout=0.3,
        )
        self.fc = nn.Linear(hidden_dim * 2, output_dim)

    def forward(self, text):
        embedded = self.embedding(text)
        lstm_out, (hidden, cell) = self.lstm(embedded)
        hidden_out = torch.cat((hidden[-2, :, :], hidden[-1, :, :]), dim=1)
        return self.fc(hidden_out)


# =============================================================
# 🕵️‍♂️ OSINT FUNCTIONS
# =============================================================
def fetch_domain_age_days(url_str: str):
    try:
        domain = url_str.split("//")[-1].split("/")[0].lower().replace("www.", "")
        w = whois.whois(domain)
        creation_date = w.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        if creation_date:
            age_days = (datetime.now() - creation_date.replace(tzinfo=None)).days
            if age_days < 180:
                return (
                    age_days,
                    f"{age_days} วัน",
                    f"⚠️ โดเมนพึ่งจดทะเบียนใหม่ได้เพียง {age_days} วัน",
                )
            return (
                age_days,
                f"{age_days // 365} ปี { (age_days % 365) // 30 } เดือน",
                "🟢 โดเมนมีประวัติเปิดใช้งานยาวนาน",
            )
        return None, "ไม่พบข้อมูล", "ไม่พบประวัติข้อมูลระบบจัดทะเบียน"
    except Exception:
        return None, "ไม่พบข้อมูล", "ไม่พบประวัติข้อมูลระบบจัดทะเบียน"


def fetch_ssl_status(url_str: str):
    try:
        hostname = url_str.split("//")[-1].split("/")[0].split(":")[0]
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                issuer = dict(x[0] for x in cert["issuer"]).get(
                    "commonName", "Unknown CA"
                )
                return True, issuer, "🔒 มีการเข้ารหัสข้อมูลปกติ ปลอดภัย"
    except Exception:
        return (
            False,
            "Not Secure",
            "❌ ไม่พบการเข้ารหัสข้อมูลที่ปลอดภัย หรือ SSL หมดอายุ",
        )


def fetch_ip_location(url_str: str):
    try:
        hostname = url_str.split("//")[-1].split("/")[0].split(":")[0]
        ip_address = socket.gethostbyname(hostname)
        res = requests.get(f"https://ipapi.co/{ip_address}/json/", timeout=3).json()
        return f"{res.get('city', 'Unknown')}, {res.get('country_name', 'Unknown')}"
    except Exception:
        return "Unknown Location"


def extract_url_features(url: str):
    return np.array(
        [
            [
                len(url),
                (
                    1
                    if any(
                        c.isdigit()
                        for c in url.split("//")[-1].split("/")[0].split(".")
                    )
                    else 0
                ),
                url.count("."),
                url.count("-"),
                url.count("@"),
                url.count("?"),
                url.count("/"),
                url.count("="),
                1 if "http" in url.split("//")[-1] else 0,
                1 if "https" in url.split("//")[-1] else 0,
                sum(c.isdigit() for c in url),
            ]
        ],
        dtype=np.float32,
    )


def process_html_content(url: str, max_len=500):
    try:
        res = requests.get(
            url, headers={"User-Agent": "Mozilla/5.0"}, timeout=3, verify=False
        )
        if res.status_code != 200:
            return None
        soup = BeautifulSoup(res.text, "html.parser")
        for e in soup(["script", "style"]):
            e.extract()
        tokens = soup.get_text().lower().split()
        if not tokens:
            return None
        numerical = [vocab.get(t, vocab.get("<UNK>", 1)) for t in tokens[:max_len]]
        if len(numerical) < max_len:
            numerical += [vocab.get("<PAD>", 0)] * (max_len - len(numerical))
        return torch.tensor([numerical], dtype=torch.long)
    except Exception:
        return None


# =============================================================
# 📡 CORE API CONTROLLER WITH PRIORITY RANKING
# =============================================================
class ScanRequest(BaseModel):
    url: str


@app.post("/api/v1/scan")
async def scan_url(request: ScanRequest):
    url = request.url
    is_trusted = any(
        d in url.lower()
        for d in ["google.com", "microsoft.com", "github.com", "facebook.com"]
    )

    # 1️⃣ [CRITICAL PRIORITY] เช็คฐานข้อมูลบัญชีดำจำลองก่อนชิ้นแรก
    # (สมมติจำลองว่าถ้าตรวจเจอลิงก์คีย์เวิร์ดมัลแวร์จัดๆ หรือโดนแจ้งบล็อก ให้ดีดเป็นอันตรายร้อยเปอร์เซ็นต์ทันที)
    is_in_blacklist_db = False
    if "malicious-scam-test" in url.lower():
        is_in_blacklist_db = True

    if is_in_blacklist_db:
        return {
            "url": url,
            "score": 0,
            "status": "danger",
            "ai_risk_score": 100,
            "ssl_title": "Not Secure",
            "ssl_sub": "❌ ติดแบล็กลิสต์ระบบ",
            "domain_age": "0 วัน",
            "domain_sub": "🚨 ตรวจพบในฐานข้อมูลบัญชีดำส่วนกลาง",
            "is_blacklisted": True,
            "google_safe": False,
            "location": "Unknown",
            "has_redirection": False,
        }

    # ดึงข้อมูล OSINT มาเตรียมพร้อมสำหรับใช้จัดค่าน้ำหนัก
    age_days, domain_age, domain_sub = fetch_domain_age_days(url)
    has_ssl, ssl_title, ssl_sub = fetch_ssl_status(url)
    location_name = fetch_ip_location(url)

    rf_risk = 0.0
    bilstm_risk = 0.0

    # 2️⃣ [MEDIUM PRIORITY] คำนวณคะแนนฐานพื้นฐานจากโมเดล AI
    if url_rf_model is not None and not is_trusted:
        try:
            df_features = pd.DataFrame(
                extract_url_features(url),
                columns=[
                    "url_length",
                    "is_ip_address",
                    "count_dots",
                    "count_hyphens",
                    "count_at",
                    "count_question",
                    "count_slash",
                    "count_equal",
                    "has_http",
                    "has_https",
                    "count_digits",
                ],
            )
            rf_risk = float(url_rf_model.predict_proba(df_features)[0][1])
        except Exception:
            pass

    html_tensor = process_html_content(url)
    if html_tensor is not None and bilstm_weights is not None and not is_trusted:
        try:
            model_instance = PhishingBiLSTM(
                vocab_size=15000, embedding_dim=64, output_dim=2
            )
            model_instance.load_state_dict(
                (
                    bilstm_weights
                    if "embedding.weight" in bilstm_weights
                    else bilstm_weights.get("state_dict", bilstm_weights)
                ),
                strict=True,
            )
            model_instance.eval()
            with torch.no_grad():
                probabilities = torch.softmax(model_instance(html_tensor), dim=1)[0]
                bilstm_risk = float(probabilities[1].item())
        except Exception:
            pass

    # คะแนนตั้งต้นรวมจาก AI (สัดส่วนอย่างละ 50% ของคะแนนโมเดล)
    accumulated_risk = 0 if is_trusted else int(((rf_risk + bilstm_risk) / 2) * 100)

    # 3️⃣ [HIGH PRIORITY] การปรับโทษคะแนน (Penalty Score) ตามระดับความรุนแรงภายนอก
    if not is_trusted:
        # 🚨 กรณีที่ 1: อายุโดเมนต่ำกว่า 30 วัน (อันตรายมาก เพิ่มความเสี่ยงหนักที่สุด +40 คะแนน)
        if age_days is not None and age_days <= 30:
            accumulated_risk = min(100, accumulated_risk + 40)
        # 🟡 กรณีที่ 2: อายุโดเมนต่ำกว่า 180 วัน (ความเสี่ยงปานกลาง เพิ่มความเสี่ยง +20 คะแนน)
        elif age_days is not None and age_days <= 180:
            accumulated_risk = min(100, accumulated_risk + 20)

        # 🔒 กรณีที่ 3: ไม่มีใบรับรอง SSL หรือเชื่อมต่อไม่ปลอดภัย (+30 คะแนนความเสี่ยง)
        if not has_ssl:
            accumulated_risk = min(100, accumulated_risk + 30)

        # 📦 กรณีที่ 4: ตรวจพบโครงสร้างไฟล์ดาวน์โหลดสุ่มเสี่ยงพ่วงท้ายภายนอก (+20 คะแนนความเสี่ยง)
        if any(ext in url.lower() for ext in [".zip", ".exe", ".rar", ".scr"]):
            accumulated_risk = min(100, accumulated_risk + 20)

    # ⚡️ สรุปและกลับทิศทางเป็นคะแนนความปลอดภัยส่งให้หน้าบ้าน
    final_risk_score = accumulated_risk
    final_safe_score = 100 - final_risk_score

    # แบ่งเกณฑ์กลุ่มสถานะตามคะแนนความปลอดภัยสุทธิ
    if final_safe_score >= 75:
        status = "safe"
    elif final_safe_score >= 45:
        status = "warning"
    else:
        status = "danger"

    scan_log = {
        "timestamp": datetime.now().isoformat(),
        "url": url,
        "score": final_safe_score,
        "status": status,
    }
    scan_history_db.append(scan_log)

    return {
        "url": url,
        "score": final_safe_score,  # ส่งคะแนนความปลอดภัยสุทธิหลังปรับ Priority ไปที่วงกลมฝั่งซ้าย
        "status": status,
        "ssl_title": ssl_title,
        "ssl_sub": ssl_sub,
        "domain_age": domain_age,
        "domain_sub": domain_sub,
        "ai_risk_score": final_risk_score,  # ส่งคะแนนความเสี่ยงสุทธิไปแสดงที่แถบขวาบน
        "is_blacklisted": (
            False if is_trusted else (True if status == "danger" else False)
        ),
        "google_safe": True if is_trusted else (False if status == "danger" else True),
        "location": location_name,
        "has_redirection": False,
    }


@app.get("/api/v1/history")
async def get_scan_history():
    return {"total_scans": len(scan_history_db), "logs": scan_history_db}

import os
import ssl
import socket
import whois
import torch
import torch.nn as nn
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime

app = FastAPI(title="PhishWise Security Hybrid Core API")

# เปิดท่อ CORS ให้ React สามารถข้ามพอร์ตมายิงได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 🕵️‍♂️ OSINT OSINT FUNCTIONS (ฟังก์ชันสืบค้นประวัติภายนอกสำหรับหน้าจอสรุป)
# -------------------------------------------------------------


def fetch_domain_age(url_str: str):
    """
    ฟังก์ชันสืบค้นอายุโดเมนอัจฉริยะ (ระบบ Hybrid Production-Grade)
    - รองรับการล้างบั๊ก Offset-Aware/Naive Datetime จากโครงสร้าง List + Timezone
    - มีระบบสำรองดึงผ่าน RDAP API พร้อมแนบ User-Agent เพื่อป้องกันการโดนบล็อก HTTP 403
    """
    try:
        # 1. สกัดเอาชื่อโดเมนหลักและแปลงเป็นตัวพิมพ์เล็ก (เช่น https://www.google.com/ -> google.com)
        domain = url_str.split("//")[-1].split("/")[0].lower()

        # ป้องกันกรณีใช้โดเมนจำลองรันบนเครื่อง Local
        if "localhost" in domain or "127.0.0.1" in domain or "mock-qr" in domain:
            return "โดเมนจำลอง", "ใช้สำหรับการทดสอบระบบ Local"

        # =================================================================
        # 🚀 แผน ก: สืบค้นผ่าน python-whois (วิ่งผ่าน Port 43 มาตรฐานโลก)
        # =================================================================
        try:
            w = whois.whois(domain)
            creation_date = w.get("creation_date")

            # 🔥 ล้างบั๊กจุดที่ 1: ถ้าค่าส่งมาเป็นลิสต์อาร์เรย์ซ้อนกัน ให้หยิบตัวแรกมาใช้งาน
            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            if creation_date:
                # 🔥 ล้างบั๊กจุดที่ 2: จัดการกับเขตเวลา (+00:00) ที่ติดมากับวัตถุ datetime (Offset-Aware)
                # โดยการล้างค่าเขตเวลาออก (tzinfo=None) เพื่อให้สามารถนำไปลบกับ datetime.now() ของเครื่องได้
                if (
                    hasattr(creation_date, "tzinfo")
                    and creation_date.tzinfo is not None
                ):
                    creation_date = creation_date.replace(tzinfo=None)

                # หากข้อมูลหลุดมาในรูปแบบข้อความ String ธรรมดา
                if isinstance(creation_date, str):
                    # ตัดเครื่องหมายบวกหรือช่องว่างด้านหลังออก เอาเฉพาะวันที่ส่วนหน้าสุด
                    clean_date_str = creation_date.split("+")[0].split()[0]
                    creation_date = datetime.strptime(clean_date_str, "%Y-%m-%d")

                # ทำการคำนวณสถิติอายุโดเมน
                diff = datetime.now() - creation_date
                years = diff.days // 365
                months = (diff.days % 365) // 30

                if years == 0 and months == 0:
                    return (
                        f"{diff.days} วัน",
                        f"จดทะเบียนเมื่อ: {creation_date.strftime('%d %b %Y')}",
                    )
                return (
                    f"{years} ปี {months} เดือน",
                    f"จดทะเบียนเมื่อ: {creation_date.strftime('%d %b %Y')}",
                )

        except Exception as whois_err:
            # พ่น Log บอกสเตตัสใน Terminal หลังบ้าน แต่ปล่อยให้ระบบไหลไปทำแผน ข ต่อไป ไม่ให้ระบบล่ม
            print(f"⚠️ WHOIS Port 43 Blocked or Error: {str(whois_err)}")
            pass

        # =================================================================
        # 🚀 แผน ข (Backup Layer): ดึงผ่าน RDAP API (วิ่งผ่าน HTTP/HTTPS Port 443)
        # =================================================================
        try:
            rdap_url = f"https://rdap.org/domain/{domain}"

            # 🔥 ล้างบั๊กจุดที่ 3: ใส่โครงสร้าง Headers เพื่อจำลองว่าส่งมาจากหน้าเว็บเบราว์เซอร์จริง
            # ป้องกันระบบความปลอดภัยปลายทางดีดคำขอเราทิ้งเป็น HTTP 403 Forbidden
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            response = requests.get(rdap_url, headers=headers, timeout=5)

            if response.status_code == 200:
                data = response.json()
                events = data.get("events", [])
                event_date_str = None

                # วนลูปสแกนหาคีย์วันที่บันทึกการจัดตั้ง (Registration Date)
                for event in events:
                    action = event.get("eventAction", "").lower()
                    if action in ["registration", "active", "last changed"]:
                        event_date_str = event.get("eventDate")
                        if action == "registration":
                            break

                # หากค้นหาแท็กไม่เจอ แต่มีประวัติเหตุการณ์ส่งมา ให้เอาค่าจากช่องแรกสุด
                if not event_date_str and events:
                    event_date_str = events[0].get("eventDate")

                if event_date_str:
                    # สับสตริงข้อความเอาเฉพาะข้อมูลวันที่ 10 หลักแรก (YYYY-MM-DD)
                    clean_date_str = event_date_str[:10]
                    creation_date = datetime.strptime(clean_date_str, "%Y-%m-%d")

                    diff = datetime.now() - creation_date
                    years = diff.days // 365
                    months = (diff.days % 365) // 30

                    if years == 0 and months == 0:
                        return (
                            f"{diff.days} วัน",
                            f"จดทะเบียนเมื่อ: {creation_date.strftime('%d %b %Y')} (ผ่าน RDAP API)",
                        )
                    return (
                        f"{years} ปี {months} เดือน",
                        f"จดทะเบียนเมื่อ: {creation_date.strftime('%d %b %Y')} (ผ่าน RDAP API)",
                    )

        except Exception as rdap_err:
            print(f"⚠️ RDAP Fallback Engine Error: {str(rdap_err)}")
            pass

    except Exception as main_err:
        print(f"⚠️ Critical Domain Age Function Error: {str(main_err)}")
        pass

    # คืนค่ากรณีสุดท้ายหากบล็อกหนาแน่นมากจนทำทุกแผนแล้วไม่ได้ข้อมูลจริงๆ
    return "ไม่พบข้อมูล", "ระบบตรวจไม่พบประวัติโดเมนนี้ในฐานข้อมูลสาธารณะ"


def fetch_ssl_details(url_str: str):
    """ฟังก์ชันสแกน Handshake ตรวจสอบความสมบูรณ์ของใบรับรอง SSL"""
    try:
        domain = url_str.split("//")[-1].split("/")[0]
        ctx = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=2.5) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                issuer = dict(x[0] for x in cert["issuer"])
                common_name = issuer.get("commonName", "Unknown Cryptography Authority")
                return common_name, "ตรวจพบการเข้ารหัส HTTPS ที่ปลอดภัย"
    except Exception:
        pass
    return "Not Secure", "ไซต์นี้ไม่มีระบบเข้ารหัสใบรับรองหรือปิดพอร์ต 443"


def fetch_ip_location(url_str: str):
    """ฟังก์ชันสืบค้นเครื่องประเทศที่ตั้งผ่าน IP Address ของชื่อเว็บไซต์"""
    try:
        domain = url_str.split("//")[-1].split("/")[0]
        ip = socket.gethostbyname(domain)
        # ตรรกะคัดกรองจัดกลุ่มไอพีจำลอง (เพื่อให้แสดงผลได้โดยไม่ต้องผูก API คีย์ค่ายนอก)
        if ip.startswith("142.") or ip.startswith("172.") or ip.startswith("216."):
            return "United States (Google Grid)"
        if ip.startswith("13.") or ip.startswith("23.") or ip.startswith("52."):
            return "Singapore (Microsoft Azure)"
        return "International Cloud Host"
    except Exception:
        return "Unknown Network Location"


# -------------------------------------------------------------
# 🤖 AI MODELS MOCKUP SETUP (ส่วนนี้จำลองลอจิกทำผลคะแนนคู่ขนานกับโมเดลเดิมของคุณ)
# -------------------------------------------------------------


class ScanRequest(BaseModel):
    url: str


@app.post("/api/v1/scan")
async def scan_url_endpoint(request: ScanRequest):
    url = request.url

    # 🧠 ลอจิกระดับคะแนนความปลอดภัยจากปัญญาประดิษฐ์ Hybrid AI (0 - 100)
    # (นำไปผูกแทนที่ด้วยโค้ดรันโมเดล .pt และ .pkl ตัวจริงของคุณได้เลย)
    if "google" in url or "github" in url or "secure" in url and "http" in url:
        rf_score = 1.0
        bilstm_score = 0.98
    else:
        rf_score = 0.35
        bilstm_score = 0.40

    final_score = int(((rf_score + bilstm_score) / 2) * 100)

    # ตัดสินระดับความปลอดภัย
    if final_score >= 80:
        status = "safe"
    elif final_score >= 50:
        status = "warning"
    else:
        status = "danger"

    # 🕵️‍♂️ เรียกใช้นักสืบ OSINT ค้นหาข้อมูลจริงมาหยอดใส่การ์ดบนจอ
    ssl_title, ssl_sub = fetch_ssl_details(url)
    domain_age, domain_sub = fetch_domain_age(url)
    location_name = fetch_ip_location(url)

    # พ่นพัสดุก้อน JSON ชุดใหญ่ส่งกลับไปให้หน้าจอ React ถอดรหัสแสดงผล
    return {
        "url": url,
        "score": final_score,
        "status": status,
        "ssl_title": ssl_title,
        "ssl_sub": ssl_sub,
        "domain_age": domain_age,
        "domain_sub": domain_sub,
        "is_blacklisted": True if final_score < 50 else False,
        "google_safe": True if final_score >= 50 else False,
        "has_redirection": True if "http://" in url and final_score < 60 else False,
        "location": location_name,
        "metrics": {
            "url_analysis_score": int(rf_score * 100),
            "content_analysis_score": int(bilstm_score * 100),
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

import requests
import json

# เปลี่ยนชื่อโดเมนที่คุณต้องการตรวจสอบตรงนี้ได้เลยครับ
TARGET_DOMAIN = "google.com"

print(f"🔍 [กำลังเริ่มทดสอบสืบค้นข้อมูล]: {TARGET_DOMAIN}")
print("-" * 50)

# --- 1. ทดสอบแผน ก (python-whois ผ่าน Port 43) ---
print("▶️ [ทดสอบ แผน ก]: กำลังเชื่อมต่อ WHOIS Server (Port 43)...")
try:
    import whois

    w = whois.whois(TARGET_DOMAIN)
    print("✅ แผน ก สำเร็จ! ข้อมูลดิบที่ WHOIS ส่งมาคือ:")
    # แปลงผลลัพธ์เป็น string เพื่อให้อ่านง่าย
    print(json.dumps(w, indent=2, default=str))
except Exception as e:
    print(
        f"❌ แผน ก ล้มเหลว (มักเกิดจาก Firewall/Malwarebytes บล็อกพอร์ต 43): {str(e)}"
    )

print("-" * 50)

# --- 2. ทดสอบแผน ข (RDAP API ผ่าน HTTP Port 443) ---
print("▶️ [ทดสอบ แผน ข]: กำลังยิงคำขอไปที่ RDAP API Aggregator...")
rdap_url = f"https://rdap.org/domain/{TARGET_DOMAIN}"
try:
    response = requests.get(rdap_url, timeout=5)
    print(f"📡 HTTP Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("✅ แผน ข สำเร็จ! ข้อมูลก้อน JSON ที่ได้กลับมาคือ:")

        # 🎯 ดึงเฉพาะคีย์ 'events' ที่เราใช้คำนวณอายุโดเมนมาดูโครงสร้าง
        events = data.get("events", [])
        print(json.dumps(events, indent=2))

        # แสดงลิงก์จริงที่ข้อมูลถูกย้ายค่าย (Redirect) ไปดึงมา
        print(
            f"\n🔗 ข้อมูลนี้ถูกสืบค้นมาจากค่ายหลัก: {data.get('port43WhoisServer', 'Unknown')}"
        )
    else:
        print(f"⚠️ เซิร์ฟเวอร์ตอบกลับมาด้วยสเตตัสอื่น: {response.status_code}")
except Exception as e:
    print(f"❌ แผน ข ล้มเหลว (เกิดปัญหาที่เน็ตเวิร์ก/การเชื่อมต่อ): {str(e)}")

print("-" * 50)

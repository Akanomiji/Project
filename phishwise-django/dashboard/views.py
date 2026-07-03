from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from detector.models import ScanHistory


DEMO_USERS = {
    "somchai@test.com": {"password": "123456", "name": "Somchai", "role": "USER"},
    "admin@test.com": {"password": "123456", "name": "Admin", "role": "ADMIN"},
}


ARTICLES = [
    {
        "id": 1,
        "title": "วิธีสังเกตลิงก์ปลอม (Phishing) แบบมือโปร",
        "category": "Phishing",
        "author": "PhishWise Team",
        "date": "29 ม.ค. 2026",
        "desc": "เรียนรู้วิธีดู URL แปลกๆ ก่อนคลิก",
        "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
        "content": "Phishing มักใช้ชื่อเว็บที่คล้ายของจริงเพื่อหลอกให้กรอกข้อมูลสำคัญ. ให้ตรวจตัวสะกด โดเมนย่อย และสัญลักษณ์แปลกๆ ก่อนเสมอ.",
    },
    {
        "id": 2,
        "title": "รหัสผ่านที่ปลอดภัยคืออะไร?",
        "category": "Security",
        "author": "SecAdmin",
        "date": "30 ม.ค. 2026",
        "desc": "อย่าใช้ 123456",
        "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
        "content": "ใช้ passphrase ที่ยาวและไม่ซ้ำกัน เปิดใช้ 2FA ทุกครั้งที่ทำได้ และเก็บรหัสผ่านด้วย password manager.",
    },
    {
        "id": 3,
        "title": "เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่",
        "category": "Scams",
        "author": "Cyber Alert",
        "date": "1 ก.พ. 2026",
        "desc": "หลอกลวงด้วยจิตวิทยา",
        "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
        "content": "การโทรหลอกให้โอนเงินหรือส่งรหัส OTP เป็นรูปแบบการโจมตีที่พบบ่อยมาก. อย่าเชื่อคำขู่ และโทรเช็กหน่วยงานจริงเสมอ.",
    },
    {
        "id": 4,
        "title": "Ransomware คืออะไร?",
        "category": "Malware",
        "author": "MalwareHunter",
        "date": "2 ก.พ. 2026",
        "desc": "มัลแวร์เรียกค่าไถ่",
        "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        "content": "Ransomware เข้ารหัสไฟล์ของเหยื่อแล้วเรียกค่าไถ่. การสำรองข้อมูลแบบ 3-2-1 คือแนวป้องกันที่ควรมี.",
    },
    {
        "id": 5,
        "title": "2FA คืออะไร ทำไมต้องเปิดใช้งานเดี๋ยวนี้?",
        "category": "Security",
        "author": "AuthExpert",
        "date": "3 ก.พ. 2026",
        "desc": "เพิ่มความปลอดภัยอีกชั้น",
        "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200",
        "content": "2FA ทำให้บัญชีปลอดภัยขึ้นอย่างมาก โดยเฉพาะเมื่อใช้แอป Authenticator แทน SMS OTP.",
    },
    {
        "id": 6,
        "title": "Public Wi-Fi อันตรายแค่ไหน?",
        "category": "Security",
        "author": "NetGuard",
        "date": "5 ก.พ. 2026",
        "desc": "ใช้ยังไงให้รอด",
        "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
        "content": "Wi-Fi สาธารณะอาจถูกดักฟังข้อมูลได้. หลีกเลี่ยงการทำธุรกรรมสำคัญและใช้ VPN เมื่อจำเป็น.",
    },
    {
        "id": 7,
        "title": "Deepfake: ภัยเงียบจาก AI",
        "category": "Scams",
        "author": "AI Watch",
        "date": "7 ก.พ. 2026",
        "desc": "เมื่อภาพและเสียงเชื่อไม่ได้",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
        "content": "AI สามารถปลอมเสียงและวิดีโอได้แนบเนียน. ให้ยืนยันตัวตนด้วยคำถามหรือช่องทางอื่นเสมอ.",
    },
    {
        "id": 8,
        "title": "วิธีเช็กว่าข้อมูลหลุดไปใน Dark Web หรือไม่",
        "category": "Privacy",
        "author": "PrivacyFirst",
        "date": "8 ก.พ. 2026",
        "desc": "ตรวจสอบอีเมลที่รั่วไหล",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200",
        "content": "ถ้าอีเมลรั่ว ให้รีบเปลี่ยนรหัสผ่านและเปิด 2FA. การตรวจเช็กผ่านแหล่งข้อมูลสาธารณะที่เชื่อถือได้ช่วยลดความเสี่ยงได้มาก.",
    },
    {
        "id": 9,
        "title": "แอปดูดเงินทำงานอย่างไร?",
        "category": "Malware",
        "author": "Tech Insider",
        "date": "10 ก.พ. 2026",
        "desc": "เจาะลึก Accessibility Service",
        "image": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200",
        "content": "แอปอันตรายมักขอสิทธิ์ Accessibility เพื่ออ่านหน้าจอและสั่งกดปุ่มแทนผู้ใช้. อย่าให้สิทธิ์ที่ไม่จำเป็น.",
    },
    {
        "id": 10,
        "title": "ทำความรู้จักกับ Social Engineering",
        "category": "Scams",
        "author": "PsyCyber",
        "date": "12 ก.พ. 2026",
        "desc": "ศิลปะการหลอกคน",
        "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
        "content": "Social Engineering เล่นกับความกลัว ความโลภ และความรีบเร่งของเหยื่อ. หยุดคิดและตรวจสอบก่อนคลิกหรือโอนเสมอ.",
    },
    {
        "id": 11,
        "title": "ปลอดภัยเมื่อช้อปปิ้งออนไลน์",
        "category": "Privacy",
        "author": "ShopSafe",
        "date": "14 ก.พ. 2026",
        "desc": "ไม่ให้โดนโกง",
        "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
        "content": "ตรวจสอบร้านค้า รีวิว และวิธีชำระเงินทุกครั้ง. หลีกเลี่ยงการส่งข้อมูลบัตรตรงไปยังเว็บที่ไม่น่าเชื่อถือ.",
    },
    {
        "id": 12,
        "title": "จัดการ Cookie ใน Browser เพื่อความเป็นส่วนตัว",
        "category": "Privacy",
        "author": "DataGuard",
        "date": "15 ก.พ. 2026",
        "desc": "คุกกี้ไม่ได้มีไว้กิน",
        "image": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200",
        "content": "ควรจัดการ cookie และ tracking อย่างเหมาะสม โดยเฉพาะเมื่อไม่ต้องการให้เว็บติดตามพฤติกรรมของเรา.",
    },
]


def current_user(request):
    if not request.session.get("user_email"):
        return None
    return {
        "name": request.session.get("user_name", "User"),
        "email": request.session.get("user_email", ""),
        "role": request.session.get("user_role", "USER"),
    }


def home(request):
    return render(request, "home.html", {"current_user": current_user(request)})


def login_view(request):
    error = ""
    if request.method == "POST":
        email = request.POST.get("email", "").strip().lower()
        password = request.POST.get("password", "")
        user = DEMO_USERS.get(email)
        if user and user["password"] == password:
            request.session["user_email"] = email
            request.session["user_name"] = user["name"]
            request.session["user_role"] = user["role"]
            return redirect("admin" if user["role"] == "ADMIN" else "dashboard")
        error = "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    return render(request, "login.html", {"error": error, "current_user": current_user(request)})


def logout_view(request):
    request.session.flush()
    return redirect("home")


def register_view(request):
    success = False
    if request.method == "POST":
        success = True
    return render(request, "register.html", {"success": success, "current_user": current_user(request)})


def forgot_password_view(request):
    success = False
    email = ""
    if request.method == "POST":
        email = request.POST.get("email", "")
        success = True
    return render(
        request,
        "forgot_password.html",
        {"success": success, "email": email, "current_user": current_user(request)},
    )


def dashboard_view(request):
    return render(request, "dashboard.html", {"current_user": current_user(request)})


def admin_view(request):
    return render(
        request,
        "admin.html",
        {"current_user": current_user(request), "hide_navbar": True},
    )


def result_view(request):
    return render(request, "result.html", {"current_user": current_user(request)})


def report_view(request):
    submitted = request.method == "POST"
    return render(
        request,
        "report.html",
        {"submitted": submitted, "current_user": current_user(request)},
    )


def history_view(request):
    my_reports = [
        {"id": 1, "url": "http://scb-verify-login.com", "type": "Phishing", "date": "12 ก.พ. 2026", "status": "Pending"},
        {"id": 2, "url": "https://free-iphone-15.net", "type": "Scam", "date": "10 ก.พ. 2026", "status": "Verified"},
        {"id": 3, "url": "https://www.google.com", "type": "Other", "date": "05 ก.พ. 2026", "status": "Rejected"},
        {"id": 4, "url": "http://bit.ly/fake-bank", "type": "Phishing", "date": "04 ก.พ. 2026", "status": "Pending"},
        {"id": 5, "url": "https://secure-pay-web.com", "type": "Scam", "date": "03 ก.พ. 2026", "status": "Verified"},
        {"id": 6, "url": "http://malware-site.net", "type": "Malware", "date": "02 ก.พ. 2026", "status": "Pending"},
        {"id": 7, "url": "https://verify-account.io", "type": "Phishing", "date": "01 ก.พ. 2026", "status": "Rejected"},
    ]
    return render(request, "history.html", {"my_reports": my_reports, "current_user": current_user(request)})


def scan_history_view(request):
    scan_data = ScanHistory.objects.order_by("-timestamp")
    return render(request, "scan_history.html", {"scan_data": scan_data, "current_user": current_user(request)})


def knowledge_view(request):
    return render(request, "knowledge.html", {"articles": ARTICLES, "current_user": current_user(request)})


def knowledge_detail_view(request, id):
    article = next((item for item in ARTICLES if item["id"] == id), None)
    return render(
        request,
        "knowledge_detail.html",
        {"article": article, "current_user": current_user(request)},
    )

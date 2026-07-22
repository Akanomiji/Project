import cv2
import numpy as np
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.utils import timezone
from detector.models import ScanHistory
from detector.services import scan_url_logic

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
        "author_role": "Cybersecurity Specialist",
        "date": "29 ม.ค. 2026",
        "read_time": "4 นาที",
        "desc": "เจาะลึกเทคนิคการตรวจสอบ URL แปลกๆ ก่อนคลิก ป้องกันการถูกหลอกกรอกข้อมูลส่วนตัว",
        "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
        "summary": "Phishing เป็นภัยไซเบอร์อันดับ 1 ที่ผู้ใช้อินเทอร์เน็ตมักตกเป็นเหยื่อ โดยแฮกเกอร์จะสร้างเว็บไซต์ปลอมที่เลียนแบบหน้าตาเว็บธนาคารหรือโซเชียลมีเดีย เพื่อหลอกเอาข้อมูลรหัสผ่านและบัตรเครดิต",
        "sections": [
            {
                "title": "1. สังเกตชื่อโดเมน (Domain Name) ให้ละเอียด",
                "text": "แฮกเกอร์มักใช้เทคนิค Typosquatting หรือการจดชื่อโดเมนที่เขียนคล้ายกับของจริงจนผู้ใช้ไม่ทันสังเกต เช่น เปลี่ยนตัว l เป็นเลข 1 หรือเติมคำหลอกลวงข้างหลังชื่อแบรนด์",
                "image": "https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&q=80&w=1000",
                "caption": "ตัวอย่างการสังเกตชื่อโดเมนในช่อง Address Bar",
                "examples": [
                    {
                        "label": "URL ของจริง",
                        "url": "https://www.scb.co.th",
                        "is_safe": True,
                    },
                    {
                        "label": "URL ปลอม (สะกดผิด)",
                        "url": "https://www.scb-verify-online.com",
                        "is_safe": False,
                    },
                    {
                        "label": "URL ปลอม (ใช้ตัวเลขแทน)",
                        "url": "http://www.g00gle.com",
                        "is_safe": False,
                    },
                ],
            },
            {
                "title": "2. เช็กการเข้ารหัส SSL/TLS (https://)",
                "text": "หากพบว่าเว็บไหนขึ้นต้นด้วย http:// (ไม่มี s) ให้สงสัยไว้ก่อนว่าเป็นเว็บที่ไม่ปลอดภัย และไม่ควรกรอกข้อมูลสำคัญใดๆ เด็ดขาด",
                "callout": {
                    "type": "warning",
                    "title": "⚠️ ข้อควรระวัง!",
                    "text": "การมีรูปแม่กุญแจ 🔒 (https://) ไม่ได้แปลว่าเว็บนั้นเป็นเว็บดี 100% เพราะแฮกเกอร์ก็สามารถขอใบรับรอง SSL ฟรีได้เช่นกัน จึงต้องเช็กชื่อโดเมนควบคู่กันเสมอ",
                },
            },
            {
                "title": "3. ระวัง Short URL หรือ Dynamic QR Code",
                "text": "คนร้ายมักซ่อน URL จริงไว้หลังบริการย่อลิงก์ เช่น bit.ly, tinyurl หรือคิวอาร์โค้ดตามป้ายประกาศ เพื่อปิดบังปลายทางที่แท้จริง",
                "callout": {
                    "type": "tip",
                    "title": "💡 Pro Tip จาก PhishWise",
                    "text": "หากเจอลิงก์ย่อ หรือ QR Code สามารถนำมาสแกนผ่าน PhishWise เพื่อถอดรหัสหาลิงก์ปลายทางจริงได้ก่อนกดเข้าไปครับ",
                },
            },
        ],
        "key_takeaways": [
            "อย่ารีบร้อนคลิกลิงก์จาก SMS หรืออีเมลที่ไม่คุ้นเคย",
            "ตรวจสอบชื่อโดเมนหลัก (คำที่อยู่หน้า .com / .co.th) ทุกครั้ง",
            "หากไม่แน่ใจ ให้พิมพ์ชื่อเว็บเพื่อเข้าใช้งานด้วยตนเองเสมอ",
        ],
    },
    {
        "id": 2,
        "title": "รหัสผ่านที่ปลอดภัยคืออะไร?",
        "category": "Security",
        "author": "SecAdmin",
        "author_role": "Security Engineer",
        "date": "30 ม.ค. 2026",
        "read_time": "3 นาที",
        "desc": "เลิกใช้ 123456 แล้วเปลี่ยนมาใช้ Passphrase เพื่อความปลอดภัยขั้นสุด",
        "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200",
        "summary": "รหัสผ่านเปรียบเสมือนด่านแรกในการปกป้องข้อมูลส่วนตัว การใช้รหัสผ่านที่เดาง่ายทำให้บัญชีของคุณเสี่ยงต่อการถูกแฮกแบบ Brute Force หรือ Dictionary Attack",
        "sections": [
            {
                "title": "1. เปลี่ยนจาก Password เป็น Passphrase",
                "text": "แทนที่จะใช้รหัสผ่านสั้นๆ แต่จำยาก เช่น P@ssw0rd! ให้เปลี่ยนมาใช้ประโยคยาวๆ ที่นำคำที่ไม่เกี่ยวข้องกันมารวมกัน เช่น 'CoffeeCatMoon2026!' ซึ่งสุ่มเดาได้ยากมากสำหรับระบบคอมพิวเตอร์",
                "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1000",
                "caption": "ความยาวของรหัสผ่านสำคัญกว่าความซับซ้อนในการป้องกันการสุ่มรหัสผ่าน",
            },
            {
                "title": "2. ห้ามใช้รหัสผ่านซ้ำกันเด็ดขาด",
                "text": "หากคุณใช้รหัสผ่านเดียวกันในทุกบริการ เมื่อมีเว็บใดเว็บหนึ่งทำข้อมูลรั่วไหล แฮกเกอร์จะนำรหัสผ่านนั้นไปลองเข้าสู่ระบบในบริการอื่นๆ (Credential Stuffing) ทันที",
                "callout": {
                    "type": "warning",
                    "title": "🔒 ตัวช่วยจัดการรหัสผ่าน",
                    "text": "แนะนำให้ใช้ Password Manager เช่น Bitwarden หรือ 1Password ในการช่วยสุ่มและบันทึกรหัสผ่านที่ซับซ้อนให้คุณโดยไม่ต้องจำเอง",
                },
            },
        ],
        "key_takeaways": [
            "ความยาวรหัสผ่านควรมีอย่างน้อย 12-16 ตัวอักษรขึ้นไป",
            "ผสมผสานตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์",
            "หลีกเลี่ยงข้อมูลส่วนตัว เช่น วันเกิด เบอร์โทรศัพท์ หรือชื่อสัตว์เลี้ยง",
        ],
    },
    {
        "id": 3,
        "title": "เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่",
        "category": "Scams",
        "author": "Cyber Alert",
        "author_role": "Threat Intelligence",
        "date": "1 ก.พ. 2026",
        "read_time": "5 นาที",
        "desc": "เจาะลึกจิตวิทยาการหลอกลวงทางโทรศัพท์ข่มขู่ให้โอนเงิน",
        "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
        "summary": "แก๊งคอลเซ็นเตอร์พัฒนารูปแบบการหลอกลวงอย่างต่อเนื่อง โดยใช้บทบาทสมมติเป็นเจ้าหน้าที่รัฐ ไปรษณีย์ หรือค่ายมือถือ เพื่อข่มขู่ให้เหยื่อเกิดความกลัวและโอนเงินตรวจสอบ",
        "sections": [
            {
                "title": "1. บทบาทสมมติที่มักถูกอ้างถึง",
                "text": "มักแอบอ้างเป็นตำรวจ เจ้าหน้าที่กรมภาษี DSI หรือพนักงานขนส่ง อ้างว่ามีพัสดุผิดกฎหมายส่งมาถึงคุณ หรือบัญชีของคุณเข้าไปเกี่ยวข้องกับการฟอกเงิน",
                "callout": {
                    "type": "warning",
                    "title": "🚫 กฎเหล็กของหน่วยงานรัฐ",
                    "text": "หน่วยงานราชการและธนาคารไม่มีนโยบายโทรศัพท์มาขอรหัส OTP หรือให้โอนเงินมาเพื่อ 'ตรวจสอบ' โดยเด็ดขาด",
                },
            },
            {
                "title": "2. การตัดสายและตรวจสอบย้อนกลับ",
                "text": "หากได้รับสายที่น่าสงสัย ให้ตั้งสติและ 'กดตัดสายทันที' อย่าสนทนาต่อ จากนั้นให้ติดต่อกลับไปยังเบอร์ Call Center อย่างเป็นทางการของหน่วยงานนั้นๆ ด้วยตนเอง",
            },
        ],
        "key_takeaways": [
            "อย่าโอนเงินตามคำบอกเล่าทางโทรศัพท์ไม่ว่ากรณีใดๆ",
            "ตั้งสติและอย่าหลงเชื่อคำข่มขู่ที่ให้ตัดสินใจทันที",
            "บันทึกเบอร์โทรศัพท์สายด่วนแจ้งความภัยออนไลน์ 1441",
        ],
    },
    {
        "id": 4,
        "title": "Ransomware คืออะไร? รู้ทันไวรัสเรียกค่าไถ่",
        "category": "Malware",
        "author": "MalwareHunter",
        "author_role": "Incident Responder",
        "date": "2 ก.พ. 2026",
        "read_time": "4 นาที",
        "desc": "แนวทางป้องกันไม่ให้ไฟล์และระบบของคุณถูกล็อกเรียกค่าไถ่",
        "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        "summary": "Ransomware คือมัลแวร์ประเภทหนึ่งที่จะทำการเข้ารหัสลับ (Encrypt) ไฟล์ทั้งหมดบนเครื่องคอมพิวเตอร์ ทำให้อ่านไฟล์ไม่ได้ แล้วแสดงข้อความเรียกค่าไถ่เป็น Cryptocurrency",
        "sections": [
            {
                "title": "1. ช่องทางการแพร่กระจาย",
                "text": "ส่วนใหญ่มากับไฟล์แนบในอีเมล (เช่น .exe, .zip, .pdf ปลอม) หรือการดาวน์โหลดซอฟต์แวร์เถื่อน/สายมืดผ่านเว็บไซต์ที่ไม่น่าเชื่อถือ",
                "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
                "caption": "หน้าจอแสดงข้อความเรียกค่าไถ่เมื่อเครื่องติด Ransomware",
            },
            {
                "title": "2. กลยุทธ์การสำรองข้อมูล 3-2-1",
                "text": "สำรองข้อมูลอย่างน้อย 3 ชุด ไว้ในสื่อจัดเก็บ 2 ประเภทที่แตกต่างกัน และเก็บไว้ภายนอกสถานที่หรือ Offline 1 ชุด (เช่น External Hard Drive ที่ไม่ได้เสียบค้างไว้)",
                "callout": {
                    "type": "tip",
                    "title": "💡 คำแนะนำ",
                    "text": "หากเครื่องติด Ransomware ไม่แนะนำให้จ่ายค่าไถ่ เพราะไม่มีหลักประกันว่าจะได้รหัสปลดล็อกคืน และเป็นการสนับสนุนกลุ่มอาชญากร",
                },
            },
        ],
        "key_takeaways": [
            "ทำความสะอาดเครื่องด้วย Antivirus และอัปเดตระบบปฏิบัติการสม่ำเสมอ",
            "ไม่เปิดไฟล์แนบอีเมลจากผู้ส่งที่ไม่รู้จัก",
            "สำรองข้อมูลสำคัญแบบ Offline เป็นประจำ",
        ],
    },
    {
        "id": 5,
        "title": "2FA คืออะไร ทำไมต้องเปิดใช้งานเดี๋ยวนี้?",
        "category": "Security",
        "author": "AuthExpert",
        "author_role": "IAM Specialist",
        "date": "3 ก.พ. 2026",
        "read_time": "3 นาที",
        "desc": "ยกระดับความปลอดภัยด้วยการยืนยันตัวตนสองปัจจัย",
        "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200",
        "summary": "Two-Factor Authentication (2FA) คือการใช้ปัจจัยยืนยันตัวตนอย่างน้อย 2 อย่างขึ้นไปในการเข้าสู่ระบบ แม้แฮกเกอร์จะรู้รหัสผ่านของคุณ แต่ก็จะเข้าใช้งานไม่ได้หากไม่มีปัจจัยที่สอง",
        "sections": [
            {
                "title": "1. ปัจจัยในการยืนยันตัวตนมีอะไรบ้าง?",
                "text": "1. สิ่งที่คุณรู้ (เช่น รหัสผ่าน, PIN) \n2. สิ่งที่คุณมี (เช่น สมาร์ตโฟน, แอป Authenticator, Security Key) \n3. สิ่งที่คุณเป็น (เช่น ลายนิ้วมือ, ใบหน้า)",
                "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
                "caption": "แอป Authenticator ปลอดภัยกว่าการรับ OTP ผ่าน SMS",
            },
            {
                "title": "2. ทำไมควรเลือกแอป Authenticator แทน SMS?",
                "text": "การรับ OTP ผ่าน SMS มีความเสี่ยงที่จะถูกดักจับหรือทำ SIM Swap ได้ แนะนำให้ใช้แอป เช่น Google Authenticator, Microsoft Authenticator หรือ Passkey แทน",
                "callout": {
                    "type": "tip",
                    "title": "💡 อย่าลืมเก็บ Backup Codes!",
                    "text": "เมื่อเปิดใช้งาน 2FA ระบบจะให้รหัสสำรอง (Backup Codes) ควรพิมพ์หรือเซฟเก็บไว้ในที่ปลอดภัย เผื่อกรณีโทรศัพท์หาย",
                },
            },
        ],
        "key_takeaways": [
            "เปิดใช้งาน 2FA ในทุกบัญชีสำคัญ เช่น อีเมล โซเชียล และแอปการเงิน",
            "เลี่ยงการรับ OTP ผ่าน SMS หากเลือกใช้แอป Authenticator ได้",
            "เก็บรักษา Backup Codes ไว้ในสถานที่ปลอดภัย",
        ],
    },
    {
        "id": 6,
        "title": "Public Wi-Fi อันตรายแค่ไหน? ใช้ยังไงให้รอด",
        "category": "Security",
        "author": "NetGuard",
        "author_role": "Network Security Engineer",
        "date": "5 ก.พ. 2026",
        "read_time": "4 นาที",
        "desc": "เล่นเน็ตฟรีตามคาเฟ่หรือสนามบินอย่างไรไม่ให้ถูกแอบดักข้อมูล",
        "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
        "summary": "Wi-Fi สาธารณะเปิดโอกาสให้ผู้ไม่หวังดีสามารถใช้เทคนิค Man-in-the-Middle (MitM) เพื่อดักจับข้อมูลการใช้อินเทอร์เน็ตที่ไม่ได้เข้ารหัสได้อย่างง่ายดาย",
        "sections": [
            {
                "title": "1. สัญญาณอันตรายจาก Wi-Fi ปลอม (Evil Twin)",
                "text": "แฮกเกอร์อาจตั้งชื่อ Wi-Fi เลียนแบบสถานที่ เช่น 'Cafe_Free_WiFi' เพื่อหลอกให้คุณเชื่อมต่อ แล้วดักจับข้อมูลทั้งหมดที่วิ่งผ่าน",
                "callout": {
                    "type": "warning",
                    "title": "⚠️ ข้อห้ามสำคัญ",
                    "text": "อย่าทำธุรกรรมทางการเงินหรือกรอกรหัสผ่านสำคัญเมื่อเชื่อมต่อ Wi-Fi สาธารณะ",
                },
            },
            {
                "title": "2. วิธีป้องกันตัวเมื่อจำเป็นต้องใช้งาน",
                "text": "หากจำเป็นต้องใช้ ให้เชื่อมต่อผ่าน VPN (Virtual Private Network) เสมอ เพื่อทำการเข้ารหัสข้อมูลตั้งแต่เครื่องของคุณจนถึงปลายทาง",
            },
        ],
        "key_takeaways": [
            "ปิดการตั้งค่า Auto-Connect Wi-Fi ในโทรศัพท์",
            "เปิดใช้งาน VPN ทุกครั้งที่ต่อเน็ตสาธารณะ",
            "ใช้ Personal Hotspot จากมือถือตัวเองดีที่สุด",
        ],
    },
    {
        "id": 7,
        "title": "Deepfake: ภัยเงียบจาก AI ปลอมภาพและเสียง",
        "category": "Scams",
        "author": "AI Watch",
        "author_role": "AI Research Ethics",
        "date": "7 ก.พ. 2026",
        "read_time": "4 นาที",
        "desc": "เมื่อรูปภาพและคลิปเสียงไม่สามารถเชื่อได้อีกต่อไป",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
        "summary": "เทคโนโลยี AI ในปัจจุบันสามารถเลียนแบบใบหน้าและเสียงของบุคคลได้อย่างแนบเนียน คนร้ายจึงนำมาใช้ปลอมเป็นญาติหรือผู้บริหารเพื่อหลอกให้โอนเงิน",
        "sections": [
            {
                "title": "1. วิธีสังเกตวิดีโอ Deepfake",
                "text": "สังเกตการกระพริบตาที่ไม่เป็นธรรมชาติ ขอบใบหน้าหรือเส้นผมที่ดูเบลอๆ หรือจังหวะการขยับปากที่ไม่ตรงกับเสียงพูด",
                "image": "https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&q=80&w=1000",
                "caption": "เทคโนโลยี AI เจนเนอเรทีฟสามารถสร้างใบหน้าคนปลอมได้อย่างสมบูรณ์",
            },
            {
                "title": "2. วิธีรับมือเมื่อสงสัยว่าโดนปลอมเสียงหรือหน้า",
                "text": "ลองตั้งคำถามส่วนตัวที่มีเพียงคุณกับเขาเท่านั้นที่รู้ หรือขอให้ผู้พูดหันหน้าข้างเพื่อสังเกตความผิดปกติของภาพ AI",
                "callout": {
                    "type": "tip",
                    "title": "💡 ยืนยันผ่านช่องทางอื่น",
                    "text": "โทรกลับหาบุคคลนั้นโดยตรงผ่านเบอร์โทรศัพท์ปกติ แทนการคุยผ่านแอปพลิเคชันที่ติดต่อมา",
                },
            },
        ],
        "key_takeaways": [
            "อย่าปักใจเชื่อวิดีโอคอลหรือคลิปเสียงขอยืมเงินทันที",
            "สังเกตรายละเอียดรอบใบหน้า แสง และเงา",
            "ตั้งรหัสลับเฉพาะครอบครัวสำหรับยืนยันตัวตนกรณีฉุกเฉิน",
        ],
    },
    {
        "id": 8,
        "title": "วิธีเช็กว่าข้อมูลหลุดไปใน Dark Web หรือไม่",
        "category": "Privacy",
        "author": "PrivacyFirst",
        "author_role": "Data Privacy Consultant",
        "date": "8 ก.พ. 2026",
        "read_time": "3 นาที",
        "desc": "ตรวจสอบและป้องกันเมื่ออีเมลหรือรหัสผ่านถูกนำไปซื้อขายในตลาดมืด",
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200",
        "summary": "เมื่อเว็บไซต์ที่คุณใช้งานถูกแฮก ข้อมูลบัญชีและรหัสผ่านมักถูกนำไปรวบรวมเพื่อขายใน Dark Web ทำให้อาจโดนสวมรอยเข้าใช้งานในบริการอื่นได้",
        "sections": [
            {
                "title": "1. ตรวจสอบข้อมูลรั่วไหลได้อย่างไร?",
                "text": "สามารถใช้บริการตรวจสอบที่น่าเชื่อถือ เช่น 'Have I Been Pwned' หรือฟีเจอร์ Password Checkup ใน Google Chrome เพื่อเช็กว่าอีเมลของคุณอยู่ในฐานข้อมูลที่หลุดหรือไม่",
                "callout": {
                    "type": "warning",
                    "title": "🚨 สิ่งที่ต้องทำทันทีหากข้อมูลหลุด",
                    "text": "1. เปลี่ยนรหัสผ่านของบัญชีนั้นๆ ทันที \n2. เปลี่ยนรหัสผ่านของเว็บอื่นที่ใช้รหัสเดียวกัน \n3. เปิดใช้งาน 2FA ทันที",
                },
            }
        ],
        "key_takeaways": [
            "หมั่น ตรวจสอบประวัติการรั่วไหลของอีเมลตนเอง",
            "เปิดแจ้งเตือนการเข้าสู่ระบบจากอุปกรณ์ใหม่",
            "เปลี่ยนรหัสผ่านเป็นประจำหากสงสัยว่ามีความเสี่ยง",
        ],
    },
    {
        "id": 9,
        "title": "แอปดูดเงินทำงานอย่างไร? และวิธีป้องกันบนสมาร์ตโฟน",
        "category": "Malware",
        "author": "Tech Insider",
        "author_role": "Mobile Security Researcher",
        "date": "10 ก.พ. 2026",
        "read_time": "5 นาที",
        "desc": "เจาะลึกภัยร้ายจากการหลอกให้ติดตั้งแอป APK นอก Store และสิทธิ์ Accessibility",
        "image": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200",
        "summary": "แอปดูดเงินไม่ได้แฮกจากระบบธนาคารโดยตรง แต่ใช้วิธีหลอกให้เหยื่อติดตั้งแอปแฝงมัลแวร์ แล้วขอสิทธิ์ Accessibility Service เพื่อเข้าควบคุมหน้าจอมือถือของเหยื่อ",
        "sections": [
            {
                "title": "1. ขั้นตอนการหลอกลวงของมัลแวร์",
                "text": "1. ส่ง SMS หรือโทรหลอกว่าเป็นเจ้าหน้าที่ \n2. ให้แอดไลน์แล้วส่งลิงก์ดาวน์โหลดไฟล์ .APK \n3. หลอกให้เปิดสิทธิ์การเข้าถึง (Accessibility Services) \n4. หน้าจอโทรศัพท์จะค้างหรือดับไป ในขณะที่คนร้ายกำลังโอนเงินออก",
                "callout": {
                    "type": "warning",
                    "title": "⛔ ข้อห้ามเด็ดขาด",
                    "text": "อย่าดาวน์โหลดหรือติดตั้งไฟล์แอปพลิเคชันที่มีนามสกุล .APK จากลิงก์ในไลน์หรือเว็บนอก Play Store / App Store เด็ดขาด",
                },
            }
        ],
        "key_takeaways": [
            "ดาวน์โหลดแอปพลิเคชันจาก Official Store เท่านั้น",
            "ไม่เปิดสิทธิ์ Accessibility Service ให้แอปที่ไม่รู้จัก",
            "หากโทรศัพท์ค้างและสงสัยโดนควบคุม ให้รีบกดปิดเครื่องหรือตัดสัญญาณเน็ตทันที",
        ],
    },
    {
        "id": 10,
        "title": "ทำความรู้จักกับ Social Engineering (จิตวิทยาการหลอกลวง)",
        "category": "Scams",
        "author": "PsyCyber",
        "author_role": "Cyberpsychologist",
        "date": "12 ก.พ. 2026",
        "read_time": "4 นาที",
        "desc": "เข้าใจศิลปะการเจาะระบบผ่านจุดอ่อนที่สุด นั่นคือ 'ความรู้สึกของมนุษย์'",
        "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
        "summary": "Social Engineering ไม่ได้ใช้การเขียนโค้ดที่ซับซ้อน แต่เป็นการเล่นกับอารมณ์ของมนุษย์ เช่น ความกลัว ความโลภ ความเห็นใจ หรือความเร่งรีบ เพื่อให้เหยื่อยอมส่งมอบข้อมูลสำคัญด้วยตนเอง",
        "sections": [
            {
                "title": "1. อารมณ์ที่คนร้ายมักนำมาใช้หลอกลวง",
                "text": "• **ความเร่งด่วน:** 'บัญชีของคุณจะถูกปิดภายใน 2 ชั่วโมง!' \n• **ความโลภ:** 'คุณคือผู้โชคดีได้รับรางวัลใหญ่ กดรับเลย!' \n• **ความกลัว:** 'คุณมีส่วนเกี่ยวข้องกับคดีฟอกเงิน!'",
                "callout": {
                    "type": "tip",
                    "title": "💡 วิธีแก้ทาง Social Engineering",
                    "text": "จำไว้ว่า 'เมื่อไหร่ก็ตามที่มีคนมาทำให้เราตกใจ ดีใจสุดขีด หรือเร่งรีบ ให้หยุดคิด 10 วินาที' ก่อนทำรายการเสมอ",
                },
            }
        ],
        "key_takeaways": [
            "มีสติทุกครั้งที่ได้รับข้อความกระตุ้นอารมณ์",
            "อย่าให้ข้อมูลส่วนตัวกับคนที่เพิ่งรู้จักทางออนไลน์",
            "ตรวจสอบข้อมูลกับแหล่งข่าวอย่างเป็นทางการเสมอ",
        ],
    },
    {
        "id": 11,
        "title": "ช้อปปิ้งออนไลน์อย่างไรให้ปลอดภัย ไม่โดนร้านค้าปลอมโกง",
        "category": "Privacy",
        "author": "ShopSafe",
        "author_role": "E-Commerce Analyst",
        "date": "14 ก.พ. 2026",
        "read_time": "3 นาที",
        "desc": "ข้อควรรู้ก่อนโอนเงินซื้อของออนไลน์ ป้องกันเพจปลอมและการเชิดเงินหนี",
        "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
        "summary": "การซื้อของออนไลน์สะดวกสบาย แต่ก็มาพร้อมมิจฉาชีพที่สร้างเพจปลอมขึ้นมาหลอกขายสินค้า โดยเฉพาะสินค้าที่มีราคาถูกกว่าท้องตลาดอย่างผิดปกติ",
        "sections": [
            {
                "title": "1. เช็กความน่าเชื่อถือของเพจและร้านค้า",
                "text": "เช็กประวัติการเปลี่ยนชื่อเพจ จำนวนผู้ติดตาม วันที่สร้างเพจ และลองเอาชื่อบัญชีธนาคารไปค้นหาในเว็บ Blacklistseller ก่อนโอนเงินทุกครั้ง",
                "callout": {
                    "type": "warning",
                    "title": "🛒 ตัวเลือกการชำระเงินที่ปลอดภัย",
                    "text": "แนะนำให้เลือกชำระเงินผ่านแพลตฟอร์มกลาง (เช่น Shopee, Lazada) ที่มีระบบการคุ้มครองผู้ซื้อ หรือเลือกบริการเก็บเงินปลายทาง",
                },
            }
        ],
        "key_takeaways": [
            "ระวังสินค้าราคาถูกกว่าความเป็นจริงมากๆ",
            "นำชื่อ-นามสกุล และเลขบัญชีผู้ขายไปค้นหาประวัติการโกงก่อนโอน",
            "เลี่ยงการซื้อขายผ่านการโอนตรงนอกแพลตฟอร์ม",
        ],
    },
    {
        "id": 12,
        "title": "จัดการ Cookie ใน Browser เพื่อความเป็นส่วนตัวสูงสุด",
        "category": "Privacy",
        "author": "DataGuard",
        "author_role": "Privacy Engineer",
        "date": "15 ก.พ. 2026",
        "read_time": "3 นาที",
        "desc": "เข้าใจการทำงานของไฟล์คุกกี้ และเทคนิคการลบเพื่อไม่ให้ถูกดักติดตามพฤติกรรม",
        "image": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200",
        "summary": "Cookies คือไฟล์ขนาดเล็กที่เว็บไซต์บันทึกไว้ในเครื่องของคุณ แม้จะมีประโยชน์ในการจดจำการเข้าสู่ระบบ แต่ Third-Party Cookies ก็ถูกนำมาใช้ติดตามพฤติกรรมของคุณเพื่อการโฆษณาได้เช่นกัน",
        "sections": [
            {
                "title": "1. วิธีการเคลียร์ Cookie และ Cache สม่ำเสมอ",
                "text": "การล้าง Cookie และท่องเว็บผ่านโหมด Incognito หรือใช้อุปกรณ์เสริมเพื่อความเป็นส่วนตัว จะช่วยลดโอกาสที่ข้อมูลเซสชันการเข้าสู่ระบบของคุณจะถูกขโมยผ่าน Session Hijacking ได้",
                "callout": {
                    "type": "tip",
                    "title": "💡 เบราว์เซอร์เน้นความเป็นส่วนตัว",
                    "text": "พิจารณาใช้งานเว็บเบราว์เซอร์ที่เน้น Privacy เป็นหลัก เช่น Brave หรือ Firefox เพื่อบล็อก Tracker อัตโนมัติ",
                },
            }
        ],
        "key_takeaways": [
            "เลือกกดยอมรับเฉพาะ Cookie ที่จำเป็น (Essential Cookies) บนเว็บไซต์",
            "หมั่นล้างประวัติการท่องเว็บและคุกกี้เป็นประจำ",
            "เปิดใช้งานฟังก์ชัน Block Third-Party Cookies ในเบราว์เซอร์",
        ],
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
    return render(
        request, "login.html", {"error": error, "current_user": current_user(request)}
    )


def logout_view(request):
    request.session.flush()
    return redirect("home")


def register_view(request):
    success = False
    if request.method == "POST":
        success = True
    return render(
        request,
        "register.html",
        {"success": success, "current_user": current_user(request)},
    )


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
    session_result = request.session.get("last_scan_result") or {}
    latest_scan = ScanHistory.objects.order_by("-timestamp").first()

    source = session_result or (
        {
            "url": latest_scan.url,
            "score": latest_scan.score,
            "status": latest_scan.status,
            "ai_risk_score": latest_scan.ai_risk_score,
            "ssl_title": latest_scan.ssl_title,
            "ssl_sub": latest_scan.ssl_sub,
            "domain_age": latest_scan.domain_age,
            "domain_sub": latest_scan.domain_sub,
            "is_blacklisted": latest_scan.is_blacklisted,
            "google_safe": latest_scan.google_safe,
            "location": latest_scan.location,
            "has_redirection": latest_scan.has_redirection,
        }
        if latest_scan
        else {}
    )

    score = int(source.get("score", 0) or 0)
    ai_risk_score = int(source.get("ai_risk_score", 100 - score) or (100 - score))

    if score >= 85:
        status_label = "ปลอดภัย"
        status_key = "safe"
        theme_color = "#10b981"
        status_badge_class = "bg-emerald-100 text-emerald-700 border-emerald-200"
        status_text_class = "text-emerald-600"
        risk_bar_class = "bg-emerald-500"
    elif score >= 70:
        status_label = "ค่อนข้างปลอดภัย"
        status_key = "mostly_safe"
        theme_color = "#0d9488"
        status_badge_class = "bg-teal-100 text-teal-700 border-teal-200"
        status_text_class = "text-teal-600"
        risk_bar_class = "bg-teal-500"
    elif score >= 50:
        status_label = "มีความเสี่ยง"
        status_key = "warning"
        theme_color = "#f59e0b"
        status_badge_class = "bg-amber-100 text-amber-700 border-amber-200"
        status_text_class = "text-amber-500"
        risk_bar_class = "bg-amber-500"
    elif score >= 30:
        status_label = "ค่อนข้างอันตราย"
        status_key = "mostly_danger"
        theme_color = "#ea580c"
        status_badge_class = "bg-orange-100 text-orange-700 border-orange-200"
        status_text_class = "text-orange-600"
        risk_bar_class = "bg-orange-600"
    else:
        status_label = "อันตราย"
        status_key = "danger"
        theme_color = "#e11d48"
        status_badge_class = "bg-rose-100 text-rose-700 border-rose-200"
        status_text_class = "text-rose-600"
        risk_bar_class = "bg-rose-600"

    ssl_title = source.get("ssl_title") or "Not Secure"
    ssl_sub = source.get("ssl_sub") or "ไม่พบรายละเอียดใบรับรอง"
    domain_age = source.get("domain_age") or "ไม่พบข้อมูล"
    domain_sub = source.get("domain_sub") or "ไม่พบประวัติข้อมูลระบบจัดทะเบียน"
    location = source.get("location") or "Unknown"
    has_redirection = bool(source.get("has_redirection"))
    is_blacklisted = bool(source.get("is_blacklisted"))
    google_safe = bool(source.get("google_safe", True))
    url = source.get("url") or "ไม่ระบุ URL"
    result_id = f"#PH-{latest_scan.id:05d}" if latest_scan else "#PH-00000"

    context = {
        "current_user": current_user(request),
        "url": url,
        "score": score,
        "status_label": status_label,
        "status_key": status_key,
        "theme_color": theme_color,
        "status_badge_class": status_badge_class,
        "status_text_class": status_text_class,
        "risk_bar_class": risk_bar_class,
        "ai_risk_score": ai_risk_score,
        "ssl_title": ssl_title,
        "ssl_sub": ssl_sub,
        "domain_age": domain_age,
        "domain_sub": domain_sub,
        "location": location,
        "has_redirection": has_redirection,
        "is_blacklisted": is_blacklisted,
        "google_safe": google_safe,
        "result_id": result_id,
        "confidence_text": "สูง (99.9%)",
        "scan_time_text": "0.45s",
    }
    return render(request, "result.html", context)


def report_view(request):
    submitted = request.method == "POST"
    return render(
        request,
        "report.html",
        {"submitted": submitted, "current_user": current_user(request)},
    )


def history_view(request):
    my_reports = [
        {
            "id": 1,
            "url": "http://scb-verify-login.com",
            "type": "Phishing",
            "date": "12 ก.พ. 2026",
            "status": "Pending",
        },
        {
            "id": 2,
            "url": "https://free-iphone-15.net",
            "type": "Scam",
            "date": "10 ก.พ. 2026",
            "status": "Verified",
        },
        {
            "id": 3,
            "url": "https://www.google.com",
            "type": "Other",
            "date": "05 ก.พ. 2026",
            "status": "Rejected",
        },
        {
            "id": 4,
            "url": "http://bit.ly/fake-bank",
            "type": "Phishing",
            "date": "04 ก.พ. 2026",
            "status": "Pending",
        },
        {
            "id": 5,
            "url": "https://secure-pay-web.com",
            "type": "Scam",
            "date": "03 ก.พ. 2026",
            "status": "Verified",
        },
        {
            "id": 6,
            "url": "http://malware-site.net",
            "type": "Malware",
            "date": "02 ก.พ. 2026",
            "status": "Pending",
        },
        {
            "id": 7,
            "url": "https://verify-account.io",
            "type": "Phishing",
            "date": "01 ก.พ. 2026",
            "status": "Rejected",
        },
    ]
    return render(
        request,
        "history.html",
        {"my_reports": my_reports, "current_user": current_user(request)},
    )


def scan_history_view(request):
    scan_data = ScanHistory.objects.order_by("-timestamp")
    return render(
        request,
        "scan_history.html",
        {"scan_data": scan_data, "current_user": current_user(request)},
    )


def knowledge_view(request):
    return render(
        request,
        "knowledge.html",
        {"articles": ARTICLES, "current_user": current_user(request)},
    )


def knowledge_detail_view(request, id):
    article = next((item for item in ARTICLES if item["id"] == id), None)
    # ดึงบทความอื่นมาแนะนำ 3 เรื่อง
    related_articles = [item for item in ARTICLES if item["id"] != id][:3]
    return render(
        request,
        "knowledge_detail.html",
        {
            "article": article,
            "related_articles": related_articles,
            "current_user": current_user(request),
        },
    )


def scan_view(request):
    if request.method == "POST":
        url = request.POST.get("url", "").strip()
        uploaded_file = request.FILES.get("file")

        if (
            not url
            and uploaded_file
            and uploaded_file.content_type.startswith("image/")
        ):
            try:
                file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
                img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

                img_padded = cv2.copyMakeBorder(
                    img, 30, 30, 30, 30, cv2.BORDER_CONSTANT, value=[255, 255, 255]
                )

                qr_detector = cv2.QRCodeDetector()
                decoded_info, _, _ = qr_detector.detectAndDecode(img_padded)

                if not decoded_info:
                    retval, decoded_infos, _, _ = qr_detector.detectAndDecodeMulti(
                        img_padded
                    )
                    if retval and len(decoded_infos) > 0 and decoded_infos[0]:
                        decoded_info = decoded_infos[0]

                if decoded_info:
                    url = decoded_info

            except Exception as e:
                print(f"Error decoding QR Code image: {e}")

        if url:
            result = scan_url_logic(url)

            ScanHistory.objects.create(
                url=result["url"],
                score=result["score"],
                status=result["status"],
                ai_risk_score=result["ai_risk_score"],
                ssl_title=result["ssl_title"],
                ssl_sub=result["ssl_sub"],
                domain_age=result["domain_age"],
                domain_sub=result["domain_sub"],
                is_blacklisted=result["is_blacklisted"],
                google_safe=result["google_safe"],
                location=result["location"],
                has_redirection=result["has_redirection"],
                timestamp=timezone.now(),
            )

            request.session["last_scan_result"] = result
            request.session.modified = True

            return redirect("result")

        messages.error(request, "ไม่พบข้อมูล URL หรือไม่สามารถอ่าน QR Code ได้")
        return redirect("home")

    return redirect("home")

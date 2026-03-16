import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Tag, Clock, User, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';

// --- 📚 ฐานข้อมูลบทความแบบละเอียด (ครบ 12 รายการ) ---
const articlesData = [
    { 
        id: 1, 
        title: 'วิธีสังเกตลิงก์ปลอม (Phishing) แบบมือโปร ป้องกันก่อนหมดตัว', 
        date: '29 ม.ค. 2026', author: 'PhishWise Team', category: 'Phishing',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed font-light">
                Hacker ในปัจจุบันไม่ได้นั่งพิมพ์โค้ดเพื่อเจาะระบบธนาคารที่ซับซ้อน แต่พวกเขาเลือกวิธีที่ง่ายกว่านั้นคือ "การหลอกมนุษย์ด้วยกันเอง" นี่คือเช็กลิสต์วิธีสังเกตก่อนคลิกลิงก์ใดๆ
            </p>
            <h2 class="text-3xl font-bold mt-10 mb-6 text-slate-900">1. อ่านชื่อ Domain ให้ละเอียดทีละตัวอักษร</h2>
            <p class="mb-4 text-slate-600">มิจฉาชีพมักใช้เทคนิค Typo-squatting หรือการสะกดคำให้คล้ายของจริงที่สุดเพื่อหลอกสายตาที่รีบร้อน:</p>
            <ul class="list-disc pl-6 space-y-4 mb-8 text-slate-600">
                <li><strong class="text-green-600">kasikornbank.com</strong> (เว็บจริง) vs <strong class="text-red-500">kasikorn-bank-update.com</strong> (เว็บปลอม)</li>
                <li><strong class="text-green-600">facebook.com</strong> (เว็บจริง) vs <strong class="text-red-500">faceb00k.com</strong> (เว็บปลอม - เปลี่ยน o เป็น 0)</li>
            </ul>
             <div class="my-10 p-8 bg-red-50 rounded-3xl border-l-8 border-red-500 shadow-sm">
                <h4 class="font-bold text-red-800 text-xl mb-2 flex items-center gap-2">
                    🚨 ลบความเชื่อผิดๆ: "มีรูปกุญแจแปลว่าปลอดภัย"
                </h4>
                <p class="text-red-700">เครื่องหมาย HTTPS (รูปกุญแจสีเขียว) <strong>ไม่ได้แปลว่าเว็บนั้นเป็นของแท้</strong> มันแค่บอกว่าข้อมูลที่ส่งไปมีการเข้ารหัส ซึ่งปัจจุบันเว็บปลอมก็สามารถจดใบรับรอง HTTPS ได้ฟรีภายในไม่กี่นาที</p>
            </div>
        `
    },
    {
        id: 2,
        title: 'รหัสผ่านที่ปลอดภัยคืออะไร? เลิกใช้ 123456 เดี๋ยวนี้!',
        date: '30 ม.ค. 2026', author: 'SecAdmin', category: 'Security',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed font-light">การตั้งรหัสผ่านคือด่านแรกของการป้องกัน ถ้ากุญแจบ้านคุณง่ายเกินไป โจรก็ไขเข้ามาได้สบายๆ</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">สูตรลับการตั้งรหัสผ่าน (Password Phrase)</h2>
            <p class="mb-4 text-slate-600">แทนที่จะตั้งคำสั้นๆ ให้ใช้ "ประโยค" ที่คุณจำได้คนเดียว เช่น <em>I-Love-Somtum-Poo-Plara@2024</em> รหัสแบบนี้แฮกยากกว่า <em>P@ssw0rd1</em> หลายเท่าตัว</p>
            <div class="bg-blue-50 p-6 rounded-xl my-6">
                <h4 class="font-bold text-blue-800 mb-2">💡 คำแนะนำ:</h4>
                <p class="text-slate-700">ควรใช้ Password Manager (ตัวจัดการรหัสผ่าน) เพื่อช่วยจำและสุ่มรหัสผ่านที่ซับซ้อนสำหรับแต่ละเว็บไซต์ไม่ให้ซ้ำกัน</p>
            </div>
        `
    },
    { 
        id: 3, 
        title: 'เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่ อ้างหน่วยงานรัฐ', 
        date: '1 ก.พ. 2026', author: 'Cyber Alert', category: 'Scams',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed font-light">
                มิจฉาชีพยุคใหม่ทำงานเป็นองค์กร มีแผนกและสคริปต์จิตวิทยาที่เขียนมาเพื่อต้อนเหยื่อให้จนมุมโดยเฉพาะ
            </p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">พล็อตยอดฮิต: "พัสดุผิดกฎหมาย"</h2>
            <p class="mb-4 text-slate-600">อ้างเป็นขนส่งชื่อดัง โทรมาแจ้งว่าพัสดุชื่อคุณถูกตีกลับ และพบสิ่งผิดกฎหมาย จากนั้นจะโอนสายให้ตำรวจปลอมเพื่อข่มขู่</p>
            <div class="bg-blue-900 text-white p-8 rounded-3xl my-10 shadow-xl">
                <h4 class="text-blue-300 font-bold mb-2 uppercase tracking-wider">กฎเหล็ก 3 ข้อ</h4>
                <ul class="list-disc pl-5 space-y-2 mt-4 text-blue-50">
                    <li>ตำรวจ <strong>ไม่มีนโยบายรับแจ้งความผ่าน Line หรือ VDO Call</strong></li>
                    <li>หน่วยงานรัฐ <strong>ไม่มีการให้โอนเงินมาตรวจสอบ</strong></li>
                    <li>ถ้าสงสัย ให้วางสายแล้วโทรเช็กเบอร์จริงของหน่วยงาน</li>
                </ul>
            </div>
        `
    },
    {
        id: 4,
        title: 'Ransomware คืออะไร? ทำไมถึงอันตรายกว่าไวรัสทั่วไป',
        date: '2 ก.พ. 2026', author: 'MalwareHunter', category: 'Malware',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600 leading-relaxed">Ransomware หรือ "มัลแวร์เรียกค่าไถ่" คือการที่แฮกเกอร์ทำการล็อกไฟล์ทั้งหมดในเครื่องของคุณ แล้วเรียกเงินเพื่อแลกกับรหัสปลดล็อก</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">วิธีป้องกันที่ดีที่สุดคือ "Backup"</h2>
            <p class="mb-4 text-slate-600">เมื่อโดน Ransomware เล่นงาน โอกาสได้ไฟล์คืนมีน้อยมาก ดังนั้นการสำรองข้อมูลแบบ 3-2-1 จึงสำคัญที่สุด</p>
            <ul class="list-disc pl-6 space-y-2 text-slate-600">
                <li>3: เก็บข้อมูล 3 ชุด (ต้นฉบับ 1 + สำรอง 2)</li>
                <li>2: เก็บในสื่อที่ต่างกัน 2 ประเภท (เช่น Harddisk + Cloud)</li>
                <li>1: เก็บ 1 ชุดไว้แบบ Offline (ไม่ต่อเน็ต)</li>
            </ul>
        `
    },
    {
        id: 5,
        title: '2FA คืออะไร ทำไมต้องเปิดใช้งานเดี๋ยวนี้?',
        date: '3 ก.พ. 2026', author: 'AuthExpert', category: 'Security',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">รหัสผ่านอย่างเดียวไม่พออีกต่อไป 2FA (Two-Factor Authentication) คือการเพิ่มกุญแจดอกที่ 2 เพื่อยืนยันว่าเป็นคุณจริงๆ</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">ประเภทของ 2FA</h2>
            <ul class="space-y-4 text-slate-600">
                <li>📲 <strong>SMS OTP:</strong> สะดวกแต่ไม่ปลอดภัยที่สุด เพราะ SMS ดักจับได้</li>
                <li>🔐 <strong>Authenticator App:</strong> (แนะนำ) เช่น Google/Microsoft Authenticator ปลอดภัยกว่า เพราะรหัสเปลี่ยนทุก 30 วินาทีและไม่ต้องใช้สัญญาณมือถือ</li>
                <li>🔑 <strong>Hardware Key:</strong> ปลอดภัยที่สุด ใช้เสียบ USB เพื่อยืนยันตัวตน</li>
            </ul>
        `
    },
    {
        id: 6,
        title: 'Public Wi-Fi อันตรายแค่ไหน? ใช้ยังไงให้รอด',
        date: '5 ก.พ. 2026', author: 'NetGuard', category: 'Security',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">ของฟรีไม่มีในโลก Wi-Fi ฟรีตามร้านกาแฟอาจเป็นกับดักที่แฮกเกอร์สร้างขึ้นเพื่อดักจับข้อมูลบัตรเครดิตของคุณ (Man-in-the-Middle Attack)</p>
            <div class="bg-amber-50 p-6 rounded-xl border border-amber-200 my-6">
                <h4 class="font-bold text-amber-800 text-lg">⚠️ ข้อควรระวัง</h4>
                <p class="text-slate-700">ห้ามทำธุรกรรมทางการเงินหรือล็อกอินรหัสสำคัญผ่าน Wi-Fi สาธารณะเด็ดขาด หากจำเป็นให้ใช้ 4G/5G ของตัวเอง หรือเปิด VPN ทุกครั้ง</p>
            </div>
        `
    },
    {
        id: 7,
        title: 'Deepfake: ภัยเงียบจาก AI เมื่อภาพและเสียงเชื่อไม่ได้',
        date: '7 ก.พ. 2026', author: 'AI Watch', category: 'Scams',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">ปัจจุบัน AI สามารถปลอมเสียงคนในครอบครัวโทรมาขอยืมเงิน หรือปลอมวิดีโอ Call ให้หน้าขยับปากได้เนียนสนิท</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">วิธีจับผิด Deepfake</h2>
            <ul class="list-disc pl-6 space-y-2 text-slate-600">
                <li>สังเกตการกระพริบตา หรือการขยับของปากที่ไม่สัมพันธ์กับเสียง</li>
                <li>สังเกตแสงเงาที่ผิดธรรมชาติ</li>
                <li><strong>ไม้ตาย:</strong> ให้คนที่วิดีโอคอลมาลองเอามือปาดหน้า หรือหันหน้าซ้ายขวาเร็วๆ ภาพ AI มักจะกระตุกหรือหลุด</li>
            </ul>
        `
    },
    {
        id: 8,
        title: 'วิธีเช็กว่าข้อมูลหลุดไปใน Dark Web หรือไม่',
        date: '8 ก.พ. 2026', author: 'PrivacyFirst', category: 'Privacy',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">คุณอาจเคยสมัครเว็บทิ้งไว้เมื่อ 10 ปีก่อน เว็บนั้นอาจถูกแฮกและข้อมูลของคุณกำลังขายอยู่ในตลาดมืด</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">เครื่องมือตรวจสอบฟรี</h2>
            <p class="mb-4 text-slate-600">เว็บไซต์ <strong>haveibeenpwned.com</strong> เป็นแหล่งรวมฐานข้อมูลรั่วไหลที่น่าเชื่อถือที่สุด เพียงกรอกอีเมลลงไป ระบบจะบอกว่าอีเมลนี้เคยหลุดจากเว็บไหนบ้าง</p>
            <p class="text-slate-600">หากพบว่าหลุด ให้รีบเปลี่ยนรหัสผ่านมาตรฐานทันที และเปิด 2FA ในทุกบัญชีที่ทำได้</p>
        `
    },
    { 
        id: 9, 
        title: 'แอปดูดเงินทำงานอย่างไร? (เจาะลึกภัยร้าย Accessibility Service)', 
        date: '10 ก.พ. 2026', author: 'Tech Insider', category: 'Malware',
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-lg text-slate-600">
                ข่าวคนถูก "ดูดเงินเกลี้ยงบัญชี" ไม่ใช่เรื่องของแฮกเกอร์สายดาร์กที่ไหน แต่เกิดจากการที่เราเผลอเปิดประตูให้โจรเข้าบ้านมือถือของเราเอง
            </p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">Accessibility Service คือกุญแจผี</h2>
            <p class="mb-6 text-slate-600">
                เมื่อเราเผลอกด <strong>"อนุญาต (Allow)"</strong> ให้สิทธิ์นี้ แอปโจรจะสามารถทำ 2 สิ่งนี้ได้ทันที:
                <br/>1. <strong>อ่านหน้าจอ:</strong> เห็นทุกอย่างที่เราเห็น รวมถึงรหัส PIN
                <br/>2. <strong>ควบคุมปุ่มกด:</strong> สามารถสั่งกดโอนเงินได้เองในเวลาที่เราไม่ได้มองหน้าจอ
            </p>
            <div class="bg-amber-50 p-8 rounded-3xl border border-amber-200 my-8">
                <h4 class="font-bold text-amber-800 text-xl mb-4">วิธีแก้ไขเร่งด่วน</h4>
                <ul class="list-disc pl-5 space-y-3 text-slate-700">
                    <li>รีบตัดอินเทอร์เน็ต (เปิดโหมดเครื่องบิน)</li>
                    <li>ติดต่อธนาคารเพื่ออายัดบัญชี</li>
                    <li>ทำการ Factory Reset ล้างเครื่องทันที</li>
                </ul>
            </div>
        `
    },
    {
        id: 10,
        title: 'ทำความรู้จักกับ Social Engineering ศิลปะการหลอกคน',
        date: '12 ก.พ. 2026', author: 'PsyCyber', category: 'Scams',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">Social Engineering หรือ วิศวกรรมสังคม คือการโจมตีที่จุดอ่อนที่เปราะบางที่สุดของระบบรักษาความปลอดภัย นั่นคือ "มนุษย์"</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">หลักการทำงาน</h2>
            <p class="mb-4 text-slate-600">คนร้ายจะเล่นกับอารมณ์พื้นฐานของคน: <strong>ความกลัว, ความโลภ, ความอยากรู้อยากเห็น หรือความเห็นใจ</strong> เพื่อให้เหยื่อทำตามคำสั่งโดยไม่ทันคิดไตร่ตรอง เช่น การแกล้งเป็นหัวหน้างานส่งอีเมลมาสั่งให้โอนเงินด่วน เป็นต้น</p>
        `
    },
    {
        id: 11,
        title: 'ปลอดภัยเมื่อช้อปปิ้งออนไลน์ ไม่ให้โดนโกง',
        date: '14 ก.พ. 2026', author: 'ShopSafe', category: 'Privacy',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">การซื้อของออนไลน์สะดวกสบาย แต่ก็เสี่ยงโดนโกงหรือขโมยข้อมูลบัตรเครดิตได้ง่าย</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">Checklist นักช้อปปลอดภัย</h2>
            <ul class="list-disc pl-6 space-y-3 text-slate-600">
                <li><strong>เลี่ยงการโอนเงินสดโดยตรง:</strong> ควรชำระผ่านระบบกลางของแพลตฟอร์ม (Shopee/Lazada) เพื่อให้ดึงเงินคืนได้หากไม่ได้รับของ</li>
                <li><strong>ใช้ Virtual Card:</strong> หากต้องตัดบัตร ควรใช้บัตรเสมือนในแอปธนาคารที่กำหนดวงเงินได้ และปิดการใช้งานได้ทันทีเมื่อไม่ใช้</li>
                <li><strong>ตรวจสอบรีวิว:</strong> ดูรีวิวที่มีรูปภาพจริง และดูวันที่รีวิว (ระวังรีวิวหน้าม้าที่โพสต์ติดๆ กัน)</li>
            </ul>
        `
    },
    {
        id: 12,
        title: 'จัดการ Cookie ใน Browser เพื่อความเป็นส่วนตัว',
        date: '15 ก.พ. 2026', author: 'DataGuard', category: 'Privacy',
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1200',
        content: `
            <p class="mb-6 text-xl text-slate-600">ทุกครั้งที่เข้าเว็บจะมีกล่องถามเรื่อง Cookie เด้งขึ้นมา คนส่วนใหญ่มักกด "Accept All" เพื่อให้มันหายไป แต่นั่นคือการยอมให้เขาติดตามคุณ!</p>
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">วิธีจัดการที่ถูกต้อง</h2>
            <p class="mb-4 text-slate-600">ให้เลือกกด <strong>"Settings"</strong> หรือ <strong>"Reject All"</strong> แทน โดยเฉพาะ "Marketing Cookies" ที่ใช้ติดตามพฤติกรรมเพื่อยิงโฆษณา ส่วน "Essential Cookies" นั้นจำเป็นต้องเปิดเพื่อให้เว็บทำงานได้ปกติ</p>
        `
    },
];

export default function KnowledgeDetail() {
    const { id } = useParams();
    
    // ค้นหาข้อมูลจาก ID หรือใช้ Default กรณีไม่มีข้อมูล
    const article = articlesData.find(a => a.id === parseInt(id)) || {
        title: "ไม่พบบทความ",
        author: "System",
        date: "-",
        category: "Error",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        content: `
            <div class='mt-8 p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center'>
                <AlertTriangle size={48} className='mx-auto text-red-400 mb-4' />
                <h3 class='text-xl font-bold text-slate-700'>ไม่พบข้อมูลบทความที่คุณต้องการ</h3>
                <p class='text-slate-400 mt-2'>กรุณาตรวจสอบลิงก์อีกครั้งหรือกลับไปที่หน้าหลัก</p>
            </div>
        `
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/knowledge" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>กลับไปคลังความรู้</span>
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-2.5 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-blue-600">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content Body */}
            <main className="animate-fade-in">
                {/* Article Header */}
                <header className="max-w-4xl mx-auto px-4 pt-12 pb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase mb-6 tracking-widest shadow-sm">
                        {article.category}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-8 tracking-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-8 text-slate-400 text-sm font-bold">
                        <div className="flex items-center gap-2"><User size={16} className="text-blue-500" /> {article.author}</div>
                        <div className="flex items-center gap-2"><Calendar size={16} /> {article.date}</div>
                        <div className="flex items-center gap-2"><Clock size={16} /> 5 min read</div>
                    </div>
                </header>

                {/* Hero Image Section */}
                <div className="max-w-6xl mx-auto px-4 mb-16">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100 aspect-[21/9]">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                </div>

                {/* Main Text Content */}
                <article className="max-w-3xl mx-auto px-4 pb-24">
                    <div 
                        className="prose prose-slate prose-lg max-w-none 
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                        prose-headings:text-slate-900 prose-headings:font-bold
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-li:text-slate-600"
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />

                    {/* Footer Tags */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                        <Tag size={18} className="text-slate-300 mr-2" />
                        {['CyberSafety', 'Privacy', 'Awareness'].map(tag => (
                            <span key={tag} className="px-5 py-2 bg-slate-100 text-slate-500 rounded-2xl text-sm font-bold hover:bg-blue-600 hover:text-white transition cursor-pointer">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </article>
            </main>
        </div>
    );
}
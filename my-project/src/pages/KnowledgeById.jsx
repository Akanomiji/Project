import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, User, Share2, Tag } from 'lucide-react';

// --- 📚 ฐานข้อมูลบทความ (เนื้อหาจริง) ---
const articlesData = [
    { 
        id: 1, 
        title: 'เจาะลึก: วิธีสังเกตลิงก์ปลอม (Phishing) แบบมือโปร', 
        date: '29 ม.ค. 2026',
        author: 'PhishWise Team',
        category: 'Phishing',
        // ✅ เนื้อหาบทความ HTML แบบจัดเต็ม
        content: `
            <p class="mb-4">คุณเคยได้รับอีเมลที่บอกว่า <strong>"บัญชีธนาคารของคุณถูกระงับ"</strong> หรือข้อความ SMS ว่า <strong>"คุณได้รับสิทธิ์เงินกู้ดอกเบี้ยต่ำ"</strong> หรือไม่? ถ้าเคย... ยินดีด้วยครับ คุณกำลังตกเป็นเป้าหมายของ <em>Phishing Attack</em></p>
            
            <p class="mb-6">วันนี้ทีมงาน PhishWise จะพามาดูเทคนิคการจับผิดลิงก์ปลอมแบบที่ Hacker ไม่ต้องการให้คุณรู้</p>
            
            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-800">1. อย่าดูแค่ "แม่กุญแจสีเขียว" (HTTPS)</h2>
            <p class="mb-4">เมื่อก่อนเราถูกสอนว่าถ้ามี https:// แปลว่าปลอดภัย แต่ปัจจุบัน <strong>เว็บปลอมกว่า 80% ก็มี https</strong> ครับ เพราะใบรับรองความปลอดภัย (SSL) สามารถขอได้ฟรี ดังนั้นแม่กุญแจเขียวบอกแค่ว่า "การส่งข้อมูลถูกเข้ารหัส" แต่ไม่ได้บอกว่า "ปลายทางคือใคร"</p>

            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-800">2. เทคนิค Typosquatting (พิมพ์ผิดเนียนๆ)</h2>
            <p class="mb-4">แฮกเกอร์มักจะจดโดเมนที่หน้าตาคล้ายของจริงมาก จนสายตาเราแยกไม่ออก เช่น:</p>
            <ul class="list-disc ml-6 space-y-2 text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <li><span class="text-red-500 font-bold">faceb00k.com</span> (ใช้เลข 0 แทนตัว o)</li>
                <li><span class="text-red-500 font-bold">netflix-update.com</span> (เติมคำขยายเข้าไป ของจริงต้องไม่มีขีด)</li>
                <li><span class="text-red-500 font-bold">scb.verify-account.com</span> (อันนี้ร้ายกาจ! Domain จริงคือ verify-account.com ส่วน scb เป็นแค่ Subdomain ใครๆ ก็ตั้งได้)</li>
            </ul>

            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-800">3. ระวัง Short URL (ลิงก์ย่อ)</h2>
            <p class="mb-4">หากเจอลิงก์อย่าง <code>bit.ly/3xyz...</code> อย่าเพิ่งกด! เพราะเราไม่รู้ว่ามันจะพาไปไหน ให้ใช้เว็บตรวจสอบลิงก์ (หรือใช้ระบบของ PhishWise ของเรา) เพื่อดูปลายทางก่อนเสมอ</p>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                <p class="font-bold text-blue-700">💡 สรุปง่ายๆ:</p>
                <p class="text-blue-600">"ช้าลงอีกนิด คิดก่อนคลิก" คือคาถาป้องกันที่ดีที่สุดครับ</p>
            </div>
        `
    },
    { 
        id: 2, 
        title: 'รหัสผ่านที่ปลอดภัยคืออะไร? ทำไม 123456 ถึงห้ามใช้', 
        date: '28 ม.ค. 2026',
        author: 'Admin Boss',
        category: 'Security',
        content: `
            <p class="mb-4">รู้หรือไม่? รหัสผ่านยอมนิยมอันดับ 1 ของโลกตลอดกาลคือ <strong>"123456"</strong> และอันดับสองคือ <strong>"password"</strong> ซึ่งแฮกเกอร์ใช้เวลาไม่ถึง 1 วินาทีในการเดาได้สำเร็จ</p>

            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-800">สูตรตั้งรหัสผ่านให้ "แฮกยาก แต่จำง่าย"</h2>
            
            <h3 class="text-xl font-bold mt-6 mb-2 text-slate-700">1. ความยาวชนะทุกสิ่ง (Length Matters)</h3>
            <p class="mb-4">ความซับซ้อนสำคัญ แต่ความยาวสำคัญกว่า รหัสผ่าน 8 ตัวอักษร อาจถูกเจาะได้ใน 5 นาที แต่รหัสผ่าน 12-15 ตัวอักษร อาจต้องใช้เวลาเป็น 100 ปี</p>

            <h3 class="text-xl font-bold mt-6 mb-2 text-slate-700">2. ใช้ประโยค (Passphrase) แทนคำโดดๆ</h3>
            <p class="mb-4">แทนที่จะตั้งว่า <code>P@ssw0rd</code> (จำยากและเดาง่าย) ลองเปลี่ยนเป็น:</p>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200 text-center mb-6">
                <span class="text-green-700 font-bold text-lg">"I-Love-Somtum-Poo-Plara@99"</span>
            </div>
            <p class="mb-4">เห็นไหมครับ? จำง่ายมาก มีทั้งตัวใหญ่ ตัวเล็ก ตัวเลข และสัญลักษณ์ ครบตามสูตร!</p>

            <h3 class="text-xl font-bold mt-6 mb-2 text-slate-700">3. อย่าใช้รหัสซ้ำ (Never Reuse)</h3>
            <p class="mb-4">ถ้าเว็บ A โดนแฮก แล้วคุณใช้รหัสเดียวกันกับเว็บ B, C และอีเมลหลัก... หายนะจะมาเยือนทันที แนะนำให้ใช้ <em>Password Manager</em> ช่วยจำครับ</p>
        ` 
    },
    { 
        id: 3, 
        title: 'เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่ อ้างเป็นกรมที่ดิน', 
        date: '25 ม.ค. 2026',
        author: 'Cyber Police',
        category: 'News',
        content: `
            <p class="mb-4">ช่วงนี้ระบาดหนักมากครับ สำหรับแก๊งคอลเซ็นเตอร์ที่อ้างตัวว่าเป็น <strong>"เจ้าหน้าที่จากกรมที่ดิน"</strong> หรือ <strong>"การไฟฟ้า"</strong> โดยมุกใหม่ที่ใช้คือ...</p>

            <h2 class="text-2xl font-bold mt-8 mb-4 text-slate-800">พฤติการณ์ของคนร้าย</h2>
            <ol class="list-decimal ml-6 space-y-4 text-slate-700">
                <li><strong>โทรมาแจ้งว่าข้อมูลไม่ครบ:</strong> อ้างว่าต้องอัปเดตข้อมูลโฉนดที่ดิน หรือจะคืนเงินค่าประกันมิเตอร์ไฟฟ้า</li>
                <li><strong>ให้แอดไลน์ (Line Official ปลอม):</strong> จะส่งลิงก์ให้แอดไลน์ที่ดูเหมือนของจริงมาก มีโลโก้ราชการชัดเจน</li>
                <li><strong>หลอกให้ติดตั้งแอปดูดเงิน:</strong> นี่คือจุดตาย! เขาจะส่งลิงก์ให้โหลดแอป โดยอ้างว่าเป็น "แอปพลิเคชัน Smart Land" หรืออื่นๆ ซึ่งจริงๆ แล้วเป็นไฟล์ <code>.apk</code> ที่แฝงมัลแวร์</li>
                <li><strong>เข้าควบคุมมือถือ:</strong> พอกดติดตั้งและกดอนุญาตสิทธิ์ (Accessibility Service) จอเราจะค้าง หรือเป็นสีดำ ระหว่างนั้นเงินจะถูกโอนออกเกลี้ยงบัญชี</li>
            </ol>

            <div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
                <h3 class="font-bold text-red-700 text-lg flex items-center gap-2">🚨 วิธีป้องกันตัว</h3>
                <ul class="list-disc ml-5 mt-3 space-y-2 text-red-600">
                    <li>หน่วยงานราชการ <strong>ไม่มีนโยบาย</strong> โทรหาประชาชนเพื่อให้ทำธุรกรรมผ่านไลน์</li>
                    <li><strong>ห้ามกดลิงก์</strong> แปลกปลอมที่ส่งมาทาง SMS หรือ Line เด็ดขาด</li>
                    <li>หากเผลอกดไปแล้ว ให้รีบ <strong>ตัดสัญญาณอินเทอร์เน็ตทันที</strong> (เปิด Flight Mode) แล้วถอดซิมการ์ดออก</li>
                </ul>
            </div>
        ` 
    }
];

export default function KnowledgeById() {
  const { id } = useParams();
  const article = articlesData.find(item => item.id === parseInt(id));

  if (!article) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-50">
            <p className="text-xl font-bold">ไม่พบข้อมูลบทความ</p>
            <Link to="/knowledge" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">กลับไปหน้าหลัก</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* Navbar Placeholder (ถ้ามี) */}
      <div className="h-2"></div>

      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
        
        {/* Navigation */}
        <Link to="/knowledge" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium group">
            <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md border border-slate-100 transition-all">
                <ArrowLeft size={18} /> 
            </div>
            กลับไปหน้ารวมบทความ
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase flex items-center gap-1">
                    <Shield size={12} /> {article.category}
                </span>
                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                    <Calendar size={12} /> {article.date}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight relative z-10">
                {article.title}
            </h1>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {article.author.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{article.author}</p>
                        <p className="text-xs text-slate-500">Verified Author</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title="แชร์บทความ">
                    <Share2 size={20} />
                </button>
            </div>
        </div>

        {/* Main Content */}
        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div 
                className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-slate-800
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
                prose-li:text-slate-600
                prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            {/* Tags / Footer Article */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex gap-2">
                <Tag size={16} className="text-slate-400 mt-1" />
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer transition">CyberSecurity</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer transition">Safety</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer transition">Tips</span>
                </div>
            </div>
        </article>

      </main>
    </div>
  );
}
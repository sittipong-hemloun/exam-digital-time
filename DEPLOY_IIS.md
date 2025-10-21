# คู่มือการ Deploy Next.js บน IIS

## ข้อกำหนดเบื้องต้น (Prerequisites)

1. **Windows Server** พร้อม IIS ติดตั้งแล้ว
2. **URL Rewrite Module** สำหรับ IIS - [ดาวน์โหลดที่นี่](https://www.iis.net/downloads/microsoft/url-rewrite)
3. **Node.js** สำหรับ build โปรเจค (ติดตั้งบนเครื่อง dev)

## ขั้นตอนการ Build

### 1. Build โปรเจค

```bash
npm install
npm run build:iis
```

คำสั่ง `build:iis` จะทำสิ่งต่อไปนี้:
- Build Next.js เป็น static files (ไปที่โฟลเดอร์ `out/`)
- คัดลอกไฟล์ `web.config` ไปยังโฟลเดอร์ `out/`

### 2. ตรวจสอบไฟล์ที่ build

หลัง build เสร็จ จะได้โฟลเดอร์ `out/` ที่มีไฟล์:
```
out/
├── index.html
├── 404.html
├── _next/
│   ├── static/
│   └── ...
├── assets/
├── web.config
└── ...
```

## ขั้นตอนการติดตั้งบน IIS

### 1. ติดตั้ง URL Rewrite Module

- ดาวน์โหลดและติดตั้ง [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- รีสตาร์ท IIS Manager

### 2. สร้าง Website ใหม่บน IIS

1. เปิด **IIS Manager**
2. คลิกขวาที่ **Sites** → เลือก **Add Website**
3. กรอกข้อมูล:
   - **Site name**: `exam-digital-time`
   - **Physical path**: เลือกโฟลเดอร์ `out/` จากโปรเจค
   - **Port**: เลือก port ที่ต้องการ (เช่น 80, 3000)
   - **Host name**: (optional) ใส่ชื่อ domain ถ้ามี

### 3. กำหนด Application Pool

1. คลิกที่ **Application Pools**
2. เลือก Application Pool ของเว็บไซต์
3. ตั้งค่า:
   - **.NET CLR Version**: `No Managed Code`
   - **Managed Pipeline Mode**: `Integrated`

### 4. ตั้งค่า Permissions

ให้สิทธิ์ IIS อ่านไฟล์ในโฟลเดอร์:
1. คลิกขวาที่โฟลเดอร์ `out/` → **Properties** → **Security**
2. เพิ่มผู้ใช้: `IIS_IUSRS` และ `IUSR`
3. ให้สิทธิ์: **Read & Execute**

## การ Deploy แบบ Subdirectory

ถ้าต้องการ deploy ไว้ที่ subdirectory (เช่น `/exam-digital-time`) ทำดังนี้:

### 1. แก้ไข `next.config.mjs`

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/exam-digital-time',  // เพิ่มบรรทัดนี้
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
};
```

### 2. Build ใหม่

```bash
npm run build:iis
```

### 3. สร้าง Virtual Directory บน IIS

1. ใน IIS Manager, คลิกขวาที่ Default Web Site
2. เลือก **Add Virtual Directory**
3. กรอก:
   - **Alias**: `exam-digital-time`
   - **Physical path**: ชื้อไปที่โฟลเดอร์ `out/`

## การอัปเดตแอพพลิเคชัน

เมื่อมีการเปลี่ยนแปลงโค้ด:

1. Build ใหม่:
   ```bash
   npm run build:iis
   ```

2. คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์ `out/` ไปแทนที่บน server

3. รีสตาร์ท Application Pool (ถ้าจำเป็น):
   - เปิด IIS Manager
   - คลิกที่ **Application Pools**
   - คลิกขวาที่ pool → **Recycle**

## การแก้ปัญหา (Troubleshooting)

### ปัญหา: 404 Not Found เมื่อรีเฟรชหน้า

**สาเหตุ**: ไม่ได้ติดตั้ง URL Rewrite Module หรือไฟล์ `web.config` ไม่ทำงาน

**วิธีแก้**:
1. ตรวจสอบว่าติดตั้ง URL Rewrite Module แล้ว
2. ตรวจสอบว่ามีไฟล์ `web.config` ในโฟลเดอร์ `out/`
3. เปิด IIS Manager → เลือกเว็บไซต์ → ดับเบิลคลิก **URL Rewrite** → ตรวจสอบ rules

### ปัญหา: ไม่สามารถโหลด CSS/JS files

**สาเหตุ**: MIME types ไม่ถูกต้อง

**วิธีแก้**:
1. เปิด IIS Manager → เลือกเว็บไซต์ → ดับเบิลคลิก **MIME Types**
2. ตรวจสอบว่ามี:
   - `.js` → `application/javascript`
   - `.css` → `text/css`
   - `.woff2` → `application/font-woff2`
   - `.json` → `application/json`

### ปัญหา: Images ไม่แสดง

**สาเหตุ**: ใช้ Next.js Image Optimization ซึ่งไม่รองรับใน static export

**วิธีแก้**: ตรวจสอบว่า `next.config.mjs` มี `images: { unoptimized: true }` (ซึ่งมีอยู่แล้ว)

### ปัญหา: Error 500

**วิธีแก้**:
1. เปิด Detailed Error Messages:
   - IIS Manager → เลือกเว็บไซต์ → **Error Pages**
   - คลิก **Edit Feature Settings** → เลือก **Detailed errors**
2. ดู error log ใน Event Viewer

## การตั้งค่าเพิ่มเติม (Optional)

### 1. Enable HTTPS Redirect

แก้ไข `web.config` โดยเอา comment ออกจากส่วน HTTPS redirect:

```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="off" ignoreCase="true" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

### 2. Enable Compression

1. เปิด IIS Manager → เลือก Server → **Compression**
2. เลือก:
   - ✅ Enable static content compression
   - ✅ Enable dynamic content compression

### 3. Cache Static Files

ไฟล์ `web.config` มีการตั้งค่า cache ไว้แล้ว (365 วัน) สำหรับ static files

## สรุปคำสั่งที่สำคัญ

```bash
# Build สำหรับ IIS
npm run build:iis

# Build ปกติ
npm run build

# Run development server
npm run dev

# Check for errors
npm run lint
```

## ข้อควรระวัง

1. **อย่าใช้ API Routes**: Next.js static export ไม่รองรับ API routes
2. **อย่าใช้ Server Components**: ทุก component ต้องเป็น 'use client'
3. **อย่าใช้ Dynamic Routes**: ต้อง pre-render ทุกหน้าตอน build
4. **basePath**: ถ้าใช้ subdirectory ต้องตั้ง basePath ใน next.config.mjs

## ข้อมูลเพิ่มเติม

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

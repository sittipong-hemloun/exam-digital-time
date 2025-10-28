# PM2 กับ IIS - คู่มือการใช้งานเบื้องต้น

## สารบัญ
- [แนะนำ PM2](#แนะนำ-pm2)
- [ติดตั้ง PM2](#ติดตั้ง-pm2)
- [ตั้งค่า PM2 สำหรับ Next.js](#ตั้งค่า-pm2-สำหรับ-nextjs)
- [ตั้งค่า IIS Reverse Proxy](#ตั้งค่า-iis-reverse-proxy)
- [คำสั่ง PM2 พื้นฐาน](#คำสั่ง-pm2-พื้นฐาน)
- [การแก้ปัญหาทั่วไป](#การแก้ปัญหาทั่วไป)

---

## แนะนำ PM2

**PM2** เป็น Process Manager สำหรับ Node.js ที่ช่วย:
- รัน Node.js applications แบบ daemon (background process)
- Auto restart เมื่อเกิด crash
- Monitor CPU และ Memory usage
- จัดการ Logs
- Load balancing (cluster mode)

**IIS (Internet Information Services)** เป็น Web Server ของ Windows ที่ใช้เป็น:
- Reverse Proxy ไปยัง Node.js app
- SSL/TLS Termination
- Load Balancer

---

## ติดตั้ง PM2

### 1. ติดตั้ง PM2 globally

```bash
npm install -g pm2
```

### 2. ตรวจสอบการติดตั้ง

```bash
pm2 -v
```

---

## ตั้งค่า PM2 สำหรับ Next.js

### 1. สร้างไฟล์ `ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [
    {
      // ชื่อ application
      name: 'exam-digital-time',

      // Script ที่ต้องการรัน (ใช้ Next.js built-in server)
      script: 'node_modules/next/dist/bin/next',
      args: 'start',

      // Interpreter
      interpreter: 'node',

      // จำนวน instances (1 = single instance)
      instances: 1,

      // Execution mode
      exec_mode: 'cluster',

      // Environment variables (Development)
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: 'localhost',
      },

      // Environment variables (Production)
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: 'localhost',
      },

      // Watch mode (ปิดใน production)
      watch: false,
      watch_delay: 1000,
      ignore_watch: [
        'node_modules',
        '.next',
        '.git',
        'coverage',
        'logs',
        '*.log',
      ],

      // Auto restart
      autorestart: true,

      // Max memory restart
      max_memory_restart: '1G',

      // Log files
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      merge_logs: true,
      time: true,

      // Graceful shutdown
      kill_timeout: 10000,
      listen_timeout: 3000,

      // Min uptime และ max restarts
      min_uptime: '10s',
      max_restarts: 10,
      min_uptime_window: 60000,
    },
  ],
}
```

### 2. เพิ่ม scripts ใน `package.json`

```json
{
  "scripts": {
    "start:pm2": "pm2 start ecosystem.config.cjs",
    "start:pm2:prod": "pm2 start ecosystem.config.cjs --env production",
    "pm2:stop": "pm2 stop exam-digital-time",
    "pm2:restart": "pm2 restart exam-digital-time",
    "pm2:reload": "pm2 reload ecosystem.config.cjs",
    "pm2:logs": "pm2 logs exam-digital-time",
    "pm2:delete": "pm2 delete exam-digital-time"
  }
}
```

---

## ตั้งค่า IIS Reverse Proxy

### 1. ติดตั้ง IIS Modules

ติดตั้ง modules เหล่านี้ผ่าน Web Platform Installer:
- **URL Rewrite Module**
- **Application Request Routing (ARR)**

### 2. เปิดใช้งาน ARR Proxy

1. เปิด IIS Manager
2. เลือก Server node (root level)
3. Double-click "Application Request Routing Cache"
4. คลิก "Server Proxy Settings" ทางขวามือ
5. เช็ค "Enable proxy"
6. คลิก Apply

### 3. สร้างไฟล์ `web.config`

วางไฟล์นี้ในรูท directory ของ IIS site:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <!-- IIS Reverse Proxy to Node.js Server -->
    <rewrite>
      <rules>
        <!-- Prevent infinite redirect loop -->
        <rule name="PreventProxyLoop" stopProcessing="true">
          <match url="^(.*)$" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{HTTP_X_FORWARDED_FOR}" pattern="." />
          </conditions>
          <action type="None" />
        </rule>

        <!-- Forward HTTPS requests to Node.js -->
        <rule name="ReverseProxyToNodeHTTPS" stopProcessing="true">
          <match url="^(.*)$" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{HTTPS}" pattern="on" />
            <add input="{HTTP_X_FORWARDED_FOR}" pattern="^$" />
          </conditions>
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
            <set name="HTTP_X_FORWARDED_FOR" value="{REMOTE_ADDR}" />
            <set name="HTTP_X_ORIGINAL_URL" value="{UNENCODED_URL}" />
          </serverVariables>
        </rule>

        <!-- Forward HTTP requests to Node.js -->
        <rule name="ReverseProxyToNodeHTTP" stopProcessing="true">
          <match url="^(.*)$" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
            <add input="{HTTPS}" pattern="off" />
            <add input="{HTTP_X_FORWARDED_FOR}" pattern="^$" />
          </conditions>
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="http" />
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
            <set name="HTTP_X_FORWARDED_FOR" value="{REMOTE_ADDR}" />
            <set name="HTTP_X_ORIGINAL_URL" value="{UNENCODED_URL}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>

    <!-- Enable WebSocket -->
    <webSocket enabled="true" />

    <!-- MIME types -->
    <staticContent>
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>

    <!-- Security headers -->
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-XSS-Protection" value="1; mode=block" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

---

## คำสั่ง PM2 พื้นฐาน

### เริ่มต้นใช้งาน

```bash
# เริ่ม app (development)
pm2 start ecosystem.config.cjs

# เริ่ม app (production)
pm2 start ecosystem.config.cjs --env production

# หรือใช้ npm script
npm run start:pm2:prod
```

### จัดการ Process

```bash
# ดูรายการ processes ทั้งหมด
pm2 list
pm2 status

# ดูรายละเอียด process
pm2 describe exam-digital-time
pm2 show exam-digital-time

# Restart process
pm2 restart exam-digital-time

# Reload (graceful restart - zero downtime)
pm2 reload exam-digital-time

# Stop process
pm2 stop exam-digital-time

# Delete process
pm2 delete exam-digital-time

# Restart และ update environment variables
pm2 restart exam-digital-time --update-env
```

### ดู Logs

```bash
# ดู logs แบบ real-time
pm2 logs exam-digital-time

# ดู logs 50 บรรทัดล่าสุด (ไม่ติดตาม)
pm2 logs exam-digital-time --lines 50 --nostream

# ดูเฉพาะ error logs
pm2 logs exam-digital-time --err

# ล้าง logs
pm2 flush
```

### Monitor

```bash
# Monitor CPU และ Memory
pm2 monit

# ดู environment variables
pm2 env <id>

# ตัวอย่าง
pm2 env 0
```

### การจัดการหลาย Processes

```bash
# Restart ทุก processes
pm2 restart all

# Stop ทุก processes
pm2 stop all

# Delete ทุก processes
pm2 delete all
```

### Auto-start เมื่อ Reboot

```bash
# สร้าง startup script
pm2 startup

# บันทึก process list ปัจจุบัน
pm2 save

# ลบ startup script
pm2 unstartup
```

---

## การแก้ปัญหาทั่วไป

### 1. Process ติด "errored" status

**สาเหตุ:** Application crash หลายครั้งติดต่อกัน

**วิธีแก้:**
```bash
# ดู error logs
pm2 logs exam-digital-time --err --lines 50 --nostream

# ลบและเริ่มใหม่
pm2 delete exam-digital-time
pm2 start ecosystem.config.cjs --env production
```

### 2. Static files ไม่โหลด (404 errors)

**สาเหตุ:** web.config block static files

**วิธีแก้:**
- ตรวจสอบว่าไม่มีกฎ "SkipStaticFiles" ใน web.config
- ให้ทุก requests ผ่าน Node.js app

### 3. MIME type errors

**สาเหตุ:** IIS ไม่รู้จัก file extensions

**วิธีแก้:**
- เพิ่ม MIME types ใน web.config (ดูด้านบน)
- หรือให้ Node.js จัดการ static files ทั้งหมด

### 4. "Could not find a production build" error

**สาเหตุ:** ไฟล์ BUILD_ID หายไป

**วิธีแก้:**
```bash
# Build ใหม่
npm run build

# ตรวจสอบว่ามี BUILD_ID
ls .next/BUILD_ID

# Restart PM2
pm2 restart exam-digital-time
```

### 5. Prisma Client error

**สาเหตุ:** Prisma Client ยังไม่ได้ generate

**วิธีแก้:**
```bash
# Generate Prisma Client
npx prisma generate

# Restart PM2
pm2 restart exam-digital-time
```

### 6. Process รีสตาร์ทบ่อย (watch mode)

**สาเหตุ:** Watch mode เปิดอยู่ใน production

**วิธีแก้:**
```javascript
// ใน ecosystem.config.cjs
watch: false,  // ตั้งเป็น false สำหรับ production
```

### 7. เช็ค Environment Variables

```bash
# ดู env vars ของ process
pm2 env <process_id>

# ตรวจสอบว่าเป็น production หรือไม่
pm2 env 0 | grep NODE_ENV
```

---

## Workflow ทั่วไป

### การ Deploy ครั้งแรก

```bash
# 1. Build application
npm install
npm run build

# 2. Generate Prisma Client (ถ้าใช้)
npx prisma generate

# 3. Start PM2
pm2 start ecosystem.config.cjs --env production

# 4. Save process list
pm2 save

# 5. ตั้งค่า auto-start
pm2 startup
```

### การ Update Code

```bash
# 1. Pull code ใหม่
git pull

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Generate Prisma Client (ถ้าใช้)
npx prisma generate

# 5. Reload PM2 (zero downtime)
pm2 reload exam-digital-time
```

### การตรวจสอบสถานะ

```bash
# 1. ดู process list
pm2 list

# 2. ดู logs
pm2 logs exam-digital-time --lines 20 --nostream

# 3. ดู memory/cpu
pm2 monit

# 4. ทดสอบเว็บ
curl http://localhost:3000
```

---

## ตัวอย่างการใช้งานจริง

### Scenario 1: Server รีบูต

```bash
# PM2 จะ auto-start (ถ้าตั้งค่า startup script ไว้)
# ตรวจสอบสถานะ
pm2 list

# ดู logs ว่า start ขึ้นมาหรือไม่
pm2 logs exam-digital-time --lines 20
```

### Scenario 2: Application Crash

```bash
# PM2 จะ auto-restart โดยอัตโนมัติ
# ตรวจสอบ error
pm2 logs exam-digital-time --err --lines 50 --nostream

# ถ้า crash บ่อย ให้ดู restart count
pm2 list

# แก้ไข code แล้ว deploy ใหม่
git pull
npm run build
pm2 reload exam-digital-time
```

### Scenario 3: เปลี่ยน Environment Variables

```bash
# แก้ไข ecosystem.config.cjs
# จากนั้น restart พร้อม update env
pm2 delete exam-digital-time
pm2 start ecosystem.config.cjs --env production
```

---

## Best Practices

1. **ใช้ Production Mode**
   - ตั้ง `NODE_ENV=production`
   - ปิด `watch: false`
   - Build ก่อน deploy

2. **จัดการ Logs**
   - ใช้ log rotation
   - เก็บ logs แยก (error, out, combined)
   - เคลียร์ logs เก่าเป็นระยะ

3. **Monitor Resources**
   - ตั้ง `max_memory_restart`
   - ใช้ `pm2 monit` เช็คเป็นประจำ
   - ตั้ง alerts (ถ้าใช้ PM2 Plus)

4. **Graceful Shutdown**
   - ตั้ง `kill_timeout` ที่เหมาะสม
   - Handle SIGTERM/SIGINT signals

5. **Auto Restart Configuration**
   - ตั้ง `max_restarts` ป้องกัน infinite restart loop
   - ตั้ง `min_uptime` กำหนดเวลาขั้นต่ำก่อนถือว่า start สำเร็จ

---

## Resources

- [PM2 Official Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- [IIS Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing)

---

**อัพเดทล่าสุด:** 2025-10-28

# استخدم صورة Node.js رسمية (ممكن تغير الـ version لو عايز)
FROM node:18-bullseye-slim

# تثبيت Python و make (اللي node-gyp بيحتاجهم للـ build)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# تعيين مجلد العمل داخل الكونتينر
WORKDIR /app

# انسخ ملفات الـ package* عشان نعمل npm install (وده بيسرع الـ build cache)
COPY package.json package-lock.json ./

# تثبيت الـ dependencies (وده اللي كان بيفشل)
RUN npm ci --omit=dev --production

# انسخ باقي ملفات المشروع
COPY . .

# Build الـ frontend باستخدام Parcel (لو لسه عايز تبنيها على Railway)
# لو هترفع bundle.js جاهز، ممكن تشيل السطر ده وتتأكد ان start script هو node app.js بس

# تحديد البورت اللي السيرفر هيشتغل عليه
EXPOSE 4200

# الأمر اللي هيشغل السيرفر
CMD ["npm", "start"]
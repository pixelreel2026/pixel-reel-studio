# دليل نشر Pixel & Reel Studio على Netlify

## 🚀 طرق النشر

### الطريقة 1: النشر المباشر من GitHub (الأفضل)

#### الخطوة 1: الذهاب إلى Netlify
1. اذهب إلى https://app.netlify.com
2. سجل الدخول أو أنشئ حساب جديد

#### الخطوة 2: ربط GitHub
1. اضغط على "New site from Git"
2. اختر "GitHub" كمزود الخدمة
3. ارتبط بحسابك على GitHub
4. اختر المستودع `pixel-reel-studio`

#### الخطوة 3: إعدادات البناء
- **Build command:** `pnpm build`
- **Publish directory:** `dist/public`
- **Node version:** 18.x أو أعلى

#### الخطوة 4: متغيرات البيئة
في إعدادات Netlify، أضف المتغيرات التالية:

```
DATABASE_URL=mysql://...
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
OPENAI_API_KEY=sk-...
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...
```

#### الخطوة 5: النشر
اضغط على "Deploy site" وانتظر انتهاء البناء.

---

### الطريقة 2: النشر من سطر الأوامر

#### المتطلبات
```bash
npm install -g netlify-cli
```

#### الخطوات
```bash
# 1. الذهاب إلى مجلد المشروع
cd pixel-reel-studio

# 2. بناء المشروع
pnpm build

# 3. تسجيل الدخول إلى Netlify
netlify login

# 4. ربط المشروع
netlify init

# 5. النشر
netlify deploy --prod
```

---

### الطريقة 3: النشر اليدوي

#### الخطوات
```bash
# 1. بناء المشروع
pnpm build

# 2. تحميل الملفات من dist/public إلى Netlify
# - اذهب إلى https://app.netlify.com
# - اختر "Deploys"
# - اسحب وأفلت مجلد dist/public
```

---

## ⚙️ إعدادات Netlify المتقدمة

### netlify.toml (موجود بالفعل)
تم إنشاء ملف `netlify.toml` بالإعدادات التالية:
- إعادة توجيه SPA
- رؤوس الأمان
- تخزين مؤقت محسّن
- دعم الدوال الخادمة

### دوال Netlify (اختياري)
إذا أردت استخدام دوال Netlify بدلاً من خادم Node.js:

```bash
# أنشئ مجلد netlify/functions
mkdir -p netlify/functions

# أضف دوالك هناك
```

---

## 🔒 متغيرات البيئة الحساسة

**تحذير:** لا تضع المتغيرات الحساسة في الكود!

### الطريقة الآمنة:
1. في لوحة تحكم Netlify
2. اذهب إلى "Site settings" → "Build & deploy" → "Environment"
3. أضف المتغيرات هناك

### المتغيرات المطلوبة:
- `DATABASE_URL` - رابط قاعدة البيانات
- `STRIPE_SECRET_KEY` - مفتاح Stripe السري
- `AWS_ACCESS_KEY_ID` - مفتاح AWS
- `AWS_SECRET_ACCESS_KEY` - السر الخاص بـ AWS
- `OPENAI_API_KEY` - مفتاح OpenAI API

---

## 🧪 اختبار النشر

### قبل النشر
```bash
# تحقق من البناء محلياً
pnpm build

# اختبر الإنتاج محلياً
pnpm start
```

### بعد النشر
1. اختبر الرابط الذي توفره Netlify
2. تحقق من جميع الصفحات
3. اختبر الدوال الديناميكية
4. تحقق من الأداء

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Build failed"
```bash
# تحقق من السجلات في Netlify Dashboard
# تأكد من وجود جميع المتغيرات البيئية
# تحقق من التوافقية مع Node.js 18+
```

### الخطأ: "Cannot find module"
```bash
# تأكد من تثبيت جميع التبعيات
pnpm install

# أعد البناء
pnpm build
```

### الخطأ: "Database connection failed"
```bash
# تحقق من متغير DATABASE_URL
# تأكد من أن قاعدة البيانات متاحة من الخارج
# تحقق من جدار الحماية والأذونات
```

---

## 📊 مراقبة الأداء

### في لوحة تحكم Netlify
- **Analytics** - عرض الإحصائيات
- **Logs** - عرض السجلات
- **Deploys** - تاريخ النشرات
- **Functions** - مراقبة الدوال

### أدوات خارجية
- **Google PageSpeed Insights** - قياس الأداء
- **Lighthouse** - تقييم الجودة
- **WebPageTest** - اختبار التحميل

---

## 🔄 التحديثات التلقائية

### الإعداد
1. في GitHub، اذهب إلى "Settings" → "Webhooks"
2. Netlify يضيف webhook تلقائياً
3. كل push إلى main سينشر تلقائياً

### التحكم
- **Auto-publish:** تفعيل/تعطيل النشر التلقائي
- **Deploy previews:** معاينات لـ Pull Requests
- **Branch deploys:** نشر فروع محددة

---

## 💡 نصائح مهمة

1. **استخدم .env.example** - لتوثيق المتغيرات المطلوبة
2. **اختبر محلياً أولاً** - قبل النشر على الإنتاج
3. **راقب السجلات** - تحقق من الأخطاء بعد النشر
4. **استخدم Deploy Previews** - لاختبار PR قبل الدمج
5. **احتفظ بنسخة احتياطية** - من قاعدة البيانات

---

## 📞 الدعم

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Community:** https://community.netlify.com
- **GitHub Issues:** https://github.com/pixelreel2026/pixel-reel-studio/issues

---

**آخر تحديث:** يونيو 2026
**الإصدار:** 1.0.0

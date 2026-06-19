# 🚀 البدء السريع - Pixel & Reel Studio

## ⚡ تشغيل محلي (5 دقائق)

```bash
# 1. استنساخ المشروع
git clone https://github.com/pixelreel2026/pixel-reel-studio.git
cd pixel-reel-studio

# 2. تثبيت التبعيات
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# عدّل .env بمعلوماتك

# 4. تشغيل التطوير
pnpm dev

# 5. افتح المتصفح
# http://localhost:5173
```

## 🌐 النشر على Netlify (10 دقائق)

### الخطوة 1: ربط GitHub
```bash
# تأكد من أن المشروع مرفوع على GitHub
git push origin main
```

### الخطوة 2: الذهاب إلى Netlify
1. اذهب إلى https://app.netlify.com
2. اضغط "New site from Git"
3. اختر "GitHub" وارتبط بحسابك
4. اختر المستودع `pixel-reel-studio`

### الخطوة 3: الإعدادات
- **Build command:** `pnpm build`
- **Publish directory:** `dist/public`
- أضف متغيرات البيئة من `.env`

### الخطوة 4: النشر
اضغط "Deploy site" وانتظر!

---

## 📁 هيكل المشروع

```
pixel-reel-studio/
├── client/          # واجهة المستخدم (React)
├── server/          # الخادم (Node.js)
├── shared/          # الكود المشترك
├── dist/            # الملفات المبنية
├── netlify.toml     # إعدادات Netlify
└── README.md        # التوثيق الكامل
```

---

## 🔧 الأوامر الأساسية

```bash
# التطوير
pnpm dev

# البناء
pnpm build

# الاختبار
pnpm test

# التحقق من TypeScript
pnpm check

# تنسيق الكود
pnpm format

# قاعدة البيانات
pnpm db:push
```

---

## 📝 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `package.json` | التبعيات والأوامر |
| `.env.example` | المتغيرات المطلوبة |
| `netlify.toml` | إعدادات Netlify |
| `vite.config.ts` | إعدادات Vite |
| `tsconfig.json` | إعدادات TypeScript |

---

## 🎯 الخطوات التالية

1. ✅ اقرأ `README.md` للتفاصيل الكاملة
2. ✅ اقرأ `NETLIFY_DEPLOYMENT.md` لخيارات النشر
3. ✅ استكشف `client/src/pages` لفهم الصفحات
4. ✅ عدّل `server/routers.ts` لإضافة API جديدة
5. ✅ اختبر محلياً قبل النشر

---

## 🆘 المساعدة

- 📖 **التوثيق:** اقرأ `README.md`
- 🚀 **النشر:** اقرأ `NETLIFY_DEPLOYMENT.md`
- 🐛 **الأخطاء:** تحقق من السجلات في Netlify Dashboard
- 💬 **الدعم:** افتح Issue على GitHub

---

**استمتع بـ Pixel & Reel Studio! 🎉**

# 🎭 TheaterTicket Laravel Backend API
سامانه جامع رزرواسیون آنلاین صندلی تئاتر و گیت استعلام و ابطال بلیط با **لاراول ۱۱ (Laravel 11)**

این بک‌اند به صورت ماژولار، با رعایت بالاترین استانداردهای امنیتی، مقیاس‌پذیری و جلوگیری از رزرو همزمان (Race Condition Double-Booking) پیاده‌سازی شده است.

---

## 🚀 ویژگی‌های کلیدی بک‌اند

1. **مدیریت نمایش‌ها و سانس‌ها (Plays & Sessions):**
   - جستجوی بلادرنگ با فیلتر ژانر، سالن و نام بازیگران.
   - نقشه زنده صندلی‌های آزاد و اشغال‌شده با متد `sessionSeats`.

2. **رزرواسیون اتمیک و ضد رزرو همزمان (Atomic Concurrency Locking):**
   - استفاده از `DB::transaction` و `lockForUpdate` بر روی ردیف‌های سانس جهت جلوگیری ۱۰۰٪ از رزرو همزمان یک صندلی توسط دو کاربر.
   - تولید کد پیگیری یکتا (فرمت `TT-XXXXXX`) و توکن هش‌شده رمزنگاری (`qr_token`).

3. **پنل گیت ورودی و استعلام بلیط (Gate Admission Inspector):**
   - استعلام اصالت بلیط با کد پیگیری یا بارکدخوان (`/api/v1/inspector/inquiry`).
   - تایید ورود و ابطال فوری بلیط (`/api/v1/inspector/admit`) جهت جلوگیری از ورود تکراری.
   - مانیتورینگ زنده آمار تماشاگران، درآمد و تعداد صندلی‌های پر شده (`/api/v1/inspector/stats`).

---

## 🛠️ راهنمای راه‌اندازی سریع

### ۱. پیش‌نیازها
- PHP >= 8.2
- Composer
- دیتابیس MySQL / MariaDB یا PostgreSQL

### ۲. نصب پکیج‌ها و تنظیم فایل محیطی
```bash
cd laravel-backend
composer install
cp .env.example .env
php artisan key:generate
```

تنظیمات دیتابیس در فایل `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=theaterticket_db
DB_USERNAME=root
DB_PASSWORD=
```

### ۳. اجرای مایگریشن‌ها و سیدر داده‌های اولیه
```bash
php artisan migrate --seed --seeder=TheaterDatabaseSeeder
```

### ۴. اجرای وب‌سرور لاراول
```bash
php artisan serve --port=8000
```
سرویس API در آدرس `http://localhost:8000/api/v1` در دسترس خواهد بود.

---

## 📡 مستندات Endpoints API

### ۱. دریافت لیست نمایش‌ها
- **متد:** `GET /api/v1/plays`
- **پارامترها (Query):**
  - `search` (اختیاری): جستجو در عنوان، بازیگر یا سالن.
  - `genre` (اختیاری): فیلتر بر اساس ژانر (`تراژدی`, `ابزورد`, `all`).

### ۲. دریافت نقشه صندلی‌های رزرو شده سانس
- **متد:** `GET /api/v1/sessions/{sessionId}/seats`
- **پاسخ:**
```json
{
  "status": "success",
  "session": {
    "id": 1,
    "datetime": "2026-09-24T19:30:00Z",
    "hall_name": "سالن اصلی تئاتر شهر",
    "base_price": 280000,
    "vip_price": 420000
  },
  "taken_seats": ["R1-S4", "R1-S5"]
}
```

### ۳. ثبت سفارش و صدور بلیط (اتمیک)
- **متد:** `POST /api/v1/bookings`
- **بدنه درخواست (JSON):**
```json
{
  "session_id": 1,
  "buyer_name": "امیرحسین صادقی",
  "buyer_phone": "09121234567",
  "seats": [
    {
      "code": "R1-S6",
      "row": 1,
      "number": 6,
      "type": "vip",
      "label": "ردیف ۱ - صندلی ۶ (VIP)",
      "price": 420000
    }
  ]
}
```
- **پاسخ موفق (201 Created):**
```json
{
  "status": "success",
  "message": "رزرو بلیط با موفقیت ثبت شد و کد پیگیری صادر گردید.",
  "ticket": {
    "id": "TT-914820",
    "play_title": "نمایش هملت",
    "session_date_fa": "۱۴۰۵/۰۷/۰۳ ۱۹:۳۰",
    "buyer_name": "امیرحسین صادقی",
    "total_amount": 420000,
    "status": "valid"
  }
}
```

### ۴. استعلام بلیط در گیت ورودی
- **متد:** `POST /api/v1/inspector/inquiry`
- **بدنه درخواست (JSON):**
```json
{
  "query": "TT-782140"
}
```

### ۵. تایید ورود و ابطال بلیط در گیت
- **متد:** `POST /api/v1/inspector/admit`
- **بدنه درخواست (JSON):**
```json
{
  "tracking_code": "TT-782140",
  "inspector_name": "متصدی گیت ورودی ۱"
}
```

### ۶. آمار زنده تماشاگران و سالن
- **متد:** `GET /api/v1/inspector/stats`
```json
{
  "status": "success",
  "stats": {
    "total_tickets_issued": 142,
    "total_seats_sold": 284,
    "total_admitted": 118,
    "pending_admission": 24,
    "total_revenue": 92400000
  }
}
```

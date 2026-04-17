# GitHub Secrets Setup Guide

এই ফাইলটি আপনাকে GitHub Secrets সঠিকভাবে সেটআপ করতে সাহায্য করবে।

## 🔐 GitHub Secrets কনফিগারেশন

আপনার GitHub Repository এ যান এবং নিম্নলিখিত ধাপ অনুসরণ করুন:

1. **Repository Settings এ যান**
   - Repository page এ `Settings` ট্যাব ক্লিক করুন
   - বাম পাশ থেকে `Secrets and variables` → `Actions` নির্বাচন করুন

2. **New repository secret ক্লিক করুন**

### Required Deployment Secrets (বাধ্যতামূলক):

#### 1. `DEPLOY_HOST`
আপনার সার্ভারের IP Address বা ডোমেইন নাম

```
Example: 123.45.67.89
```

#### 2. `DEPLOY_USER`
সার্ভারে SSH করার জন্য ইউজারনাম

```
Example: ubuntu
Example: root
Example: deploy
```

#### 3. `DEPLOY_KEY`
সার্ভারে SSH করার জন্য Private Key

**এটি কীভাবে পাবেন:**

লোকাল মেশিনে টার্মিনালে চালান:

```bash
# নতুন SSH Key generate করুন (যদি না থাকে)
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy

# Private Key দেখুন এবং কপি করুন
cat ~/.ssh/github-deploy
```

এর সম্পূর্ণ আউটপুট GitHub Secret এ পেস্ট করুন। এটি এরকম দেখায়:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUtbm9uZS1ub25lAAAAAAAAAEcAAAA...
...
-----END OPENSSH PRIVATE KEY-----
```

#### 4. `DEPLOY_PATH` (Optional)
সার্ভারে যেখানে ডিপ্লয় করবেন

```
Default: /var/www/rfv-website
```

### Application Configuration Secrets (অ্যাপ্লিকেশন কনফিগ):

#### 5. `NEXT_PUBLIC_SITE_NAME`
আপনার সাইটের নাম

```
Value: Saif Academy
```

#### 6. `NEXT_PUBLIC_WHATSAPP_NUMBER`
WhatsApp নম্বর (যোগাযোগের জন্য)

```
Value: +8801552636185
```

#### 7. `NEXT_PUBLIC_FACEBOOK_URL`
Facebook পেজ URL

```
Value: https://www.facebook.com/share/18M5pX1q6k/
```

#### 8. `NEXT_PUBLIC_BKASH_NUMBER`
bKash পেমেন্ট নম্বর

```
Value: +880 1552-636185
```

#### 9. `NEXT_PUBLIC_NAGAD_NUMBER`
Nagad পেমেন্ট নম্বর

```
Value: +880 1552-636185
```

### Email Configuration Secrets (ইমেইল সেটআপ):

#### 10. `SMTP_HOST`
SMTP সার্ভার হোস্ট নাম

```
Example Gmail: smtp.gmail.com
Example Outlook: smtp-mail.outlook.com
Example Custom: mail.yourserver.com
```

#### 11. `SMTP_PORT`
SMTP পোর্ট নম্বর

```
Standard: 587 (TLS)
SSL: 465
```

#### 12. `SMTP_USER`
SMTP ইউজারনাম/ইমেইল

```
Example: noreply@yoursite.com
Example: admin@yoursite.com
```

#### 13. `SMTP_PASS`
SMTP পাসওয়ার্ড

⚠️ **গুরুত্বপূর্ণ**: এটি আসল পাসওয়ার্ড নয়, আপনার ইমেইল প্রোভাইডারের "App Password" হওয়া উচিত।

```
Gmail এর জন্য: Google Account এ "App Passwords" থেকে তৈরি করুন
Outlook এর জন্য: Microsoft Account এ "App Passwords" থেকে তৈরি করুন
```

#### 14. `SMTP_FROM`
ইমেইল থেকে প্রদর্শিত নাম এবং ঠিকানা

```
Value: Saif Academy <noreply@saifacademy.example>
```

#### 15. `ADMIN_EMAIL`
যেখানে নোটিফিকেশন পাঠাবেন

```
Value: admin@saifacademy.example
```

## 🔑 SSH Key সার্ভারে যোগ করা

আপনার সার্ভারে নিম্নলিখিত করুন:

```bash
# সার্ভারে লগইন করুন
ssh user@your-server-ip

# SSH key directory তৈরি করুন
mkdir -p ~/.ssh

# Public key যোগ করুন (লোকাল মেশিন থেকে কপি করুন)
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO... github-deploy
EOF

# অনুমতি সেট করুন
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# সার্ভার থেকে লোকাল কম্পিউটার থেকে SSH পরীক্ষা করুন
# লোকাল: ssh -i ~/.ssh/github-deploy user@server-ip
```

## ✅ Secrets যাচাই করুন

GitHub Actions চালু হওয়ার পরে:

1. Repository এ `Actions` ট্যাবে যান
2. সর্বশেষ workflow run এ ক্লিক করুন
3. লগ দেখুন যে সবকিছু সঠিক কি না

যদি ত্রুটি হয়:
- `Permission denied (publickey)` → SSH Key সমস্যা
- `npm: command not found` → সার্ভারে Node.js নেই
- `Build error` → Environment variables সঠিক নয়

## 🔄 Deploy করুন

সবকিছু সেটআপ করার পরে:

```bash
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

এটি স্বয়ংক্রিয়ভাবে ডিপ্লয় প্রক্রিয়া শুরু করবে!

## 🚨 নিরাপত্তা টিপস

1. **কখনো Secrets কমিট করবেন না**
   - `.env` ফাইল git থেকে বাদ দিন
   - GitHub Secrets ব্যবহার করুন

2. **Secrets রোটেট করুন**
   - নিয়মিত পাসওয়ার্ড পরিবর্তন করুন
   - SSH Keys আপডেট করুন

3. **সার্ভার সুরক্ষা**
   - ফায়ারওয়াল কনফিগার করুন
   - শুধুমাত্র প্রয়োজনীয় পোর্ট খুলুন (22 SSH, 80 HTTP, 443 HTTPS)

4. **Log পর্যবেক্ষণ করুন**
   - নিয়মিত সার্ভার লগ চেক করুন
   - সন্দেহজনক কার্যকলাপের জন্য সতর্ক থাকুন

## 📞 সাপোর্ট

সমস্যা হলে:
1. GitHub Actions লগ চেক করুন
2. সার্ভার লগ দেখুন: `pm2 logs`
3. SSH সংযোগ পরীক্ষা করুন: `ssh -v user@server-ip`

# ✅ Deployment Execution Checklist

এই চেকলিস্ট ব্যবহার করে আপনার ডিপ্লয়মেন্ট সঠিকভাবে সম্পন্ন করুন।

## Phase 1: প্রাথমিক প্রস্তুতি (Initial Preparation)

- [ ] সকল documentation পড়েছি:
  - [ ] DEPLOYMENT_GUIDE.md
  - [ ] GITHUB_SECRETS_SETUP.md
  - [ ] DEPLOYMENT_ARCHITECTURE.md

- [ ] GitHub Repository প্রস্তুত:
  - [ ] Repository main branch এ আছে
  - [ ] সকল ফাইল committed
  - [ ] Deploy workflow files যুক্ত হয়েছে

- [ ] সার্ভার প্রস্তুত:
  - [ ] Linux Server (Ubuntu 20.04+) আছে
  - [ ] Server IP/Domain নোট করেছি
  - [ ] SSH access আছে

---

## Phase 2: SSH Key সেটআপ

**লোকাল মেশিনে (Local Machine):**

- [ ] SSH Key generate করেছি:
  ```bash
  ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy
  ```

- [ ] পাবলিক কী সার্ভারে কপি করেছি:
  ```bash
  ssh-copy-id -i ~/.ssh/github-deploy.pub user@server-ip
  ```

- [ ] SSH সংযোগ টেস্ট করেছি:
  ```bash
  ssh -i ~/.ssh/github-deploy user@server-ip
  ```

- [ ] Private Key দেখেছি এবং কপি করেছি:
  ```bash
  cat ~/.ssh/github-deploy
  ```

---

## Phase 3: GitHub Secrets কনফিগারেশন

**GitHub Repository Settings এ:**

### আবশ্যক Secrets:

- [ ] `DEPLOY_HOST`
  - Value: `your-server-ip` (e.g., 123.45.67.89)

- [ ] `DEPLOY_USER`
  - Value: `ubuntu` (or your SSH username)

- [ ] `DEPLOY_KEY`
  - Value: (Complete private SSH key content)

- [ ] `DEPLOY_PATH` (Optional)
  - Value: `/var/www/rfv-website`

### অ্যাপ্লিকেশন Configuration (Optional):

- [ ] `NEXT_PUBLIC_SITE_NAME`
  - Value: `Saif Academy`

- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - Value: `+8801552636185`

- [ ] `NEXT_PUBLIC_FACEBOOK_URL`
  - Value: (আপনার Facebook URL)

- [ ] `NEXT_PUBLIC_BKASH_NUMBER`
  - Value: (আপনার bKash নম্বর)

- [ ] `NEXT_PUBLIC_NAGAD_NUMBER`
  - Value: (আপনার Nagad নম্বর)

### Email Configuration (Optional):

- [ ] `SMTP_HOST`
  - Value: (আপনার SMTP হোস্ট)

- [ ] `SMTP_PORT`
  - Value: `587`

- [ ] `SMTP_USER`
  - Value: (আপনার SMTP ইউজারনাম)

- [ ] `SMTP_PASS`
  - Value: (App Password, not actual password)

- [ ] `SMTP_FROM`
  - Value: `Saif Academy <noreply@example.com>`

- [ ] `ADMIN_EMAIL`
  - Value: (আপনার Admin email)

---

## Phase 4: সার্ভার সেটআপ

**Option A: স্বয়ংক্রিয় সেটআপ (Recommended)**

- [ ] স্ক্রিপ্ট সার্ভারে কপি করেছি:
  ```bash
  scp setup-server.sh user@server-ip:/tmp/
  ```

- [ ] স্ক্রিপ্ট চালিয়েছি:
  ```bash
  ssh user@server-ip
  sudo bash /tmp/setup-server.sh
  ```

- [ ] সেটআপ সফল হয়েছে (সম্পূর্ণ আউটপুট দেখেছি)

**Option B: ম্যানুয়াল সেটআপ**

সার্ভারে:

- [ ] System আপডেট করেছি:
  ```bash
  sudo apt-get update && sudo apt-get upgrade -y
  ```

- [ ] Node.js 22 ইনস্টল করেছি:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs npm
  ```

- [ ] PM2 ইনস্টল করেছি:
  ```bash
  sudo npm install -g pm2
  ```

- [ ] Nginx ইনস্টল করেছি:
  ```bash
  sudo apt-get install -y nginx
  ```

- [ ] SSL টুলস ইনস্টল করেছি:
  ```bash
  sudo apt-get install -y certbot python3-certbot-nginx
  ```

- [ ] ডিপ্লয় ডিরেক্টরি তৈরি করেছি:
  ```bash
  sudo mkdir -p /var/www/rfv-website
  sudo chown $USER:$USER /var/www/rfv-website
  ```

- [ ] প্রজেক্ট ক্লোন করেছি:
  ```bash
  cd /var/www/rfv-website
  git clone <your-repo-url> .
  ```

- [ ] Dependencies ইনস্টল করেছি:
  ```bash
  npm ci --omit=dev
  ```

- [ ] Build করেছি:
  ```bash
  npm run build
  ```

- [ ] PM2 দিয়ে শুরু করেছি:
  ```bash
  pm2 start ecosystem.config.js --env production
  pm2 save
  pm2 startup
  ```

---

## Phase 5: প্রথম ডিপ্লয়মেন্ট টেস্ট

- [ ] ছোট পরিবর্তন করেছি (e.g., README.md)

- [ ] কমিট এবং পুশ করেছি:
  ```bash
  git add .
  git commit -m "Test deployment"
  git push origin main
  ```

- [ ] GitHub Actions চেক করেছি:
  - [ ] Repository > Actions এ ক্লিক করেছি
  - [ ] Latest Workflow দেখেছি
  - [ ] Build Job successful হয়েছে
  - [ ] Deploy Job successful হয়েছে

- [ ] সার্ভারে কোড ডিপ্লয় হয়েছে:
  ```bash
  ssh user@server-ip
  cd /var/www/rfv-website
  git log --oneline | head -1
  ```

- [ ] অ্যাপ চলছে:
  ```bash
  pm2 list
  pm2 logs rfv-website
  ```

---

## Phase 6: Web সার্ভার কনফিগারেশন

- [ ] localhost:3000 এ অ্যাক্সেস করা যায়:
  ```bash
  curl http://localhost:3000
  ```

- [ ] Nginx কনফিগ করেছি

- [ ] Nginx টেস্ট করেছি:
  ```bash
  sudo nginx -t
  ```

- [ ] Nginx রিস্টার্ট করেছি:
  ```bash
  sudo systemctl restart nginx
  ```

- [ ] HTTP এ অ্যাক্সেস করা যায়:
  ```bash
  curl http://your-domain.com
  ```

---

## Phase 7: SSL/HTTPS সেটআপ (Recommended)

- [ ] SSL সার্টিফিকেট generate করেছি:
  ```bash
  sudo certbot certonly --nginx -d your-domain.com
  ```

- [ ] HTTPS এ অ্যাক্সেস করা যায়:
  ```bash
  curl https://your-domain.com
  ```

- [ ] Auto-renewal কনফিগার করেছি:
  ```bash
  sudo systemctl enable certbot.timer
  ```

---

## Phase 8: নিরাপত্তা এবং মনিটরিং

- [ ] Firewall সেটআপ করেছি:
  ```bash
  sudo ufw enable
  sudo ufw allow 22,80,443/tcp
  ```

- [ ] .env.production ফাইল চেক করেছি:
  ```bash
  sudo nano /var/www/rfv-website/.env.production
  ```

- [ ] PM2 লগ মনিটরিং সেটআপ করেছি:
  ```bash
  pm2 logs
  ```

- [ ] সার্ভার লগ মনিটরিং সেটআপ করেছি:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```

---

## Phase 9: চূড়ান্ত পরীক্ষা এবং যাচাইকরণ

- [ ] সাইট ব্রাউজারে কাজ করছে:
  - [ ] Home page লোড হচ্ছে
  - [ ] CSS/JS সঠিকভাবে লোড হচ্ছে
  - [ ] API calls কাজ করছে

- [ ] ডেস্কটপ থেকে অ্যাক্সেস করা যায়

- [ ] মোবাইল থেকে অ্যাক্সেস করা যায়

- [ ] এনরোলমেন্ট ফর্ম সাবমিট হচ্ছে

- [ ] Admin panel অ্যাক্সেস করা যায়:
  ```
  https://your-domain.com/admin/login
  ```

- [ ] নোটিফিকেশন ইমেইল পাঠানো হচ্ছে (যদি কনফিগার করা থাকে)

---

## Phase 10: ডকুমেন্টেশন এবং ব্যাকআপ

- [ ] সকল পাসওয়ার্ড এবং কী নিরাপদে সংরক্ষণ করেছি

- [ ] সার্ভার কনফিগারেশন ডকুমেন্ট করেছি:
  - [ ] IP Address
  - [ ] Domain name
  - [ ] SSH user
  - [ ] ডিপ্লয় পাথ

- [ ] ব্যাকআপ প্ল্যান তৈরি করেছি:
  - [ ] নিয়মিত ডাটাবেস ব্যাকআপ
  - [ ] কোড রিপোজিটরি ব্যাকআপ
  - [ ] আপলোডেড ফাইল ব্যাকআপ

- [ ] জরুরি সংযোগ নম্বর নোট করেছি:
  - [ ] Server hosting support
  - [ ] Domain registrar support
  - [ ] Your contact info

---

## Phase 11: দলকে নোটিফাই করুন (উপলব্ধ হলে)

- [ ] ডেভেলপমেন্ট টিমকে জানিয়েছি

- [ ] প্রোডাকশন URL শেয়ার করেছি

- [ ] ডিপ্লয় প্রক্রিয়া ব্যাখ্যা করেছি

- [ ] জরুরি যোগাযোগ তথ্য দিয়েছি

---

## Phase 12: পরবর্তী ডিপ্লয়মেন্টের জন্য প্রক্রিয়া

ভবিষ্যতে ডিপ্লয় করার জন্য প্রক্রিয়া:

```bash
# 1. লোকালে পরিবর্তন করুন
# 2. টেস্ট করুন
# 3. Commit করুন
git add .
git commit -m "Your change description"

# 4. Push করুন (GitHub Actions স্বয়ংক্রিয়ভাবে শুরু হবে)
git push origin main

# 5. GitHub Actions মনিটর করুন
# Repository > Actions এ দেখুন

# 6. সার্ভারে চেক করুন (প্রয়োজনে)
ssh user@server-ip
cd /var/www/rfv-website
pm2 logs rfv-website
```

---

## ✅ সাফল্যের চিহ্ন

আপনার ডিপ্লয়মেন্ট সফল হয়েছে যদি:

- ✅ Site HTTPS এ অ্যাক্সেসযোগ্য
- ✅ সকল পেজ লোড হচ্ছে
- ✅ API কল করছে সঠিকভাবে
- ✅ Admin panel কাজ করছে
- ✅ Enrollment submissions কাজ করছে
- ✅ PM2 app চলছে (pm2 list)
- ✅ Nginx রানিং (sudo systemctl status nginx)
- ✅ আর কোনো errors নেই logs এ

---

## 🆘 সমস্যা হলে

যদি কিছু কাজ না করে:

1. **Logs চেক করুন:**
   - GitHub Actions: Repository > Actions
   - PM2: `pm2 logs rfv-website`
   - Nginx: `sudo tail -f /var/log/nginx/error.log`

2. **Documentation পড়ুন:**
   - DEPLOYMENT_TROUBLESHOOTING.md

3. **ম্যানুয়ালি রিস্টার্ট করুন:**
   ```bash
   pm2 restart rfv-website
   sudo systemctl restart nginx
   ```

---

## 📝 নোট এবং পর্যবেক্ষণ

এখানে আপনার নোট লিখুন:

```
সার্ভার IP: ___________________
Domain: ___________________
SSH User: ___________________
ডিপ্লয় Date: ___________________
Contact: ___________________

সমস্যা এবং সমাধান:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

**চূড়ান্ত স্থিতি:** 
- [ ] সম্পূর্ণভাবে সম্পন্ন
- [ ] পারশিয়ালি সম্পন্ন (অসম্পন্ন: _______________)
- [ ] সমস্যাযুক্ত (বিবরণ: _______________)

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Reviewed By:** _______________

---

**🎉 Congratulations! আপনার RFV Website এখন লাইভ! 🎉**

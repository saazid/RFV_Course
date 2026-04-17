# ⚡ Quick Deployment Reference

দ্রুত রেফারেন্সের জন্য এই কমান্ডগুলি ব্যবহার করুন।

## 🔐 GitHub Secrets সেটআপ (৫ মিনিটে)

```bash
# 1. সার্ভারে SSH Key তৈরি করুন
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy

# 2. Public key সার্ভারে যোগ করুন
ssh-copy-id -i ~/.ssh/github-deploy.pub user@server-ip

# 3. Private key দেখুন এবং GitHub Secret DEPLOY_KEY এ কপি করুন
cat ~/.ssh/github-deploy
```

GitHub Repository Settings > Secrets এ যুক্ত করুন:
```
DEPLOY_HOST = your-server-ip
DEPLOY_USER = ubuntu (or your username)
DEPLOY_KEY = (paste private key from above)
DEPLOY_PATH = /var/www/rfv-website
```

## 🖥️ সার্ভার সেটআপ (১০ মিনিটে)

### অপশন ১: স্বয়ংক্রিয় সেটআপ

```bash
# আপনার লোকাল মেশিনে
scp setup-server.sh user@server-ip:/tmp/
ssh user@server-ip
sudo bash /tmp/setup-server.sh ubuntu /var/www/rfv-website yourdomain.com
```

### অপশন ২: ম্যানুয়াল সেটআপ

```bash
# সার্ভারে
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs npm nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# ডিপ্লয় ডিরেক্টরি
sudo mkdir -p /var/www/rfv-website
sudo chown $USER:$USER /var/www/rfv-website
cd /var/www/rfv-website
git clone <your-repo> .

# প্রথম বিল্ড
npm ci --omit=dev
npm run build

# PM2 দিয়ে চালু করুন
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📤 প্রথম ডিপ্লয়মেন্ট

```bash
git add .
git commit -m "Setup deployment"
git push origin main

# GitHub Actions এ দেখুন
# Repository > Actions > Latest Workflow
```

## 🔄 Useful Commands

### PM2 (সার্ভারে)

```bash
# স্ট্যাটাস দেখুন
pm2 status
pm2 list

# লগ দেখুন
pm2 logs rfv-website
pm2 logs rfv-website --err

# রিস্টার্ট করুন
pm2 restart rfv-website
pm2 restart all

# স্টপ করুন
pm2 stop rfv-website
pm2 stop all

# প্রসেস মনিটর করুন
pm2 monit
```

### Nginx (সার্ভারে)

```bash
# স্ট্যাটাস চেক
sudo systemctl status nginx

# রিস্টার্ট
sudo systemctl restart nginx

# কনফিগ টেস্ট
sudo nginx -t

# লগ দেখুন
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Git (সার্ভারে)

```bash
# আপডেট পুল করুন
cd /var/www/rfv-website
git pull origin main

# বিল্ড এবং রিস্টার্ট
npm ci --omit=dev
npm run build
pm2 restart rfv-website
```

## 🐛 সাধারণ সমস্যার দ্রুত সমাধান

### "Permission denied" SSH সমস্যা
```bash
# GitHub Secret DEPLOY_KEY সঠিক কি না চেক করুন
# সার্ভারে পাবলিক কী আছে কি না চেক করুন
cat ~/.ssh/authorized_keys | grep github-deploy
```

### "Port 3000 already in use"
```bash
pm2 kill
pm2 start ecosystem.config.js --env production
```

### "Build failed"
```bash
cd /var/www/rfv-website
npm ci --omit=dev
npm run build
```

### Nginx 502 Bad Gateway
```bash
pm2 list
pm2 logs rfv-website
sudo nginx -t
sudo systemctl restart nginx
```

## 📊 Health Check

ডিপ্লয়মেন্টের পরে সবকিছু ঠিক আছে কি না চেক করুন:

```bash
# App চলছে?
curl http://localhost:3000

# Domain accessible?
curl http://your-domain.com

# HTTPS কাজ করছে?
curl https://your-domain.com

# API test
curl http://localhost:3000/api/admin/submissions
```

## 🔗 ডকুমেন্টেশন লিঙ্ক

- [সম্পূর্ণ ডিপ্লয়মেন্ট গাইড](DEPLOYMENT_GUIDE.md)
- [GitHub Secrets সেটআপ](GITHUB_SECRETS_SETUP.md)
- [সমস্যা সমাধান](DEPLOYMENT_TROUBLESHOOTING.md)
- [সেটআপ সম্পূর্ণ হয়েছে](DEPLOYMENT_SETUP_COMPLETE.md)

## 📞 জরুরি হেল্প

যদি কিছু কাজ না করে:

1. **GitHub Actions লগ চেক করুন**: Repository > Actions
2. **সার্ভার লগ চেক করুন**: `pm2 logs rfv-website`
3. **Nginx লগ চেক করুন**: `sudo tail -f /var/log/nginx/error.log`
4. **SSH সংযোগ পরীক্ষা করুন**: `ssh -v user@server-ip`

---

**Happy Deploying! 🚀**

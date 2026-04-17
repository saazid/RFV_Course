# Deployment Troubleshooting Guide

GitHub Actions deployment এর সাধারণ সমস্যা এবং সমাধান

## 🔴 সাধারণ ত্রুটি এবং সমাধান

### 1. "Permission denied (publickey)" Error

**সমস্যা**: SSH Key সংযোগ ব্যর্থ

**সমাধান**:

```bash
# সার্ভারে চেক করুন
cat ~/.ssh/authorized_keys

# যদি পাবলিক কী না থাকে, যোগ করুন:
echo "ssh-ed25519 AAAAC3NzaC1..." >> ~/.ssh/authorized_keys

# অনুমতি পরীক্ষা করুন:
ls -la ~/.ssh/
# আউটপুট হওয়া উচিত:
# drwx------  .ssh
# -rw-------  authorized_keys
```

GitHub Secret চেক করুন:
- `DEPLOY_KEY` সঠিক Private Key আছে কি না
- `DEPLOY_USER` এবং `DEPLOY_HOST` সঠিক কি না

### 2. "npm: command not found" Error

**সমস্যা**: সার্ভারে Node.js ইনস্টল নেই

**সমাধান**:

```bash
# সার্ভারে লগইন করুন এবং চালান:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# যাচাই করুন:
node --version
npm --version
```

### 3. "Build failed" Error

**সমস্যা**: Next.js build ব্যর্থ

**সমাধান**:

```bash
# GitHub Actions লগ চেক করুন বিস্তারিত ত্রুটির জন্য
# সাধারণ কারণ:
# - TypeScript errors
# - Missing dependencies
# - Invalid environment variables

# লোকাল মেশিনে পরীক্ষা করুন:
npm ci
npm run build

# সার্ভারেও পরীক্ষা করুন:
cd /var/www/rfv-website
npm ci --omit=dev
npm run build
```

### 4. "ENOENT: no such file or directory" Error

**সমস্যা**: ডিরেক্টরি বা ফাইল নেই

**সমাধান**:

```bash
# সার্ভারে ডিপ্লয় পাথ চেক করুন:
ls -la /var/www/rfv-website

# যদি খালি হয়:
cd /var/www/rfv-website
git clone <your-repo-url> .
```

### 5. "Port 3000 already in use" Error

**সমস্যা**: অন্য প্রসেস পোর্ট ব্যবহার করছে

**সমাধান**:

```bash
# কোন প্রসেস পোর্ট 3000 ব্যবহার করছে দেখুন:
sudo lsof -i :3000

# PM2 এর মাধ্যমে পুরানো প্রসেস বন্ধ করুন:
pm2 kill
pm2 list

# নতুনভাবে শুরু করুন:
pm2 start ecosystem.config.js --env production
pm2 save
```

### 6. "Cannot find module" Error

**সমস্যা**: Required package ইনস্টল নেই

**সমাধান**:

```bash
# সার্ভারে dependencies ইনস্টল করুন:
cd /var/www/rfv-website
npm ci --omit=dev

# যদি specific package এর সমস্যা হয়:
npm install <package-name>
```

### 7. Nginx 502 Bad Gateway Error

**সমস্যা**: Nginx Next.js অ্যাপে সংযোগ করতে পারছে না

**সমাধান**:

```bash
# Next.js অ্যাপ চালু আছে কি না চেক করুন:
pm2 list
pm2 logs rfv-website

# Nginx কনফিগ পরীক্ষা করুন:
sudo nginx -t

# Nginx লগ দেখুন:
sudo tail -f /var/log/nginx/error.log

# অ্যাপ ম্যানুয়ালি শুরু করুন:
pm2 start ecosystem.config.js --env production
```

### 8. "SSH key format is invalid" Error

**সমস্যা**: GitHub Secret এ SSH Key সঠিক ফরম্যাটে নেই

**সমাধান**:

```bash
# সঠিক ফরম্যাটে SSH Key কপি করুন:
cat ~/.ssh/github-deploy

# আউটপুট দেখবে:
# -----BEGIN OPENSSH PRIVATE KEY-----
# MIIEpAIBAAKCAQEA...
# -----END OPENSSH PRIVATE KEY-----

# এটি সম্পূর্ণভাবে GitHub Secret এ কপি করুন (newlines সহ)
```

### 9. Disk Space Error

**সমস্যা**: সার্ভারে ডিস্ক স্পেস নেই

**সমাধান**:

```bash
# ডিস্ক স্পেস চেক করুন:
df -h

# পুরানো লগ ক্লিয়ার করুন:
rm -f /var/www/rfv-website/logs/*.log
pm2 flush

# node_modules পুনরায় ইনস্টল করুন:
cd /var/www/rfv-website
rm -rf node_modules
npm ci --omit=dev
```

### 10. Memory Limit Exceeded Error

**সমস্যা**: অ্যাপ মেমরি লিমিট অতিক্রম করেছে

**সমাধান**:

PM2 কনফিগ এ মেমরি লিমিট বাড়ান:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    // ...
    max_memory_restart: '2G', // ১ জি থেকে ২ জি এ বাড়ান
  }]
}
```

তারপর:
```bash
pm2 restart rfv-website
```

## 🔍 Debugging Techniques

### 1. GitHub Actions Log দেখুন

```
GitHub Repository → Actions → Latest Workflow → Expand step logs
```

### 2. সার্ভার SSH Log দেখুন

```bash
# SSH সংযোগ verbose লগ দিয়ে পরীক্ষা করুন:
ssh -vvv -i ~/.ssh/github-deploy user@server-ip

# এটি দেখাবে সংযোগের প্রতিটি ধাপ
```

### 3. PM2 Log দেখুন

```bash
# রিয়েল-টাইম লগ:
pm2 logs rfv-website

# শেষ ১০০ লাইন:
pm2 logs rfv-website --lines 100

# নির্দিষ্ট সময়ের লগ:
pm2 logs rfv-website --err
```

### 4. Nginx Access/Error Log

```bash
# ত্রুটি লগ:
sudo tail -f /var/log/nginx/error.log

# অ্যাক্সেস লগ:
sudo tail -f /var/log/nginx/access.log

# একসাথে:
sudo tail -f /var/log/nginx/*.log
```

### 5. সার্ভার System Status

```bash
# CPU এবং মেমরি:
top
# অথবা
htop

# সংযোগ অবস্থা:
netstat -tulpn | grep LISTEN

# ডিস্ক স্পেস:
df -h
du -sh /var/www/rfv-website
```

## 🛠️ ম্যানুয়াল ডিপ্লয়মেন্ট

GitHub Actions কাজ না করলে ম্যানুয়ালি ডিপ্লয় করুন:

```bash
# সার্ভারে লগইন করুন
ssh user@server-ip

# ডিপ্লয় ডিরেক্টরিতে যান
cd /var/www/rfv-website

# সর্বশেষ কোড পান
git fetch origin
git reset --hard origin/main

# Dependencies ইনস্টল করুন
npm ci --omit=dev

# Build করুন
npm run build

# Restart করুন
pm2 restart rfv-website

# স্ট্যাটাস চেক করুন
pm2 status
```

## 📊 Health Check

ডিপ্লয়মেন্টের পরে সবকিছু সঠিক কি না চেক করুন:

```bash
# 1. সার্ভারে অ্যাপ চলছে কি না
curl http://localhost:3000

# 2. Domain এ অ্যাক্সেস করা যায় কি না
curl http://your-domain.com

# 3. HTTPS কাজ করছে কি না
curl https://your-domain.com

# 4. API endpoint পরীক্ষা করুন
curl http://localhost:3000/api/admin/submissions

# 5. লগ এ কোনো ত্রুটি আছে কি না
pm2 logs --err
```

## 📝 Logs সংগ্রহ করুন

সাপোর্টের জন্য তথ্য সংগ্রহ করুন:

```bash
# GitHub Actions log - GitHub UI থেকে স্ক্রিনশট নিন

# Server info
node --version
npm --version
git --version

# PM2 status
pm2 list
pm2 logs rfv-website --lines 50 > pm2-logs.txt

# Nginx status
sudo systemctl status nginx
sudo nginx -t

# Environment check
env | grep NEXT_PUBLIC
```

## 🚨 জরুরি পরিস্থিতি

### সার্ভার ডাউন হয়েছে

```bash
# সার্ভারে SSH করুন এবং:
ps aux | grep node
pm2 list
pm2 restart rfv-website

# যদি এখনও কাজ না করে:
pm2 kill
pm2 start ecosystem.config.js --env production
pm2 save
```

### Database সিঙ্ক সমস্যা

```bash
# JSONL ফাইল চেক করুন
ls -la /var/www/rfv-website/data/

# যদি corrupted হয়েছে:
git checkout HEAD -- data/submissions.jsonl
pm2 restart rfv-website
```

## 📞 Contact for Help

যদি সমস্যার সমাধান না হয়:

1. সম্পূর্ণ error message কপি করুন
2. GitHub Actions log স্ক্রিনশট নিন
3. সার্ভার log collect করুন: `pm2 logs > server.log`
4. Issue create করুন GitHub repository তে

---

**Happy Deploying! 🚀**

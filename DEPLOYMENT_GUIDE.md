# Deployment Guide - RFV Website

## Overview
এই গাইডটি আপনার RFV Website কে GitHub থেকে লাইভ সার্ভারে স্বয়ংক্রিয়ভাবে ডিপ্লয় করার প্রক্রিয়া ব্যাখ্যা করে।

## Prerequisites (পূর্বশর্ত)

1. **GitHub Repository** - আপনার প্রজেক্ট GitHub এ আছে
2. **Linux Server** - Ubuntu 20.04+ সহ একটি সার্ভার
3. **Node.js 22+** - সার্ভারে ইনস্টল করা আছে
4. **PM2** - প্রসেস ম্যানেজার হিসেবে

## Step 1: GitHub Secrets সেটআপ

আপনার GitHub Repository এ যান এবং `Settings > Secrets and variables > Actions` এ নিম্নলিখিত Secrets যোগ করুন:

### Required Secrets (আবশ্যক):

```
DEPLOY_HOST           = আপনার সার্ভার IP Address (e.g., 123.45.67.89)
DEPLOY_USER           = SSH ইউজারনেম (e.g., ubuntu, root)
DEPLOY_KEY            = আপনার Private SSH Key (সম্পূর্ণ কন্টেন্ট)
DEPLOY_PATH           = সার্ভারে ডিপ্লয় পাথ (e.g., /var/www/rfv-website)
```

### Optional Secrets (ঐচ্ছিক - প্রোডাকশনের জন্য):

```
NEXT_PUBLIC_SITE_NAME        = আপনার সাইট নাম
NEXT_PUBLIC_WHATSAPP_NUMBER  = WhatsApp নম্বর
NEXT_PUBLIC_FACEBOOK_URL     = Facebook URL
NEXT_PUBLIC_BKASH_NUMBER     = bKash নম্বর
NEXT_PUBLIC_NAGAD_NUMBER     = Nagad নম্বর
SMTP_HOST                    = SMTP হোস্ট
SMTP_PORT                    = SMTP পোর্ট
SMTP_USER                    = SMTP ইউজারনাম
SMTP_PASS                    = SMTP পাসওয়ার্ড
SMTP_FROM                    = SMTP থেকে ইমেইল
ADMIN_EMAIL                  = Admin ইমেইল
```

## Step 2: সার্ভার সেটআপ

আপনার সার্ভারে SSH করুন এবং নিম্নলিখিত কমান্ড চালান:

### 2.1 Node.js ইনস্টল করুন

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs npm
```

### 2.2 PM2 ইনস্টল করুন

```bash
sudo npm install -g pm2
```

### 2.3 ডিপ্লয়মেন্ট ডিরেক্টরি তৈরি করুন

```bash
sudo mkdir -p /var/www/rfv-website
sudo chown $USER:$USER /var/www/rfv-website
cd /var/www/rfv-website
```

### 2.4 প্রজেক্ট ক্লোন করুন

```bash
git clone <আপনার-রিপোজিটরি-URL> .
```

### 2.5 Initial Build এবং Setup

```bash
npm ci --omit=dev
npm run build
```

### 2.6 PM2 দিয়ে অ্যাপ্লিকেশন শুরু করুন

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Step 3: SSH Key Setup

### 3.1 সার্ভারে পাবলিক কী যোগ করুন

```bash
# আপনার লোকাল মেশিনে
ssh-keygen -t ed25519 -C "github-deploy"

# সার্ভারে কপি করুন
ssh-copy-id -i ~/.ssh/github-deploy.pub user@server-ip
```

### 3.2 GitHub Secret এ প্রাইভেট কী যোগ করুন

```bash
# লোকাল মেশিনে
cat ~/.ssh/github-deploy
```

এর কন্টেন্ট কপি করে GitHub Secret `DEPLOY_KEY` এ পেস্ট করুন।

## Step 4: Nginx/Apache সেটআপ (Optional কিন্তু সুপারিশকৃত)

### Nginx সেটআপ

```bash
sudo apt-get install -y nginx
```

`/etc/nginx/sites-available/rfv-website` তে নতুন ফাইল তৈরি করুন:

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static files
    location /_next/static {
        alias /var/www/rfv-website/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /var/www/rfv-website/public;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

Enable করুন:

```bash
sudo ln -s /etc/nginx/sites-available/rfv-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL সার্টিফিকেট (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

## Step 5: GitHub Actions Workflow চেক করুন

1. GitHub Repository এ যান
2. `Actions` ট্যাবে ক্লিক করুন
3. নতুন Workflow চালু হওয়া দেখবেন

### Deploy হয় যখন:
- main, master, বা production branch এ push করা হয়
- Build successful হলে স্বয়ংক্রিয়ভাবে সার্ভারে deploy হবে

## Step 6: Monitoring এবং Logs

### PM2 Logs দেখুন

```bash
pm2 logs rfv-website
pm2 monit
```

### Nginx Logs

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Deploy ব্যর্থ হলে

1. **SSH Connection Error**: 
   - DEPLOY_KEY সঠিক কি না চেক করুন
   - Server এ পাবলিক কী যোগ করা আছে কি না চেক করুন

2. **Build Error**:
   - Server এ Node.js version চেক করুন: `node --version`
   - Dependencies আছে কি না: `npm ci --omit=dev`

3. **PM2 Error**:
   - সার্ভারে SSH করে `pm2 list` চালান
   - Logs চেক করুন: `pm2 logs`

### ম্যানুয়াল রিস্টার্ট

```bash
# সার্ভারে
cd /var/www/rfv-website
git pull origin main
npm ci --omit=dev
npm run build
pm2 restart rfv-website
```

## Environment Variables চেক করুন

```bash
# সার্ভারে .env.production তৈরি করুন
cat > /var/www/rfv-website/.env.production << EOF
NEXT_PUBLIC_SITE_NAME="Saif Academy"
NEXT_PUBLIC_WHATSAPP_NUMBER="+8801552636185"
NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/share/18M5pX1q6k/"
NEXT_PUBLIC_BKASH_NUMBER="+880 1552-636185"
NEXT_PUBLIC_NAGAD_NUMBER="+880 1552-636185"
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Saif Academy <noreply@saifacademy.example>"
ADMIN_EMAIL="admin@saifacademy.example"
NODE_ENV="production"
EOF
```

## Security Checklist

- [ ] SSH Keys সুরক্ষিত রাখুন
- [ ] GitHub Secrets কখনো commit করবেন না
- [ ] SSL/TLS সার্টিফিকেট সেটআপ করুন
- [ ] Firewall কনফিগার করুন (শুধুমাত্র প্রয়োজনীয় পোর্ট খুলুন)
- [ ] Regular backups নিন
- [ ] Monitor করুন Application logs

## সফল Deployment এর পরে

আপনার domain এ ভিজিট করুন এবং চেক করুন সবকিছু সঠিকভাবে কাজ করছে কি না।

```bash
# সার্ভারে health check করুন
curl http://localhost:3000
```

---

**Support**: কোনো সমস্যা হলে GitHub Issues এ রিপোর্ট করুন।

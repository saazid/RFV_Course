#!/bin/bash

# Deployment Setup Script for RFV Website
# এই স্ক্রিপ্ট সার্ভারে প্রাথমিক সেটআপ করে

set -e

echo "🚀 RFV Website Deployment Setup Script"
echo "=========================================="

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
   echo "❌ এই স্ক্রিপ্ট sudo দিয়ে চালাতে হবে"
   exit 1
fi

# Variables
DEPLOY_USER="${1:-ubuntu}"
DEPLOY_PATH="${2:-/var/www/rfv-website}"
DOMAIN="${3:-example.com}"

echo "📝 Configuration:"
echo "  - User: $DEPLOY_USER"
echo "  - Path: $DEPLOY_PATH"
echo "  - Domain: $DOMAIN"

# Step 1: Update system
echo ""
echo "1️⃣  Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

# Step 2: Install Node.js 22
echo ""
echo "2️⃣  Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null 2>&1
apt-get install -y -qq nodejs

# Step 3: Install PM2
echo ""
echo "3️⃣  Installing PM2..."
npm install -g pm2 >/dev/null 2>&1

# Step 4: Install Nginx
echo ""
echo "4️⃣  Installing Nginx..."
apt-get install -y -qq nginx

# Step 5: Install Certbot for SSL
echo ""
echo "5️⃣  Installing Certbot (SSL)..."
apt-get install -y -qq certbot python3-certbot-nginx

# Step 6: Create deployment directory
echo ""
echo "6️⃣  Creating deployment directory..."
mkdir -p $DEPLOY_PATH
chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH

# Step 7: Setup PM2 startup
echo ""
echo "7️⃣  Configuring PM2 startup..."
sudo -u $DEPLOY_USER pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER >/dev/null 2>&1 || true

# Step 8: Configure Nginx
echo ""
echo "8️⃣  Configuring Nginx..."
cat > /etc/nginx/sites-available/rfv-website-http << 'EOF'
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name _;
    
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
EOF

ln -sf /etc/nginx/sites-available/rfv-website-http /etc/nginx/sites-enabled/ || true
rm -f /etc/nginx/sites-enabled/default

nginx -t >/dev/null 2>&1 && systemctl restart nginx

# Step 9: Create .env.production template
echo ""
echo "9️⃣  Creating environment template..."
cat > $DEPLOY_PATH/.env.production << 'EOF'
NEXT_PUBLIC_SITE_NAME="Saif Academy"
NEXT_PUBLIC_WHATSAPP_NUMBER="+8801552636185"
NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/share/18M5pX1q6k/"
NEXT_PUBLIC_BKASH_NUMBER="+880 1552-636185"
NEXT_PUBLIC_NAGAD_NUMBER="+880 1552-636185"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Saif Academy <noreply@saifacademy.example>"
ADMIN_EMAIL=""
NODE_ENV="production"
EOF

chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH/.env.production
chmod 600 $DEPLOY_PATH/.env.production

# Step 10: Create logs directory
echo ""
echo "🔟  Setting up logging..."
mkdir -p $DEPLOY_PATH/logs
chown $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH/logs
chmod 755 $DEPLOY_PATH/logs

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Clone your repository:"
echo "   cd $DEPLOY_PATH && git clone <your-repo-url> ."
echo ""
echo "2. Edit .env.production with your values:"
echo "   nano $DEPLOY_PATH/.env.production"
echo ""
echo "3. Install dependencies and build:"
echo "   cd $DEPLOY_PATH && npm ci --omit=dev && npm run build"
echo ""
echo "4. Start with PM2:"
echo "   pm2 start ecosystem.config.js --env production"
echo ""
echo "5. Save PM2 configuration:"
echo "   pm2 save"
echo ""
echo "6. Setup SSL (Optional but recommended):"
echo "   sudo certbot certonly --nginx -d $DOMAIN"
echo ""
echo "🎉 Your server is ready for deployment!"

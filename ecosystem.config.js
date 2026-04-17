module.exports = {
  apps: [
    {
      name: "rfv-website",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time_format: "YYYY-MM-DD HH:mm:ss Z",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
  deploy: {
    production: {
      user: "ubuntu",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "your-github-repo-url",
      path: "/var/www/rfv-website",
      "post-deploy":
        "npm ci --omit=dev && npm run build && pm2 restart ecosystem.config.js --env production",
    },
  },
};

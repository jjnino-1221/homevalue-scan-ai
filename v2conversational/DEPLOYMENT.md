# Rocket Valuation V2 - Production Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the V2 Conversational AI Property Valuation interface to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Server Setup](#server-setup)
4. [Security Configuration](#security-configuration)
5. [Build Process](#build-process)
6. [Deployment Steps](#deployment-steps)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: v2.x or higher

### Required Services
- **Claude API**: Anthropic API key with Claude Sonnet 4.5 access
- **Web Server**: Apache/Nginx for static file serving
- **SSL Certificate**: Valid SSL certificate for HTTPS

### Required Access
- Production server SSH access
- DNS management access
- CDN configuration access (if applicable)

---

## Environment Configuration

### 1. Environment Files

Create a `.env.production` file (DO NOT commit to git):

```env
# API Configuration
CLAUDE_API_KEY=your_production_api_key_here
API_BASE_URL=https://api.rocketmortgage.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_VOICE=true
ENABLE_CAMERA=true
ENABLE_PHOTO_ANALYSIS=true
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true

# Security
ENFORCE_HTTPS=true
CSP_REPORT_URI=https://your-csp-report-endpoint.com

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_ID=your_analytics_id_here
```

### 2. Update config.js

The `js/config.js` file automatically detects the environment based on hostname. Verify production settings:

```javascript
production: {
  environment: 'production',
  debug: false,
  api: {
    baseUrl: 'https://api.rocketmortgage.com',
    chatEndpoint: '/api/v2/chat',
    timeout: 30000
  }
}
```

---

## Server Setup

### 1. Node.js API Server (server.js)

**Production Setup:**

```bash
# Install dependencies
cd v2conversational
npm install --production

# Install PM2 for process management
npm install -g pm2

# Start server with PM2
pm2 start server.js --name rocket-valuation-v2 --env production

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

**PM2 Configuration** (`ecosystem.config.js`):

```javascript
module.exports = {
  apps: [{
    name: 'rocket-valuation-v2',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G'
  }]
};
```

### 2. Web Server Configuration

**Nginx Configuration** (`/etc/nginx/sites-available/rocket-valuation`):

```nginx
server {
    listen 443 ssl http2;
    server_name valuation.rocketmortgage.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/rocket-valuation.crt;
    ssl_certificate_key /etc/ssl/private/rocket-valuation.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.rocketmortgage.com; media-src 'self' blob:;" always;

    # Static files
    root /var/www/rocket-valuation/v2conversational;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for streaming
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Rate limiting
    limit_req zone=api_limit burst=20 nodelay;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name valuation.rocketmortgage.com;
    return 301 https://$server_name$request_uri;
}
```

**Rate Limiting Configuration** (add to nginx.conf):

```nginx
http {
    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_status 429;
}
```

---

## Security Configuration

### 1. Content Security Policy

The CSP header is set in nginx configuration above. Key directives:

- `default-src 'self'` - Only allow resources from same origin
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` - Required for ES6 modules and inline scripts
- `connect-src 'self' https://api.rocketmortgage.com` - API connections
- `media-src 'self' blob:` - Camera/media access

### 2. HTTPS Enforcement

- All production traffic MUST use HTTPS
- HTTP requests automatically redirect to HTTPS
- HSTS header sets 1-year max-age

### 3. Input Validation

Client-side validation implemented in `js/security.js`:
- User input sanitized before processing
- File uploads validated (type, size, extensions)
- URLs validated before following

### 4. API Security

**Required Server-Side Measures:**

```javascript
// server.js - Add these security measures

// Rate limiting
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: 'https://valuation.rocketmortgage.com',
  credentials: true
}));

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Request validation
const { body, validationResult } = require('express-validator');
app.post('/api/chat',
  [
    body('messages').isArray().withMessage('Messages must be an array'),
    body('messages.*.role').isIn(['user', 'assistant']).withMessage('Invalid role'),
    body('messages.*.content').isString().isLength({ max: 2000 }).withMessage('Content too long')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  handleChatRequest
);
```

---

## Build Process

### 1. Pre-Deployment Checklist

```bash
# Run tests (if available)
npm test

# Check for security vulnerabilities
npm audit

# Verify environment configuration
node -e "console.log(require('./js/config.js').Config.getInfo())"

# Lint code
npm run lint  # if configured

# Verify all dependencies are installed
npm ci
```

### 2. Asset Optimization

```bash
# Minify JavaScript (optional - modern browsers handle ES6 well)
# Only if you have a build step configured
npm run build

# Optimize images
# Use imagemin or similar tools to compress images
```

---

## Deployment Steps

### 1. Backup Current Version

```bash
# On production server
ssh production-server
cd /var/www/rocket-valuation
cp -r v2conversational v2conversational.backup.$(date +%Y%m%d_%H%M%S)
```

### 2. Deploy New Version

**Option A: Git Deployment**

```bash
# On production server
cd /var/www/rocket-valuation/v2conversational
git fetch origin
git checkout main
git pull origin main
npm install --production
pm2 restart rocket-valuation-v2
```

**Option B: Direct Upload**

```bash
# From local machine
rsync -avz --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '*.log' \
  v2conversational/ \
  user@production-server:/var/www/rocket-valuation/v2conversational/

# On production server
cd /var/www/rocket-valuation/v2conversational
npm install --production
pm2 restart rocket-valuation-v2
```

### 3. Update Web Server Configuration

```bash
# Reload Nginx configuration
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 4. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs rocket-valuation-v2 --lines 50

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Test health endpoint
curl https://valuation.rocketmortgage.com/api/health
```

---

## Post-Deployment

### 1. Smoke Tests

**Manual Testing Checklist:**

- [ ] Homepage loads correctly
- [ ] Chat interface initializes
- [ ] User can send message
- [ ] AI responds correctly
- [ ] Interactive UI elements work (chips, sliders, etc.)
- [ ] Camera access works (if supported)
- [ ] Voice input works (if supported)
- [ ] Photo capture and upload works
- [ ] Valuation calculation completes
- [ ] Recommendations generate
- [ ] Conversation persistence works
- [ ] Resume conversation works

**Automated Health Checks:**

```bash
# API health check
curl https://valuation.rocketmortgage.com/api/health

# Expected response:
# {"status":"ok","mode":"production","timestamp":"2026-03-19T..."}
```

### 2. Monitor Initial Traffic

```bash
# Watch real-time logs
pm2 logs rocket-valuation-v2

# Monitor system resources
pm2 monit

# Check error rate
pm2 logs rocket-valuation-v2 --err --lines 100
```

### 3. Enable Monitoring

**If using Sentry:**

```javascript
// Add to js/error-tracker.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  release: 'v2.0.0'
});
```

**If using Google Analytics:**

```html
<!-- Add to index.html head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Monitoring & Maintenance

### 1. Logging

**Log Locations:**
- Application logs: `/var/log/pm2/`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- System logs: `/var/log/syslog`

**Log Rotation** (`/etc/logrotate.d/rocket-valuation`):

```
/var/www/rocket-valuation/v2conversational/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Performance Monitoring

**Key Metrics to Monitor:**

- API response time (target: < 2s)
- Error rate (target: < 1%)
- CPU usage (target: < 70%)
- Memory usage (target: < 80%)
- Active connections
- Request rate

**PM2 Monitoring:**

```bash
# Real-time monitoring
pm2 monit

# Show metrics
pm2 describe rocket-valuation-v2
```

### 3. Automated Alerts

Configure alerts for:
- Server down
- High error rate (> 5%)
- High response time (> 5s)
- Memory usage > 90%
- Disk space < 10% free

---

## Rollback Procedures

### 1. Quick Rollback

```bash
# Stop current version
pm2 stop rocket-valuation-v2

# Restore backup
cd /var/www/rocket-valuation
rm -rf v2conversational
cp -r v2conversational.backup.YYYYMMDD_HHMMSS v2conversational

# Restart
cd v2conversational
npm install --production
pm2 restart rocket-valuation-v2
```

### 2. Git Rollback

```bash
cd /var/www/rocket-valuation/v2conversational

# Find previous commit
git log --oneline -5

# Rollback to specific commit
git checkout <commit-hash>
npm install --production
pm2 restart rocket-valuation-v2
```

### 3. Verify Rollback

```bash
# Check PM2 status
pm2 status

# Test health endpoint
curl https://valuation.rocketmortgage.com/api/health

# Check logs
pm2 logs rocket-valuation-v2 --lines 50
```

---

## Troubleshooting

### Common Issues

**1. API Connection Errors**
```bash
# Check if API server is running
pm2 status rocket-valuation-v2

# Check API logs
pm2 logs rocket-valuation-v2

# Test API directly
curl http://localhost:3000/api/health
```

**2. HTTPS Certificate Issues**
```bash
# Verify certificate
sudo nginx -t

# Renew Let's Encrypt certificate
sudo certbot renew

# Reload Nginx
sudo systemctl reload nginx
```

**3. High Memory Usage**
```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart rocket-valuation-v2

# Increase memory limit if needed (in ecosystem.config.js)
max_memory_restart: '2G'
```

**4. Client-Side Errors**
```bash
# Check browser console
# View error log: localStorage.getItem('rocket_error_log')

# Check error tracker logs on server
# Errors are logged to console and external service (if configured)
```

---

## Support Contacts

- **DevOps Team**: devops@rocketmortgage.com
- **API Support**: api-support@rocketmortgage.com
- **Security Team**: security@rocketmortgage.com
- **On-Call**: [PagerDuty/On-call system]

---

## Additional Resources

- **Claude API Documentation**: https://docs.anthropic.com/claude/reference
- **RDS Design System**: [Internal documentation]
- **Nginx Documentation**: https://nginx.org/en/docs/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/

---

**Last Updated**: March 19, 2026
**Version**: 2.0.0
**Author**: Development Team

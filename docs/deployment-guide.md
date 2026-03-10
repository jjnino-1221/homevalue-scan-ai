# Deployment Guide

## Deploying to Netlify (Free)

### Prerequisites
- GitHub account with mobile-valuation repo
- Netlify account (free tier)

### Steps

**1. Authenticate GitHub push**

You need to set up GitHub authentication to push code:

```bash
# Generate new personal access token (if old one was revoked)
# Go to: https://github.com/settings/tokens/new
# Scopes needed: repo (full control of private repositories)
# Expiration: 90 days or longer

# Configure git to remember credentials
git config --global credential.helper wincred

# Push to GitHub (will prompt for token)
git push origin master
# Username: jjnino1221
# Password: [paste your token here]
```

**2. Sign up for Netlify**

- Go to https://netlify.com
- Sign up with GitHub account
- Authorize Netlify to access your repos

**3. Create new site**

- Click "Add new site" → "Import an existing project"
- Choose "GitHub"
- Find `mobile-valuation` repo
- Click to select

**4. Configure build settings**

- Branch to deploy: `master`
- Build command: (leave empty)
- Publish directory: `.` (root)
- Click "Deploy site"

**5. Get your URL**

- Netlify will assign a random URL: `https://random-name-12345.netlify.app`
- Can customize: Site settings → Domain management → Change site name
- Example: `mobile-valuation-demo.netlify.app`

**6. Test deployed site**

- Open URL in browser
- Test on mobile device
- Share URL with others

### Updating the Site

Every time you push to GitHub, Netlify automatically rebuilds:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin master

# Netlify detects push and rebuilds (takes ~30 seconds)
```

### Troubleshooting

**Issue: Push fails with "repository not found"**
- Solution: Re-authenticate with new personal access token

**Issue: Site shows 404**
- Solution: Check publish directory is set to `.` (root)

**Issue: CSS/JS not loading**
- Solution: Check file paths are relative (no leading `/`)

**Issue: Changes not appearing**
- Solution: Clear browser cache or hard refresh (Ctrl+F5)

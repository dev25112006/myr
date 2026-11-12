# 🚀 Deploy MYR — Simple Step-by-Step Guide

This guide goes in **order**. Before each command it tells you **WHERE** to run it:

| Icon | Where |
|---|---|
| 💻 **LOCAL** | Your own computer (Mac/Windows terminal) |
| 📟 **VPS** | The Hostinger server (after you SSH into it) |
| 🌐 **GITHUB** | The GitHub website (browser) |

> You will do **4 things only**:
> 1. Set up the server (VPS)
> 2. Put the app on it + make it run
> 3. Connect your domain + SSL
> 4. Connect GitHub so every push auto-deploys

---

# PART A — Set up the server

## Step 1 — Get your server ready 🌐

1. Login to **Hostinger hPanel** → **VPS**
2. If you haven't yet: **OS & Reinstall** → pick **Ubuntu 24.04**
3. On the VPS page, copy your **IP address** (looks like `123.45.67.89`) — you'll need it a lot
4. Go to **VPS → Security → Firewall** → allow ports: **22, 80, 443**
5. Set a **root password** (VPS → Settings → Reset root password)

---

## Step 2 — Log into the server 📟

On **your computer** 💻 — open Terminal (Mac) or PowerShell (Windows):

```bash
ssh root@YOUR_SERVER_IP
```

- It will ask `Are you sure you want to continue connecting?` → type **yes**
- Then type the root password you set in Step 1
- **You are now inside your server.** Every 📟 command below runs here.

> 💡 How do I know where I am? When you see `root@vps:~#` you're on the **server**.
> When you see your own computer's name, you're **LOCAL**.

---

## Step 3 — Prepare the server 📟

Copy-paste these **one at a time** on the server (📟):

```bash
adduser deploy
usermod -aG sudo deploy
```
*(Creates a safer user account. Press Enter to accept defaults, skip the extra info.)*

```bash
apt update && apt upgrade -y
```
*(Updates the server — takes 1-2 minutes.)*

```bash
apt install -y git curl wget ufw nginx ca-certificates nodejs npm
```

Now install **Node.js 22** (the project needs version 22+):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt install -y nodejs
node -v
```
✅ `node -v` should print something like `v22.x.x`. If it shows `v18` or lower, stop and tell me.

```bash
npm install -g pm2
```
*(pm2 keeps your app running 24/7 and restarts it if it crashes.)*

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```
*(Opens the firewall for website traffic. Type `y` if asked.)*

---

## Step 4 — Create the database (MongoDB) 🌐

The app **needs** a database. Easiest free option: **MongoDB Atlas**

1. Go to <https://www.mongodb.com/atlas> → sign up → create a **free M0** cluster
2. Left menu → **Database Access** → **Add New Database User** → set username + password → **Add User**
3. Left menu → **Network Access** → **Add IP Address** → choose `0.0.0.0/0` → **Confirm**
4. **Connect → Connect your application** → copy the string that looks like:

```
mongodb+srv://myuser:Mypassword123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

📋 **Save this string** — you'll paste it into a file in Step 6.

---

# PART B — Put the app on the server

## Step 5 — Download the project 📟

**Switch to the deploy user** (type this on the server 📟):

```bash
su - deploy
```

**Clone the project:**

```bash
git clone https://github.com/dev25112006/myr.git ~/myr
cd ~/myr
```

> If git asks for a password, your repo is private. Either make it public
> (GitHub → Settings → General → Danger Zone → Change visibility) or create a
> token. For now, **public repo is fine**.

---

## Step 6 — Create the settings file (`.env`) 📟

```bash
cp .env.example .env
nano .env
```

The `nano` editor opens. **Delete everything** (Ctrl+K repeatedly) and paste
this (press **Ctrl+Shift+V** to paste in terminal, or right-click):

```env
NODE_ENV=production
PORT=3001
DATA_DIR=./data
BACKUP_DIR=./data/backups

# Database — paste the string from Step 4
MONGODB_URI=mongodb+srv://myuser:Mypassword123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority

# Your real domain (change this!)
APP_ORIGIN=https://yourdomain.com
SITE_ORIGIN=https://yourdomain.com

# Admin login
ADMIN_EMAIL=you@yourdomain.com
ADMIN_PASSWORD=PutAStrongPasswordHere123

# Random secret — generate one with: openssl rand -hex 32
TOKEN_PEPPER=PASTE-OUTPUT-OF-openssl-rand-hex-32-HERE

# Turnstile off for now (turn on later with real keys)
AUTH_TURNSTILE_REQUIRED=false
VITE_AUTH_TURNSTILE_REQUIRED=false
TURNSTILE_SECRET_KEY=
VITE_TURNSTILE_SITE_KEY=

# Email off for now
EMAIL_VERIFICATION_REQUIRED=false
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
RESEND_API_KEY=
EMAIL_FROM=

# Payments off for now
PAYU_MERCHANT_KEY=
PAYU_MERCHANT_SALT=
PAYU_ENV=production
COMMERCE_TEST_MODE=false
```

**Edit these 3 lines before saving:**
- `MONGODB_URI=` → your string from Step 4
- `APP_ORIGIN=` and `SITE_ORIGIN=` → your real domain
- `TOKEN_PEPPER=` → run `openssl rand -hex 32` in a **new terminal tab**, paste result

**To generate TOKEN_PEPPER:** open a **new terminal tab** 💻 or use the VPS 📟:
```bash
openssl rand -hex 32
```
Copy the output into the file.

**Save in nano:** press `Ctrl+O` → `Enter` → then `Ctrl+X` to exit.

---

## Step 7 — Build and start the app 📟

```bash
cd ~/myr
npm ci
```
*(Installs dependencies — takes 1-3 minutes.)*

```bash
npm run build
```
*(Builds the website. Wait for `✓ built` message.)*

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
- The `pm2 startup` command prints a line starting with `sudo env PATH=...`
- **Copy that whole line, paste it, press Enter** (this makes it auto-start on reboot)

**Test it:**
```bash
curl -s http://127.0.0.1:3001/api/health
```
✅ You should see JSON output like `{"status":"ok"...}`

---

# PART C — Connect your domain

## Step 8 — Point your domain to the server 🌐

Wherever your domain is registered (Hostinger, GoDaddy, etc.):

| Type | Name | Value |
|---|---|---|
| **A** | `@` | `YOUR_SERVER_IP` |
| **A** | `www` | `YOUR_SERVER_IP` |

*(Wait 5-30 minutes for it to take effect.)*

---

## Step 9 — Tell Nginx to show your site 📟

```bash
sudo nano /etc/nginx/sites-available/myr
```

Paste this (change `yourdomain.com` to your domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10m;
    }
}
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

Then activate it:
```bash
sudo ln -s /etc/nginx/sites-available/myr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

✅ `nginx -t` must say `syntax is ok` and `test is successful`.

**Now open your domain in a browser** → the site should appear (HTTP, no lock yet).

---

## Step 10 — Add free HTTPS (padlock) 📟

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- Press **Enter** to agree
- Enter your email
- Type **Y** to redirect HTTP → HTTPS

✅ Done! Your site is now live at **https://yourdomain.com** 🔒

---

# PART D — Auto-deploy on every GitHub push 🔄

*This is the part you asked for: push to GitHub → site updates itself.*

## Step 11 — Create a deploy key 📟

On the server (still as `deploy` user):

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/deploy_key -N ""
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
```

**Now show the PRIVATE key** (this goes into GitHub):

```bash
cat ~/.ssh/deploy_key
```

📋 **Copy the entire output** (starts with `-----BEGIN OPENSSH PRIVATE KEY-----`
and ends with `-----END OPENSSH PRIVATE KEY-----`)

---

## Step 12 — Add secrets on GitHub 🌐

1. Open <https://github.com/dev25112006/myr>
2. **Settings** (top tab) → left menu → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these **4 secrets**:

| Name | Where to get the value |
|---|---|
| `VPS_HOST` | Your server IP (e.g. `123.45.67.89`) |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` |
| `VPS_SSH_KEY` | The private key you copied in Step 11 |

---

## Step 13 — Commit & push the deploy files 💻

On **your computer** (LOCAL):

```bash
cd /Users/cashify/Desktop/Akash/MYR/myr
git add .github scripts/deploy.sh ecosystem.config.cjs DEPLOY-HOSTINGER.md
git commit -m "ci: add VPS auto-deploy workflow"
git push origin main
```

---

## Step 14 — Watch it work 🌐

1. Go to <https://github.com/dev25112006/myr/actions>
2. You'll see **"Deploy to Hostinger VPS"** running — two jobs:
   - ✅ `build-check` — proves the build works
   - ✅ `deploy` — SSHes into your server and updates the site
3. Wait for green checkmarks → open your site → it's live!

**From now on:** every time you `git push origin main`, the site auto-updates. 🎉

---

# 🆘 Troubleshooting

| Problem | What to do |
|---|---|
| `ssh: Connection refused` | Firewall blocks port 22, or wrong IP |
| `Permission denied (publickey)` | Run `cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys` on VPS again |
| Actions fails on SSH | Re-check the 4 secrets in Step 12 — no extra spaces in values |
| `Set MONGODB_URI...` error | `.env` missing DB string → fix it → `pm2 reload myr --update-env` |
| Site shows 502 | App crashed → `pm2 logs myr --lines 50` to see why |
| Login/CAPTCHA broken | Keep `AUTH_TURNSTILE_REQUIRED=false` in `.env` until you have real keys |
| Actions fails on build | Fix the code error first — server is never touched (safe!) |
| Changed a `VITE_` setting | It's baked into the build → edit `.env` then push (auto-rebuilds) |

---

# 📋 Daily commands cheat sheet

```bash
# --- Log into server ---
ssh deploy@YOUR_SERVER_IP

# --- Check if app is running ---
pm2 status

# --- See logs ---
pm2 logs myr --lines 50

# --- Restart app ---
pm2 reload myr

# --- Manual deploy (same as auto) ---
cd ~/myr && bash scripts/deploy.sh

# --- Health check ---
curl -s https://yourdomain.com/api/health
```

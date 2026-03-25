# 🚀 WealthWise — GitHub + Render Deployment Guide

Deploy the **entire app** (React + Flask + MySQL) as **one single service** on Render.

---

## 📁 Project Structure (what goes to GitHub)

```
wealthwise/              ← your GitHub repo root
├── build.sh             ← Render build script (builds React + installs Python)
├── render.yaml          ← Render blueprint (auto-configures everything)
├── .gitignore
├── backend/
│   ├── app.py           ← Flask serves React build + API
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt ← includes gunicorn
│   ├── routes/
│   └── utils/
└── frontend/
    ├── package.json
    ├── public/
    └── src/
```

---

## PART 1 — Push to GitHub

### Step 1 — Create a GitHub repository

1. Go to **https://github.com** and sign in
2. Click the **＋** button (top right) → **New repository**
3. Fill in:
   - **Repository name:** `wealthwise`
   - **Visibility:** Public (required for Render free tier)
   - **Do NOT** tick "Add README" or ".gitignore" — we already have them
4. Click **Create repository**
5. Copy the repo URL shown — looks like:
   `https://github.com/YOUR_USERNAME/wealthwise.git`

---

### Step 2 — Push your code

Open a terminal, go into the `wealthwise` folder, then run:

```bash
# Navigate to the project folder
cd path/to/wealthwise

# Initialise Git
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Initial commit — WealthWise full-stack app"

# Connect to your GitHub repo (paste YOUR repo URL here)
git remote add origin https://github.com/YOUR_USERNAME/wealthwise.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## PART 2 — Deploy on Render

### Step 3 — Create a Render account

1. Go to **https://render.com** and sign up (free)
2. Click **"Sign up with GitHub"** — this links your GitHub automatically

---

### Step 4 — Deploy using Blueprint (render.yaml) — RECOMMENDED

This is the easiest method — one click deploys everything.

1. In Render dashboard, click **New** → **Blueprint**
2. Select your **wealthwise** GitHub repository
3. Render reads `render.yaml` and shows you the plan:
   - ✅ **1 Web Service** (Flask + React)
   - ✅ **1 MySQL Database**
4. Click **Apply** — Render does everything automatically!
5. Wait ~5 minutes for the build to finish

---

### Step 4 (Alternative) — Manual setup if Blueprint doesn't work

**A. Create the MySQL Database first:**

1. Render dashboard → **New** → **MySQL**
2. Settings:
   - Name: `wealthwise-db`
   - Database name: `wealthwise_db`
   - Plan: **Free**
   - Region: **Singapore**
3. Click **Create Database**
4. Wait for it to start, then copy the **Internal Connection String**

**B. Create the Web Service:**

1. Render dashboard → **New** → **Web Service**
2. Connect your `wealthwise` GitHub repo
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| **Name** | `wealthwise` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Runtime** | Python 3 |
| **Build Command** | `./build.sh` |
| **Start Command** | `cd backend && gunicorn "app:create_app()" --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
| **Plan** | Free |

4. Scroll down to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(paste the Internal Connection String from your MySQL database)* |
| `SECRET_KEY` | *(click "Generate" button)* |
| `JWT_SECRET_KEY` | *(click "Generate" button)* |

5. Click **Create Web Service**

---

### Step 5 — Watch the build

Render will now:
1. Pull your code from GitHub
2. Run `build.sh` which:
   - Runs `npm install && npm run build` (builds React → `frontend/build/`)
   - Runs `pip install -r requirements.txt`
3. Start Flask with gunicorn
4. Flask serves both the API (`/api/*`) and the React app (all other routes)

You'll see live logs. Look for:
```
✓ React build complete
✓ Python packages installed
[gunicorn] Listening at: http://0.0.0.0:10000
```

---

### Step 6 — Your app is live! 🎉

Render gives you a URL like:
```
https://wealthwise.onrender.com
```

Visit it — register, add transactions, check your dashboard!

---

## 🔄 Future Updates

Every time you push to GitHub, Render auto-deploys:

```bash
# Make your changes, then:
git add .
git commit -m "✨ Add new feature"
git push origin main
# Render auto-detects the push and redeploys!
```

---

## ❓ Troubleshooting

**Build fails at npm install?**
→ Check Node version. Add env var: `NODE_VERSION = 18.17.0`

**"Can't connect to MySQL"?**
→ Make sure `DATABASE_URL` is set to the **Internal** connection string (not External)

**"Module not found" errors?**
→ Run `git add . && git commit -m "fix" && git push` to make sure all files are pushed

**App loads but API returns 500?**
→ Check Render logs. Usually means DATABASE_URL is wrong or DB isn't ready yet

**React pages show blank?**
→ Make sure `build.sh` has execute permission: `git update-index --chmod=+x build.sh && git push`

---

## 🔑 Summary of Commands

```bash
# First time — push to GitHub
git init
git add .
git commit -m "🚀 Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wealthwise.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "your message"
git push
```

That's it! One repo → one Render service → full-stack app live! 🎊

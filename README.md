# 💎 WealthWise — Personal Finance Intelligence Platform

> **Smart Finance, Smarter You** — A full-stack personal finance management platform built with React, Python Flask, and MySQL.

---

## 🌟 Live Demo & Features

| Feature | Description |
|--------|-------------|
| 🔐 Authentication | JWT-based secure login & registration with bcrypt hashing |
| 💸 Transactions | Add, edit, delete income & expenses with categories |
| 📊 Dashboard | Real-time analytics with 6-month trend charts |
| 🎯 Budgets | Set per-category budgets with smart alert thresholds |
| 📅 Reports | Day-by-day monthly financial breakdowns |
| 📈 Analytics | AreaCharts, PieCharts, BarCharts with Recharts |
| 🏠 Public Pages | Home, About, Contact Us pages |
| 🌍 Multi-currency | INR, USD, EUR, GBP, SGD, AED support |

---

## 🛠 Tech Stack

### Frontend
- **React.js 18** — Component-based UI
- **React Router v6** — Client-side navigation
- **Recharts** — Interactive charts & data visualization
- **Axios** — HTTP client with JWT interceptors
- **React Hot Toast** — Beautiful notifications
- **CSS3 Variables** — Consistent dark theme design system

### Backend
- **Python 3.10+** — Core language
- **Flask 3.0** — Lightweight web framework
- **Flask-JWT-Extended** — JWT authentication
- **Flask-SQLAlchemy** — ORM for database access
- **Flask-CORS** — Cross-origin resource sharing
- **Werkzeug** — Password hashing

### Database
- **MySQL 8.0** — Relational database
- **PyMySQL** — Python MySQL driver
- **SQLAlchemy** — ORM with auto-migration

---

## 📁 Project Structure

```
wealthwise/
├── backend/
│   ├── app.py               # Flask application factory
│   ├── config.py            # Configuration (JWT, DB)
│   ├── database.py          # SQLAlchemy db instance
│   ├── models.py            # User, Transaction, Category, Budget
│   ├── requirements.txt     # Python dependencies
│   ├── routes/
│   │   ├── auth.py          # Register, Login, Profile
│   │   ├── transactions.py  # CRUD for transactions
│   │   ├── analytics.py     # Dashboard & monthly reports
│   │   ├── budgets.py       # Budget management
│   │   └── categories.py    # Expense/income categories
│   └── utils/
│       └── seed.py          # Default categories seeder
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Routes & auth guards
│   │   ├── index.css        # Global design system
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   ├── api.js       # Axios instance + interceptors
│   │   │   └── format.js    # Currency & date formatters
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── PublicNav.js
│   │   │   └── TransactionModal.js
│   │   └── pages/
│   │       ├── HomePage.js
│   │       ├── AboutPage.js
│   │       ├── ContactPage.js
│   │       ├── LoginPage.js
│   │       ├── RegisterPage.js
│   │       ├── DashboardPage.js
│   │       ├── TransactionsPage.js
│   │       ├── AnalyticsPage.js
│   │       ├── BudgetsPage.js
│   │       ├── ReportsPage.js
│   │       └── ProfilePage.js
│
└── database_setup.sql       # MySQL initialization script
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0
- npm or yarn

---

### Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run setup script
source /path/to/wealthwise/database_setup.sql
```

Or manually:
```sql
CREATE DATABASE wealthwise_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Backend Setup

```bash
cd wealthwise/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure database connection** in `config.py`:
```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:YOUR_PASSWORD@localhost/wealthwise_db'
```

Or use environment variable:
```bash
export DATABASE_URL="mysql+pymysql://root:YOUR_PASSWORD@localhost/wealthwise_db"
export SECRET_KEY="your-super-secret-key"
export JWT_SECRET_KEY="your-jwt-secret-key"
```

**Start the Flask server:**
```bash
python app.py
# Runs on http://localhost:5000
# Tables auto-created, categories auto-seeded on first run ✅
```

---

### Step 3: Frontend Setup

```bash
cd wealthwise/frontend

# Install dependencies
npm install

# Start development server
npm start
# Runs on http://localhost:3000
# Proxy configured to forward /api requests to Flask on :5000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update` | Update profile/password |
| POST | `/api/auth/refresh` | Refresh access token |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/` | List with filters & pagination |
| POST | `/api/transactions/` | Add transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard summary & charts |
| GET | `/api/analytics/monthly-report` | Full monthly breakdown |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets/` | Get budgets with spent amounts |
| POST | `/api/budgets/` | Create/update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |

---

## 📞 Contact Information

| | |
|---|---|
| **Email** | ggvignesh15@gmail.com |
| **Phone** | +91 9182548143 |
| **Location** |Visakhapatnam, Andhra Pradesh, India |

---

## 🎨 Design System

WealthWise uses a sophisticated dark theme built with CSS custom properties:

- **Primary Background**: `#080c14` — deep space dark
- **Card Background**: `#141c2e` — slightly elevated
- **Accent Gold**: `#f0b429` — primary brand color
- **Success Green**: `#34d399` — income indicators
- **Danger Red**: `#f87171` — expense indicators
- **Info Blue**: `#60a5fa` — supplementary data
- **Typography**: Syne (display) + DM Sans (body)

---

## 🏗 Production Build

```bash
# Build React app
cd frontend
npm run build

# Serve with Flask (add to app.py for production)
# Or deploy frontend to Vercel/Netlify
# Deploy backend to Render/Railway/Heroku
```

---

## 🔐 Security Features

- JWT Access tokens (24h expiry) + Refresh tokens (30 days)
- Bcrypt password hashing via Werkzeug
- SQL injection prevention via SQLAlchemy ORM
- CORS protection with Flask-CORS
- User data isolation (all queries filter by user_id)

---

## 📊 Default Categories

**Income (5):** Salary, Freelance, Investment, Business, Other Income

**Expense (13):** Food & Dining, Transportation, Shopping, Entertainment, Healthcare, Education, Utilities, Rent/EMI, Travel, Groceries, Subscriptions, Insurance, Other Expense

---

*Built with ❤️ by Gouri Vignesh Gembali | WealthWise Finance Intelligence Platform*

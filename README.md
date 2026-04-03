```markdown
# 📊 Finance Dashboard Backend API

**An enterprise-grade, secure RESTful API** built with Node.js, Express, and MongoDB.
This backend powers a modern financial dashboard with secure OTP-based onboarding, robust Role-Based Access Control (RBAC), JWT authentication, and high-performance MongoDB aggregation pipelines for real-time analytics.

---

## ✨ Key Features

- 🔐 **Provisional User Onboarding**  
  OTP-based email verification with MongoDB TTL index (auto-deletes unverified users in 10 minutes)

- 🛡️ **Advanced Security**  
  - JWT Authentication (Access + Refresh Tokens)  
  - HttpOnly cookies (XSS protection)  
  - Rate limiting & brute-force protection  
  - Helmet secure headers  
  - MongoDB sanitization (NoSQL injection protection)

- 👥 **Role-Based Access Control (RBAC)**  
  Roles: `viewer`, `analyst`, `admin`

- 📈 **High-Performance Analytics**  
  Real-time dashboard using MongoDB Aggregation Pipelines:
  - Income/Expense summary
  - Category-wise totals
  - Monthly trends
  - Recent activity

- 📱 **Multi-device Session Management**  
  Maximum 2 active sessions per user + refresh token rotation + secure per-device logout

---

## 🛠 Tech Stack

- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: MongoDB + Mongoose  
- **Auth**: JWT + bcryptjs  
- **Email/OTP**: Nodemailer + otp-generator  
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize, CORS, express-validator  

---

## 🚀 Setup Process

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or MongoDB Atlas)

### 2. Installation

```bash
git clone <your-repo-url>
cd backend
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/Finance_Data_Backend

# JWT
JWT_ACCESS_SECRET=your_strong_access_secret_key
JWT_REFRESH_SECRET=your_strong_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 4. Run the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:9000`

---

## 📡 API Reference

### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint          | Description                        | Access   |
|--------|-------------------|------------------------------------|----------|
| POST   | `/register`       | Register + send OTP                | Public   |
| POST   | `/verify-otp`     | Verify OTP and activate account    | Public   |
| POST   | `/login`          | Login user                         | Public   |
| POST   | `/logout`         | Logout current session             | Private  |
| GET    | `/refresh`        | Refresh access token               | Private  |

### 👤 Users (`/api/v1/users`)

| Method | Endpoint          | Description                        | Access      |
|--------|-------------------|------------------------------------|-------------|
| GET    | `/profile`        | Get current user profile           | All Roles   |
| PUT    | `/profile`        | Update profile                     | All Roles   |
| PUT    | `/change-password`| Change password                    | All Roles   |
| GET    | `/`               | Get all users (paginated)          | Admin only  |
| PUT    | `/:id/role`       | Update user role                   | Admin only  |
| PUT    | `/:id/status`     | Activate/Deactivate user           | Admin only  |

### 💰 Financial Records (`/api/v1/records`)

| Method | Endpoint     | Description                  | Access          |
|--------|--------------|------------------------------|-----------------|
| GET    | `/`          | Get records + filters        | All Roles       |
| POST   | `/`          | Create new record            | Analyst, Admin  |
| PUT    | `/:id`       | Update record                | Admin only      |
| DELETE | `/:id`       | Soft delete record           | Admin only      |

**Query Parameters (GET /records)**

| Param   | Type     | Description                  |
|---------|----------|------------------------------|
| type    | string   | `income` or `expense`        |
| category| string   | Filter by category           |
| from    | date     | Start date (YYYY-MM-DD)      |
| to      | date     | End date (YYYY-MM-DD)        |
| page    | number   | Page number                  |
| limit   | number   | Records per page             |

### 📊 Dashboard (`/api/v1/dashboard`)

| Method | Endpoint            | Description                     | Access          |
|--------|---------------------|---------------------------------|-----------------|
| GET    | `/summary`          | Total income, expense & balance | Analyst, Admin  |
| GET    | `/category-totals`  | Category-wise totals            | Analyst, Admin  |
| GET    | `/monthly-trends`   | Monthly analytics               | Analyst, Admin  |
| GET    | `/recent-activity`  | Latest transactions             | Analyst, Admin  |

---

### 🔐 Protected Routes Headers

```http
Authorization: Bearer <accessToken>
```

### 🍪 Cookies

| Name | Type     | Description                          |
|------|----------|--------------------------------------|
| jwt  | HttpOnly | Stores refresh token (secure)        |

---

### ❗ Common Error Responses

| Status | Message                     |
|--------|-----------------------------|
| 401    | Unauthorized / Token missing|
| 403    | Forbidden (insufficient role)|
| 404    | Resource not found          |
| 422    | Validation error            |
| 429    | Too many requests           |
| 500    | Internal server error       |

---

## 🔄 Authentication Flow

1. **Register** → OTP sent to email  
2. **Verify OTP** → Account activated  
3. **Login** → Returns `accessToken` (body) + `refreshToken` (HttpOnly cookie)  
4. **Access protected routes** → Use `Authorization: Bearer <accessToken>`  
5. **Token expires** → Call `/refresh` (uses cookie) → New tokens issued  
6. **Logout** → Clears cookie + removes refresh token from DB

---

## 🧠 Architecture Decisions

- **MongoDB Aggregation Pipelines** instead of application-level logic → better performance & scalability  
- **JWT + Refresh Token Rotation** → stateless, secure, and horizontally scalable  
- **MongoDB TTL Index** for OTP expiry → automatic cleanup without cron jobs  
- **Short-lived access tokens (15m)** + long-lived refresh tokens (7d)

---

## ⚡ Security Features

- HttpOnly + Secure cookies  
- Refresh token rotation (prevents replay attacks)  
- Rate limiting  
- Helmet security headers  
- MongoDB query sanitization  
- Input validation with express-validator  
- Soft delete for records  

---

## 📌 Assumptions

- Frontend is a separate SPA (React / Next.js / Vue)  
- Currency formatting is handled on the frontend  
- Email verification is **mandatory** before login  
- Backend is completely stateless  

---

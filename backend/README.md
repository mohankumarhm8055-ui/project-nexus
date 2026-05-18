# Nexus Intellect — Enterprise Backend API

> AI-powered Academic Operating System for Colleges and Universities  
> Node.js + Express + MongoDB + Redis + Socket.IO

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Redis (optional — auto-falls back to in-memory mock)

### Installation

```bash
cd backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

### Seed Database (Dev)

```bash
npm run seed
```

**Default credentials (password: `Nexus@123`):**

| Role        | Email                        | Identifier  |
|-------------|------------------------------|-------------|
| Admin       | admin@nexus.edu              | ADM001      |
| HOD         | hod.cse@nexus.edu            | HOD001      |
| Faculty     | priya.nair@nexus.edu         | FAC001      |
| Student     | arjun.sharma@nexus.edu       | CS21B047    |
| Parent      | suresh.sharma@gmail.com      | —           |
| Placement   | placement@nexus.edu          | PLC001      |

### Run Development Server

```bash
npm run dev
```

API available at: `http://localhost:5000/api/v1`  
Health check: `http://localhost:5000/api/v1/health`

---

## 📁 Architecture

```
backend/
├── src/
│   ├── ai-engine/        ← Risk predictor, attendance analyzer, performance advisor
│   ├── config/           ← DB, Redis, Logger
│   ├── constants/        ← Roles, status codes, messages
│   ├── controllers/      ← 13 controllers (one per module)
│   ├── database/seeders/ ← Dev seed data
│   ├── helpers/          ← Grade calc, attendance calc, risk scoring
│   ├── jobs/             ← Background job processors
│   ├── middlewares/      ← Auth, RBAC, validate, audit, error, rate limit
│   ├── models/           ← 12 Mongoose schemas
│   ├── notifications/    ← Email, SMS, WhatsApp, Push senders
│   ├── routes/           ← 15 route files + aggregator
│   ├── schedulers/       ← Daily + weekly cron jobs
│   ├── services/         ← Business logic layer
│   ├── utils/            ← ApiResponse, ApiError, asyncHandler, pagination
│   ├── validations/      ← Joi schemas
│   └── app.js            ← Express app
├── server.js             ← Entry point (HTTP + Socket.IO)
├── .env
└── package.json
```

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <access_token>
```

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days (rotated on use)
- **Max sessions**: 5 devices per user

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "arjun.sharma@nexus.edu", "password": "Nexus@123" }
# OR login by USN:
{ "identifier": "CS21B047", "password": "Nexus@123" }
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (email or USN/EmployeeID) |
| POST | `/auth/register` | Register new user |
| POST | `/auth/refresh-token` | Rotate refresh token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Attendance
| Method | Endpoint | Roles |
|--------|----------|-------|
| POST | `/attendance/mark` | Faculty, HOD, Admin |
| GET | `/attendance/student/:id` | All |
| GET | `/attendance/student/:id/heatmap` | All |
| GET | `/attendance/department` | Faculty, HOD, Admin |
| GET | `/attendance/low-risk` | HOD, Admin |

### Marks
| Method | Endpoint | Roles |
|--------|----------|-------|
| POST | `/marks/upload` | Faculty, HOD, Admin |
| GET | `/marks/student/:id` | All |
| POST | `/marks/publish` | Faculty, HOD, Admin |
| GET | `/marks/grade-report/:id` | All |

### HOD
| Method | Endpoint |
|--------|----------|
| GET | `/hod/dashboard` |
| GET | `/hod/weak-students` |
| GET | `/hod/faculty-status` |
| GET | `/hod/analytics` |
| POST | `/hod/trigger-ai` |

### AI Analytics
| Method | Endpoint |
|--------|----------|
| GET | `/ai/student/:id/risk` |
| GET | `/ai/student/:id/recommendations` |
| GET | `/ai/department/trends` |
| POST | `/ai/analyze` |

### Reports (file downloads)
| Method | Endpoint | Output |
|--------|----------|--------|
| GET | `/reports/student/:id` | PDF |
| GET | `/reports/department` | Excel |

---

## 🧠 AI Risk Engine

The rule-based AI engine scores each student 0–100:

| Factor | Weight |
|--------|--------|
| Overall attendance < 75% | 30 pts |
| Subject attendance < 75% | 15 pts |
| Internal marks avg < 50% | 25 pts |
| Consecutive absences > 3 | 15 pts |
| Declining performance trend | 10 pts |
| Failed subjects | 5 pts |

**Risk Levels:**  
`Low (0–29)` → `Medium (30–49)` → `High (50–69)` → `Critical (70–100)`

---

## 🔔 Notification Channels

| Channel | Config | DRY_RUN |
|---------|--------|---------|
| Email | SMTP_* vars | `NOTIFICATION_DRY_RUN=true` |
| SMS | TWILIO_* vars | `NOTIFICATION_DRY_RUN=true` |
| WhatsApp | TWILIO_WHATSAPP_* | `NOTIFICATION_DRY_RUN=true` |
| In-App / Push | Socket.IO | Always active |

---

## ⏰ Schedulers

| Job | Schedule | Action |
|-----|----------|--------|
| Daily Attendance Alert | 6 PM IST (Mon–Sat) | Notify parents of absent students |
| Weekly Reports | Sunday 11 PM IST | Generate dept reports + AI analysis |

---

## 🛡️ Security

- Helmet (11 security headers)
- CORS (whitelist only)
- JWT + Refresh token rotation
- bcrypt (12 rounds)
- Rate limiting (100/15min general, 10/15min auth)
- MongoDB sanitization (prevents injection)
- XSS prevention
- Audit logging with TTL (90 days)

---

## 📊 Response Format

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Students fetched successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98,
    "itemsPerPage": 20,
    "hasNextPage": true
  }
}
```

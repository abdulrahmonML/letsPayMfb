# 💸 LetsPay MFB API

A REST API for a fictional microfinance bank built with Node.js, Express, and MongoDB. Integrates with the NIBSS by Phoenix API for identity management, account creation, and interbank fund transfers.

---

## 🚀 Features

- **User Registration** — Automatic NIN generation, NIBSS identity registration, and bank account creation in one flow
- **Authentication** — JWT-based login with bcrypt password hashing
- **Fund Transfers** — Interbank transfers with idempotency protection, duplicate detection, and balance reconciliation
- **Transaction Management** — Full transaction history with pagination, filtering, and NIBSS status reconciliation
- **Account Management** — Real-time balance reconciliation with NIBSS on every account query
- **Validation** — Joi schema validation on all request bodies and query parameters
- **Global Error Handling** — Centralised error handling with consistent response format

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Validation | Joi |
| HTTP Client | Axios |
| External API | NIBSS by Phoenix |
| Environment | dotenv |

---

## 📁 Project Structure

```
├── src
│   ├── config
│   │   ├── db.js                  # MongoDB connection
│   │   └── nibss.js               # NIBSS axios instance
│   ├── controllers
│   │   ├── authController.js
│   │   ├── accountController.js
│   │   └── transactionController.js
│   ├── middleware
│   │   ├── protect.js             # JWT verification
│   │   ├── validate.js            # Joi validation middleware
│   │   └── errorHandler.js        # Global error handler
│   ├── models
│   │   ├── user.js
│   │   ├── account.js
│   │   ├── transaction.js
│   │   └── nin.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   └── transactionRoutes.js
│   ├── services
│   │   ├── authService.js
│   │   ├── accountService.js
│   │   ├── transactionService.js
│   │   └── nibssService.js        # All NIBSS API calls
│   ├── utils
│   │   ├── nibssAuth.js           # NIBSS token management
│   │   ├── generateNin.js         # NIN generation logic
│   │   ├── generateReference.js   # Transaction reference generator
│   │   └── appError.js            # Custom error class
│   └── validators
│       ├── authValidator.js
│       └── transactionValidator.js
├── postman
│   └── letspay-mfb-api.json       # Postman collection
├── scripts
│   └── onboard.js                 # One-time fintech onboarding script
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- A registered fintech on [NIBSS by Phoenix](https://nibssbyphoenix.onrender.com) — run the onboarding script to get your `apiKey` and `apiSecret`

---

### 1. Clone the repository

```bash
git clone https://github.com/abdulrahmonML/letsPayMfb.git
cd letsPayMfb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your values:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/letspay

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# NIBSS
NIBSS_BASE_URL=https://nibssbyphoenix.onrender.com
NIBSS_API_KEY=your_nibss_api_key
NIBSS_API_SECRET=your_nibss_api_secret

# Fintech Details
FINTECH_NAME=LetsPay MFB
ONBOARD_NAME=LetsPay MFB
ONBOARD_EMAIL=your_email@example.com
```

### 4. Onboard your fintech on NIBSS (first time only)

```bash
node scripts/onboard.js
```

Copy the returned `apiKey` and `apiSecret` into your `.env` file.

### 5. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

Server starts on `http://localhost:3000`

---

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

Obtain the token by calling the **Login** endpoint.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |

### Account
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/account` | Authenticated | Get account details |
| GET | `/api/account/balance` | Authenticated | Get account balance |

### Transactions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/transactions/transfer` | Authenticated | Initiate a fund transfer |
| GET | `/api/transactions` | Authenticated | Get transaction history |
| GET | `/api/transactions/:ref` | Authenticated | Get transaction by reference |

---

## 🔍 Query Parameters

### Transaction History
| Parameter | Type | Description |
|---|---|---|
| `status` | String | Filter by `PENDING`, `SUCCESS`, or `FAILED` |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Results per page (default: 10, max: 100) |

**Examples:**
```
GET /api/transactions?status=SUCCESS
GET /api/transactions?page=2&limit=5
GET /api/transactions?status=FAILED&page=1&limit=10
```

---

## 🔄 Registration Flow

```
User submits details
        ↓
System generates unique 11-digit NIN
        ↓
NIN registered with NIBSS identity store
        ↓
Bank account created on NIBSS platform
        ↓
User, NIN, and Account records saved to database
        ↓
JWT token returned
```

---

## 💸 Transfer Flow

```
User initiates transfer
        ↓
Recipient verified via NIBSS name enquiry
        ↓
Idempotency check — prevent duplicate transfers within 30 mins
        ↓
Balance reconciled with NIBSS
        ↓
Sufficient funds check
        ↓
Transaction record created — status: PENDING
        ↓
NIBSS transfer executed
        ↓
Transaction status updated — SUCCESS or FAILED
        ↓
Sender balance updated
```

---

## ⚠️ Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```

Common status codes:
- `400` — Bad request / Validation error / Insufficient funds
- `401` — Unauthorized / Token missing or invalid
- `404` — Resource not found
- `409` — Duplicate transfer detected
- `500` — Internal server error

---

## 📮 Postman Collection

A complete Postman collection is included in the `/postman` directory.

**To import:**
1. Open Postman
2. Click **Import**
3. Select `postman/letspay-mfb-api.json`
4. Create an environment with `baseUrl` set to `http://localhost:3000`
5. Run **Login** first — token is automatically saved to your environment

---

## 👨‍💻 Author

**Abdulrahmon** — [GitHub](https://github.com/abdulrahmonML/letsPayMfb)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

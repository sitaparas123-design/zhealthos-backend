# ZHealth OS Backend (Node.js + Express + Prisma + MySQL)

Production-ready backend for ZHealth Clinic Management Software.

## Technical Stack
- **Node.js** & **Express.js**
- **Prisma ORM**
- **MySQL** Database (`zhealthos_db`)
- **JWT** Authentication & Refresh Tokens
- Role-Based Access Control (RBAC)

## Software Dashboard Roles
1. `SUPER_ADMIN`
2. `CLINIC_ADMIN`
3. `PRACTITIONER`
4. `SALES_EXECUTIVE`
5. `PATIENT`

## Setup & Running Locally

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database in `.env`
Ensure MySQL (XAMPP/Local) is running and database `zhealthos_db` is created:
```env
DATABASE_URL="mysql://root:@localhost:3306/zhealthos_db"
```

### 3. Run Prisma Migrations & Seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Modules & Routes

- **Health Check**: `GET /api/health`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`, `POST /api/auth/logout`
- **Super Admin**: `GET /api/super-admin/clinics`, `GET /api/super-admin/subscriptions`, `GET /api/super-admin/audit-logs`
- **Clinic Admin**: `GET/POST/PUT/DELETE /api/clinic-admin/branches`, `GET/POST/PUT/DELETE /api/clinic-admin/practitioners`, `GET/POST /api/clinic-admin/invoices`
- **Practitioner**: `GET/POST/PUT/DELETE /api/practitioner/appointments`, `GET/POST/DELETE /api/practitioner/waitlist`, `GET/POST/PUT /api/practitioner/patients`
- **Sales Executive**: `GET/POST /api/sales/leads`, `PATCH /api/sales/leads/:id/status`
- **Patient Portal**: `GET /api/patient/profile`, `GET /api/patient/appointments`, `GET /api/patient/invoices`

## Deployment to Railway
1. Push `backend/` repository to GitHub.
2. Link repository to Railway.
3. Provision MySQL database plugin in Railway and set `DATABASE_URL` environment variable.
4. Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in Railway dashboard.
5. Build command: `npx prisma generate && npx prisma migrate deploy`
6. Start command: `node src/server.js`

# HireSmart Backend

A simplified job platform backend built with **NestJS**, **PostgreSQL**, and **Redis**, designed to match job seekers with employers efficiently.

---

## Features

- User authentication with JWT
- Role-based access control
- Job posts and applications
- Admin metrics dashboard
- Background job matching
- Rate limiting and security best practices
- Redis caching
- Dockerized with PostgreSQL, Redis, and pgAdmin

---

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Caching / Queue:** Redis + Bull
- **Security:** Helmet, Throttler, Class-Validator
- **Containerization:** Docker & Docker Compose

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/sakib57/hire-smart
cd hire-smart
```

### 2. Create `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/hiresmart
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret
```

### 3. Run with Docker

```bash
docker-compose up --build
```

### 4. Access Services

- NestJS: [http://localhost:8080](http://localhost:8080)
- pgAdmin: [http://localhost:5050](http://localhost:5050)
  - Email: `admin@hiresmart.dev`
  - Password: `admin123`

---

## Testing the API

Use Postman or Swagger (if enabled) to interact with endpoints like:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /jobs`
- `POST /applications`
- `GET /admin/metrics`

---

## Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Generate DB
npx prisma generate

# Push DB
npx prisma db push

```

---

## Security Practices

- SQL Injection safe (Prisma)
- Rate Limiting via `@nestjs/throttler`
- Helmet headers enabled
- DTO validation with `class-validator`

---

## Background Jobs

- Job matching via Bull queue (every hour)
- Archive old jobs (older than 30 days)
- Remove unverified users (weekly)

---

## Health Checks

- App: `GET /health`
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`

---

## Future Enhancements

- Email/FCM Notifications
- Admin dashboard UI
- Candidate-job ranking system
- Full-text job search

---

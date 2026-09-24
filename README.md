# EventFlow

Production-style full-stack Event Registration & Management Platform for academic DevOps/DevSecOps work.

## Roles
- PARTICIPANT — event discovery, registration, QR pass, notifications, feedback.
- EVENT_COMMITTEE — assigned-event operations, registrations, attendance, announcements and feedback.
- ADMIN — platform management, analytics, audit logs and **DevOps only**.

The `/admin`, `/committee`, and `/participant` layouts perform server-side role checks. API handlers repeat authorization and ownership checks. A non-admin cannot access `/admin/devops`, even by manually entering the URL.

## Stack
Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma, JWT session cookies, Zod, Recharts, QRCode, Docker, Jenkins, Selenium and Ansible.

## Run locally
1. Copy `.env.example` to `.env` and set a strong `AUTH_SECRET`.
2. `npm install`
3. `docker compose up -d db`
4. `npm run db:push`
5. `npm run db:seed`
6. `npm run dev`

Or run the complete stack with `docker compose up --build`.

## Demo accounts
- participant@eventflow.demo / EventFlow@123
- committee@eventflow.demo / EventFlow@123
- admin@eventflow.demo / EventFlow@123

## DevSecOps
Jenkins stages: Checkout → Install → Build → Unit Tests → Selenium Tests → Security Validation → Docker Build → Docker Test → Ansible Deployment.

Secrets belong in environment variables / Jenkins credentials. Never commit `.env` or credentials.

## Project structure
`app/` UI + API routes · `lib/` auth/RBAC/database helpers · `prisma/` schema + seed · `tests/` unit/Selenium · `ansible/` deployment · `Dockerfile` / `docker-compose.yml` / `Jenkinsfile`.

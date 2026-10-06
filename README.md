# EventFlow

EventFlow is a full-stack Event Registration & Management platform built with Next.js, TypeScript and PostgreSQL. The application has separate Participant, Event Conductor and Admin workspaces, server-side authentication/authorization, persistent registration data, and an Admin-only DevSecOps area.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Lucide icons + reusable UI components
- PostgreSQL 16
- Prisma ORM
- bcrypt password hashing
- JWT-based HttpOnly session cookies
- Zod validation
- Recharts for analytics-ready UI
- Docker / Docker Compose
- Jenkins / Selenium / Ansible configuration

## Roles

**Participant**
- Create account and log in
- Browse and search events
- Register for events
- View and cancel eligible registrations
- Access only participant routes

**Event Conductor**
- Log in with an account provisioned by an Admin
- See only assigned events
- Manage assigned-event registrations
- Access attendance workspace
- Cannot access Admin or DevOps

**Admin**
- Log in with an account provisioned by an Admin/bootstrap configuration
- Manage events and platform users
- Review registrations
- Access the Admin-only DevSecOps dashboard

## PostgreSQL setup

1. Copy `.env.example` to `.env`.
2. Set a strong `AUTH_SECRET`.
3. For first-run Admin/Conductor access, optionally set:
   - `BOOTSTRAP_ADMIN_EMAIL`
   - `BOOTSTRAP_ADMIN_PASSWORD`
   - `BOOTSTRAP_ADMIN_NAME`
   - `BOOTSTRAP_CONDUCTOR_EMAIL`
   - `BOOTSTRAP_CONDUCTOR_PASSWORD`
   - `BOOTSTRAP_CONDUCTOR_NAME`
4. Start PostgreSQL:

```bash
docker compose up -d db
```

5. Generate Prisma Client and sync the schema:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

6. Start EventFlow:

```bash
npm run dev
```

Open `http://localhost:3000`.

The seed keeps the EventFlow event catalogue but intentionally does **not** create fake participant accounts, registrations, attendance, notifications, or successful pipeline runs.

## Full Docker stack

Set your bootstrap credentials in `.env`, then:

```bash
docker compose up --build
```

PostgreSQL runs as `db` and the application uses the internal service URL.

## Database model

The Prisma schema contains persistent models for:

- User
- Event
- EventConductor
- Registration
- Attendance
- Notification
- Announcement
- Feedback
- AuditLog
- PipelineRun
- PipelineStage

## Authentication and security

- Passwords are hashed with bcrypt.
- Sessions use an HttpOnly JWT cookie.
- Middleware requires a session for protected routes.
- Server-side layouts enforce Admin and Event Conductor roles.
- API routes repeat role and ownership checks.
- Participant registrations are unique per event/participant.
- Secrets and passwords are kept out of frontend code.

## DevSecOps

The Admin-only page is:

```text
/admin/devops
```

The pipeline is prepared for:

```text
GitHub
  ↓
Jenkins
  ↓
Install / Build
  ↓
Unit Tests
  ↓
Selenium Tests
  ↓
Security Validation
  ↓
Docker Build
  ↓
Ansible Deployment
```

The application stores pipeline metadata in PostgreSQL through `PipelineRun` and `PipelineStage` models. The current UI shows pending status until Jenkins actually creates a pipeline record.

## Project structure

```text
app/                 Next.js pages and API routes
components/          Reusable UI components
lib/                 Prisma, auth, RBAC, validation and serializers
prisma/              schema.prisma + seed.ts
tests/               unit and Selenium E2E tests
ansible/              deployment configuration
Dockerfile            production image
docker-compose.yml    PostgreSQL + EventFlow
Jenkinsfile           CI/CD pipeline definition
```

## Useful commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
npm run test
npm run test:e2e
```

Do not commit `.env`, database passwords, session secrets, or Jenkins credentials.

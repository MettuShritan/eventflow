# EventFlow Architecture

EventFlow is a modular monolith. Domain boundaries are separated across authentication/RBAC, users, events, registrations, attendance, notifications, feedback, analytics, admin and DevOps.

A future decomposition can place an API gateway before User, Event, Registration, Notification and Attendance services. PostgreSQL remains the source of truth in the modular-monolith phase.

Release path: v0.1 initial app → v0.2 auth/RBAC → v0.3 events → v0.4 registrations → v0.5 QR attendance → v0.6 testing → v0.7 Docker → v0.8 CI/CD → v0.9 DevSecOps → v1.0 production.

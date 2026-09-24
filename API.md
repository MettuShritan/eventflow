# EventFlow API / Low-code Integration

Authenticated endpoints are intended for a trusted companion app such as Power Apps, AppSheet or OutSystems.

- `GET /api/events` — published event data for authenticated users.
- `GET /api/registrations` — caller-scoped registrations; participant sees their own, committee sees assigned-event registrations, admin sees all.
- `POST /api/registrations` — participant registration.
- `POST /api/committee/attendance` — committee-only attendance verification.

Do not expose admin users, audit logs, pipeline runs, credentials or infrastructure through public APIs.

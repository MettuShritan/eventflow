# EventFlow Selenium E2E Tests

These tests validate the critical EventFlow user journeys used by the CI/CD pipeline:

- Event search
- Participant login
- Participant denial of the Admin-only DevOps area
- Admin login
- Admin access to the DevOps dashboard
- Presence of Jenkins and Selenium pipeline information

The tests connect to a Selenium Grid/Standalone Chrome endpoint through `SELENIUM_URL` and test the running EventFlow application through `BASE_URL`.

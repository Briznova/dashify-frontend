# DASHIFY React frontend

React + TypeScript + Vite frontend generated from the supplied DASHIFY OpenAPI 3.0 document.

## Included screens and workflows
- Login, fetch school memberships, active-school selection, protected routes and sign out.
- Dashboard with live counts from school, academic years, classes and students.
- School profile read/update.
- Academic year list/create.
- Class list/create and section create.
- Student list/search/create with enrolment and optional nested guardian forms; student detail and archive.
- Attendance session list/create, mark records and close session.
- Audit log list.

## Run locally
Requires Node.js 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env
# Set VITE_API_BASE_URL to your backend, e.g. http://localhost:3000/api/v1
npm run dev
```

Build:
```bash
npm run build
npm run preview
```

## Backend CORS
Allow the frontend dev origin (`http://localhost:5173`) in NestJS CORS configuration. Restrict production origins to your actual deployed frontend domain.

## Endpoints used
`POST /auth/login`, `GET /auth/schools`, `POST /auth/active-school`, `GET /schools/current`, `PATCH /schools/current`, `GET/POST /academic-years`, `GET/POST /classes`, `POST /sections`, `GET/POST /students`, `GET /students/{id}`, `POST /students/{id}/archive`, `GET/POST /attendance/sessions`, `PUT /attendance/sessions/{id}/records`, `POST /attendance/sessions/{id}/close`, `GET /audit-logs`.

## OpenAPI limitations
The uploaded OpenAPI file specifies request DTOs and routes but most response schemas are blank. This UI therefore assumes common JSON response shapes and normalizes arrays in a defensive way. In particular:
- `GET /classes` is expected to return class records with nested `sections`.
- `GET /students` returns `{ data, meta }`; each student has an `enrolments` array. Enrolments contain `academicYear`, `section` (with nested `class`), `isActive`, `startDate` and optional `endDate`. The student-level `admissionNumber` and `admissionDate` remain separate fields.
- Student detail guardians are join records with guardian details nested under `guardian`. Attendance roster matching uses active enrolments whose start/end dates include the session date.
- Login and active-school responses should include `accessToken`; refresh token is optional.
If your live API returns different shapes, adjust the response mapping in `src/api.ts` and the relevant pages. No fees/finance features are included because they are absent from the supplied API contract.

The UI does not bypass backend authentication, authorization or tenant isolation. Browser local storage is used for bearer tokens to match the current API; assess an HttpOnly Secure SameSite cookie approach before production.

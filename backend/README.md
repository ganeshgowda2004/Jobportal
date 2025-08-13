# Job Portal Backend API

## Overview
- Roles: `recruiter`, `applicant`
- Auth: JWT via `Authorization: Bearer <token>`
- Uploads: served under `/uploads`

## Users
- POST `/api/users/register`
  - body JSON: `{ username, email?, password, role? }`
  - response: `201 { message }`
- POST `/api/users/login`
  - body JSON: `{ username, password }`
  - response: `200 { token, role }`

## Jobs
- GET `/api/jobs` (public)
- POST `/api/jobs` (recruiter)
  - headers: `Authorization`
  - body JSON: `{ title, description, company, location }`
- POST `/api/jobs/:jobId/apply` (applicant)
  - headers: `Authorization`
  - multipart/form-data:
    - `resume` file (optional; pdf, doc, docx)
    - `coverLetter` (string, optional)
- GET `/api/jobs/recruiter/applications/:jobId` (recruiter; must own job)
  - headers: `Authorization`
- PATCH `/api/jobs/applications/:applicationId/status` (recruiter; must own job)
  - headers: `Authorization`
  - body JSON: `{ status: 'Pending'|'Reviewed'|'Accepted'|'Rejected' }`

## Curl Examples
```bash
# Register recruiter
curl -sX POST http://localhost:5000/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"rec1","password":"pass1234","role":"recruiter"}'

# Login recruiter
TOKEN=$(curl -sX POST http://localhost:5000/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"rec1","password":"pass1234"}' | jq -r .token)

# Create job
curl -sX POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Backend Dev","description":"Node role...","company":"Acme","location":"Remote"}'

# Register applicant
curl -sX POST http://localhost:5000/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"app1","password":"pass1234","role":"applicant"}'

# Login applicant
ATOKEN=$(curl -sX POST http://localhost:5000/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"app1","password":"pass1234"}' | jq -r .token)

# Apply to job (with resume)
curl -sX POST http://localhost:5000/api/jobs/<jobId>/apply \
  -H "Authorization: Bearer $ATOKEN" \
  -F resume=@/path/to/resume.pdf \
  -F coverLetter='Excited to apply'

# Recruiter views applications
curl -s http://localhost:5000/api/jobs/recruiter/applications/<jobId> \
  -H "Authorization: Bearer $TOKEN"

# Recruiter updates application status
curl -sX PATCH http://localhost:5000/api/jobs/applications/<applicationId>/status \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"Reviewed"}'
```

## Environment
- Copy `.env.example` to `.env` and set values
- Ensure MongoDB is running and accessible
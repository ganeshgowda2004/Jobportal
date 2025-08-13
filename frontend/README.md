# Job Portal Frontend

A modern, responsive React.js frontend for the Job Portal backend.

## Tech
- React 18, React Router v6
- Tailwind CSS 3
- Axios with interceptors
- React Hot Toast for notifications

## Prerequisites
- Node.js 18+
- Backend running from `backend/server.js`

## Setup
1. Create `.env` with API base URL:
```
REACT_APP_API_URL=http://localhost:5000
```
2. Install dependencies:
```
cd frontend
npm install
```
3. Run the app:
```
npm start
```

## Integration Notes
- CORS is enabled in backend (`app.use(cors())`).
- Axios base URL is set from `process.env.REACT_APP_API_URL` in `src/services/api.js`.
- Auth uses JWT; token is saved in `localStorage` and added as `Authorization: Bearer <token>` on requests.

## Backend Endpoints (discovered from code)
- `POST /api/users/register` body `{ username, password }` -> 201 `{ message: string }`
- `POST /api/users/login` body `{ username, password }` -> 200 `{ token: string }`
- `GET /api/jobs` -> 200 `Job[]` (each job: `{ _id, title, description, company, location, postedBy: { _id, username }, createdAt, updatedAt }`)
- `POST /api/jobs` (auth required) body `{ title, description, company, location }` -> 201 `Job`

Missing backend endpoints:
- Job CRUD: `GET /api/jobs/:id`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`
- Applications: create/list user applications

Frontend behavior for missing endpoints:
- Job detail page loads the selected job from the `GET /api/jobs` list; if not present, shows a notice and link back.
- Apply action shows a toast that application APIs are not available yet.
- Recruiter dashboard supports creating jobs via `POST /api/jobs` and lists recent jobs from `GET /api/jobs`.

## Available Screens
- Home: search inputs and featured jobs
- Jobs: listing with client-side filters (query, location, job type) and pagination
- Job Detail: job info, company/location, posted by, disabled Apply action
- Auth: Login and Signup
- Recruiter Dashboard (protected): post jobs
- Applicant Dashboard (protected placeholder)

## Code Structure
- `src/services/api.js`: Axios instance and API calls
- `src/contexts/AuthContext.js`: app-wide auth state
- `src/hooks/useAuth.js`: simple hook for auth context
- `src/pages/*`: routes
- `src/components/*`: UI components

## Production build
```
npm run build
```

## Notes
- Ensure `JWT_SECRET` and `MONGO_URI` are set in backend `.env`.
- The UI is responsive (mobile-first) and tested on mobile, tablet, and desktop breakpoints.
# AcademiaX Client — Technical Overview

![license](https://img.shields.io/badge/license-MIT-lightgrey) ![status](https://img.shields.io/badge/status-active-green) ![frontend](https://img.shields.io/badge/frontend-React-blue)

This document is a high-level technical README prepared by the Lead Software Architect after a codebase review. It summarizes system architecture, core domain features (Enrollment, Grading, User Management), database relations, and advanced implementation details. It also provides precise local installation and deployment steps for development.

**System Overview**

- **Frontend:** React (JSX) single-page app using Ant Design and some Material-UI components.
- **State & Data Layer:** Redux Toolkit with RTK Query for server communication (see [src/Storage/Store.js](src/Storage/Store.js#L1-L60)).
- **Backend (assumed):** REST API hosted at `https://localhost:7111` — endpoints consumed by RTK Query APIs defined under [src/Api](src/Api/courseApi.js#L1-L20).
- **Auth:** JWT tokens stored in `localStorage` and parsed client-side for claims (examples in [src/Components/ProfilePage.jsx](src/Components/ProfilePage.jsx#L1-L30) and [src/Components/EnrolledCourse.jsx](src/Components/EnrolledCourse.jsx#L1-L40)).

**How Frontend ↔ Backend Communicate**

- The app uses RTK Query `createApi` slices to call HTTP endpoints. Example service bases:
  - `https://localhost:7111/api/User/` — [src/Api/accountApi.js](src/Api/accountApi.js#L1-L20)
  - `https://localhost:7111/api/course/` — [src/Api/courseApi.js](src/Api/courseApi.js#L1-L20)
  - `https://localhost:7111/api/student/` — [src/Api/studentApi.js](src/Api/studentApi.js#L1-L20)
  - `https://localhost:7111/api/teacher/` — [src/Api/teacherApi.js](src/Api/teacherApi.js#L1-L20)
- RTK Query manages caching and invalidation with `tagTypes` and `invalidatesTags` (see [src/Api/courseApi.js](src/Api/courseApi.js#L1-L80)).
- Authentication is handled by obtaining a JWT from `/api/User/Login`, storing it in `localStorage` and reading claim fields (e.g., `nameid`, `role`) in components.

**Key Features — Technical Breakdown**

- Enrollment
  - Frontend calls: `useEnrollCourseMutation`, `useGetEnrolledCoursesQuery`, `useUnenrollCourseMutation` from [src/Api/courseApi.js](src/Api/courseApi.js#L1-L120).
  - Flow: student logs in → token decoded for `nameid` → calls `enroll` mutation with payload `{ userId, courseId }` → server updates join table and RTK Query invalidates Course tags to refresh lists.
  - UI surfaces: `EnrolledCourse.jsx`, `SelectCourse.jsx`, and course list/detail components that call the RTK hooks.

- Grading
  - The repository does not contain explicit grade-calculation code on the frontend. There are API hooks in [src/Api/studentApi.js](src/Api/studentApi.js#L1-L80) such as `getStudentGrades` which the UI can call to display grades.
  - Recommendation: keep grading logic server-side and expose aggregate endpoints (e.g., GPA, weighted averages). Client should only render grade DTOs returned by API.

- User Management (Auth / Roles / Profiles)
  - Registration: `useRegisterUserMutation` in [src/Api/accountApi.js](src/Api/accountApi.js#L1-L30) used by `Register.jsx`.
  - Login: `Login.jsx` performs POST to `/api/User/Login`, stores `token` and `user` in `localStorage`, and dispatches `setLoggedInUser` to Redux slice [src/Storage/Redux/authSlice.js](src/Storage/Redux/authSlice.js#L1-L40).
  - Roles: client reads `role` claim from token to enable/disable UI actions (Admin vs Teacher vs Student). RBAC is implemented primarily at the backend; the client performs role checks for UI gating.

**Database Relations (ERD Summary)**

- Core domain entities (inferred from API signatures and payloads): `User` (base), `Student`, `Teacher`, `Course`.
- Relationships (logical):
  - User 1..\* → Student/Teacher (a `User` can be typed as Student, Teacher, or Admin via `userType`/`role`).
  - Course _.._ Student — many-to-many via `Enrollment` / `StudentCourse` join table. Enrollment stores enrollment date, status, and possibly grade reference.
  - Course 1..\* → Teacher (each course has a `teacherId` foreign key).

ERD (text): - `User(id, userName, email, passwordHash, role, firstName, lastName, phoneNumber, image)` - `Course(id, code, name, description, credits, teacherId, semesterId, departmentId)` - `StudentCourse(studentId, courseId, enrolledAt, status, finalGrade)` - `Teacher(id, userId)` or Teacher as extension of `User`.

**Advanced Implementation & Patterns**

- State management: Redux Toolkit + RTK Query. Global auth stored in `authSlice`; remote data via RTK Query APIs in [src/Storage/Store.js](src/Storage/Store.js#L1-L40).
- API & caching: `createApi` + `fetchBaseQuery` + `tagTypes` for automatic cache invalidation (see [src/Api/courseApi.js](src/Api/courseApi.js#L1-L120)).
- Auth pattern: JWT in `localStorage`, client-side token decoding for UI-level role checks (examples: `ProfilePage.jsx`, `EnrolledCourse.jsx`). Consider migrating token handling to an HTTP middleware to attach `Authorization` header automatically.
- UI patterns: Ant Design components for layout/collapsible lists and forms; Material UI used in the registration form.
- Recommended backend patterns (observed or implied):
  - RBAC enforced via middleware on the server; client-only checks are UI-level.
  - Endpoints follow RESTful conventions with resource-oriented routes (e.g., `/course/enroll`, `/student/grades/{id}`).
- Suggested frontend improvements implemented as patterns:
  - Middleware for injecting `Authorization` header into RTK `baseQuery`.
  - Custom React hooks for common flows (e.g., `useCurrentUser()` that decodes token and returns claims and a `refresh` helper).
  - Centralized error handling component that processes RTK Query `error` objects.

**Installation & Local Development**
Prerequisites:

- Node.js 16+ (recommend LTS)
- npm or yarn
- Backend API running at `https://localhost:7111` (HTTPS) — the frontend expects this host by default.

Steps:

1. Clone the repo and change into the client app folder:

```powershell
cd c:\StudentIS\Academia_X_React\AcademiaX_React\clientapp
```

2. Install dependencies:

```powershell
npm install
# or
yarn install
```

3. Start the development server:

```powershell
npm start
# or
yarn start
```

4. Backend: ensure the server is running at `https://localhost:7111` and exposes routes under `/api/User`, `/api/course`, `/api/student`, `/api/teacher`.

5. Login / register flow:
   - Register via the UI (`/register`) or send POST to `/api/User/Register`.
   - Login via `/api/User/Login`. The client stores the JWT in `localStorage` key `token` and the user object under `user`.

Environment variables & tips:

- If backend host/port differs, update the `baseUrl` values in the API files under [src/Api](src/Api/courseApi.js#L1-L10).
- Consider adding `.env` support and referencing `process.env.REACT_APP_API_URL` when configuring `fetchBaseQuery`.

**Files of interest (quick links)**

- RTK Store: [src/Storage/Store.js](src/Storage/Store.js#L1-L60)
- Auth slice: [src/Storage/Redux/authSlice.js](src/Storage/Redux/authSlice.js#L1-L40)
- Course API: [src/Api/courseApi.js](src/Api/courseApi.js#L1-L120)
- Student API: [src/Api/studentApi.js](src/Api/studentApi.js#L1-L120)
- Account API: [src/Api/accountApi.js](src/Api/accountApi.js#L1-L40)
- Enrollment UI: [src/Components/EnrolledCourse.jsx](src/Components/EnrolledCourse.jsx#L1-L60)
- Login page: [src/Pages/Account/Login.jsx](src/Pages/Account/Login.jsx#L1-L80)

**Next recommended architectural improvements**

- Add RTK `baseQuery` middleware to automatically attach `Authorization: Bearer <token>` header.
- Move API base URLs to environment variables.
- Implement centralized type definitions (TypeScript) for DTOs and API responses to improve safety.
- Add front-end unit tests for critical flows (login, enroll/un-enroll, course creation) and integrate CI.

If you'd like, I can (pick one):

- add Authorization header middleware to RTK Query (`src/Api/*`) and update the `Store.js`,
- or convert the API baseURLs to `process.env.REACT_APP_API_URL` and add a sample `.env.example`.

— End of Architect Review

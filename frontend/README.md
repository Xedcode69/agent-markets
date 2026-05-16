# Agent Markets Frontend Guide

This frontend is the Next.js application for Agent Markets, a marketplace where sellers publish AI agents and buyers discover, purchase credits for, and execute those agents.

The frontend must support two separate user experiences:

- Buyers: browse agents, view agent details, execute agents, manage credits, and view usage history.
- Sellers: create agents, manage their own listings, inspect execution activity, and view earnings or marketplace performance.

The selected role during signup controls which dashboard the user sees after authentication.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn-style component structure
- Radix UI primitives
- lucide-react icons
- class-variance-authority for component variants
- clsx and tailwind-merge through `lib/utils.ts`

## Project Structure

```text
frontend/
  app/
    layout.tsx
    page.tsx
    globals.css
    agents/
      page.tsx
      [agentId]/
        page.tsx
    dashboard/
      page.tsx
    login/
      page.tsx
    signup/
      page.tsx
  components/
    ui/
      button.tsx
    web/
      navbar.tsx
  lib/
    utils.ts
  public/
  components.json
  package.json
  tsconfig.json
```

Recommended structure as the app grows:

```text
frontend/
  app/
    agents/
      page.tsx
      [agentId]/
        page.tsx
      new/
        page.tsx
    buyer/
      dashboard/
        page.tsx
      executions/
        page.tsx
      credits/
        page.tsx
    seller/
      dashboard/
        page.tsx
      agents/
        page.tsx
      agents/
        [agentId]/
          edit/
            page.tsx
      executions/
        page.tsx
    login/
      page.tsx
    signup/
      page.tsx
    verify-otp/
      page.tsx
  components/
    agents/
    auth/
    buyer/
    seller/
    ui/
    web/
  lib/
    api.ts
    auth.ts
    types.ts
    utils.ts
```

## Running The Frontend

Install dependencies inside the frontend folder:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend also defaults to port `3000`. Set the backend to another port, such as `5000`, in the root `.env` file:

```env
PORT=5000
```

Then create a frontend environment file:

```text
frontend/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## Core Frontend Routes

Use these routes as the main frontend roadmap:

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Public landing and marketplace preview | Public |
| `/agents` | Browse all active agents | Public or buyer-focused |
| `/agents/[agentId]` | Agent details and execution form | Logged-in buyers |
| `/signup` | Create buyer or seller account | Public |
| `/verify-otp` | Verify email after signup | Public after signup |
| `/login` | Login and store token | Public |
| `/dashboard` | Role-based redirect page | Logged in |
| `/buyer/dashboard` | Buyer dashboard | Buyer |
| `/buyer/credits` | Buyer credit balance and top-up UI | Buyer |
| `/buyer/executions` | Buyer execution history | Buyer |
| `/seller/dashboard` | Seller dashboard | Seller |
| `/seller/agents` | Seller agent management | Seller |
| `/agents/new` | Create a new agent listing | Seller |
| `/seller/agents/[agentId]/edit` | Edit existing seller-owned agent | Seller |

The generic `/dashboard` page should not become the main dashboard UI. It should check the authenticated user's role and route to either:

```text
/buyer/dashboard
```

or:

```text
/seller/dashboard
```

## Role-Based Dashboard Requirement

During signup, the user selects one of these roles:

```ts
type UserRole = "buyer" | "seller";
```

The selected role is sent to the backend:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "buyer"
}
```

or:

```json
{
  "email": "seller@example.com",
  "password": "password123",
  "role": "seller"
}
```

After login, the frontend should know the user's role. There are two clean ways to do this:

1. Include the role in the login response from the backend.
2. Decode the token or call a `/me` endpoint after login.

Recommended backend response:

```json
{
  "message": "Login successful",
  "token": "...",
  "user": {
    "id": 1,
    "email": "seller@example.com",
    "role": "seller"
  }
}
```

Then the frontend can redirect:

```ts
if (user.role === "seller") {
  router.push("/seller/dashboard");
} else {
  router.push("/buyer/dashboard");
}
```

## Buyer Dashboard

The buyer dashboard should focus on finding and using agents.

Recommended buyer dashboard sections:

- Credit balance
- Recently executed agents
- Suggested or popular agents
- Execution status summaries
- Link to browse marketplace
- Link to execution history

Recommended buyer pages:

```text
/buyer/dashboard
/buyer/credits
/buyer/executions
/agents
/agents/[agentId]
```

Buyer actions:

- Browse active agents
- View agent details
- Execute an agent
- See execution result
- Track execution cost
- View credit balance
- View past executions

## Seller Dashboard

The seller dashboard should focus on publishing and managing agents.

Recommended seller dashboard sections:

- Total listed agents
- Active agents
- Recent executions across owned agents
- Revenue or usage summary
- Create new agent button
- Agent management table

Recommended seller pages:

```text
/seller/dashboard
/seller/agents
/agents/new
/seller/agents/[agentId]/edit
/seller/executions
```

Seller actions:

- Create agent listing
- Edit owned agent
- Disable or delete owned agent
- View executions for owned agents
- Track usage and earnings

## Authentication Flow

### Signup

Frontend route:

```text
/signup
```

Backend endpoint:

```text
POST /api/v1/auth/signup
```

Request:

```json
{
  "email": "buyer@example.com",
  "password": "password123",
  "role": "buyer"
}
```

Response:

```json
{
  "message": "OTP sent successfully",
  "userId": 1
}
```

After signup, store the returned `userId` temporarily and route to:

```text
/verify-otp
```

### OTP Verification

Frontend route:

```text
/verify-otp
```

Backend endpoint:

```text
POST /api/v1/auth/verify-otp
```

Request:

```json
{
  "userId": 1,
  "code": "123456"
}
```

After successful verification, route to:

```text
/login
```

### Login

Frontend route:

```text
/login
```

Backend endpoint:

```text
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "buyer@example.com",
  "password": "password123"
}
```

Response should include token and user role:

```json
{
  "message": "Login successful",
  "token": "...",
  "user": {
    "id": 1,
    "email": "buyer@example.com",
    "role": "buyer"
  }
}
```

After login:

- Save the token.
- Save the user object or fetch it using a profile endpoint.
- Redirect buyers to `/buyer/dashboard`.
- Redirect sellers to `/seller/dashboard`.

## API Helper

Create:

```text
frontend/lib/api.ts
```

```ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}
```

For authenticated requests from client components, add the token:

```ts
export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}
```

For production, prefer HTTP-only cookies instead of storing JWTs in `localStorage`.

## Shared Types

Create:

```text
frontend/lib/types.ts
```

```ts
export type UserRole = "buyer" | "seller";

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};

export type Agent = {
  id: number;
  name: string;
  description: string | null;
  endpoint_url: string;
  pricing_type: "per_call" | "subscription";
  price: string;
  is_active: boolean;
  owner_id: number;
  created_at: string;
};

export type Execution = {
  id: number;
  agent_id: number;
  user_id: number;
  input: unknown;
  output: unknown;
  status: "pending" | "completed" | "failed";
  cost: string;
  response_time: number;
  created_at: string;
};
```

## Current Backend Endpoints

The backend mounts these route groups:

```text
/api/v1/auth
/api/v1/agents
/api/v1/users
/api/v1/executions
```

Auth endpoints:

```text
POST /api/v1/auth/signup
POST /api/v1/auth/verify-otp
POST /api/v1/auth/resend-otp
POST /api/v1/auth/login
```

Current agent endpoints are effectively:

```text
GET    /api/v1/agents/agents
POST   /api/v1/agents/agents
GET    /api/v1/agents/agents/:id
GET    /api/v1/agents/agents/owner
PUT    /api/v1/agents/agents/:id
DELETE /api/v1/agents/agents/:id
```

This double `/agents/agents` path should be cleaned up later. The preferred final API shape is:

```text
GET    /api/v1/agents
POST   /api/v1/agents
GET    /api/v1/agents/:id
GET    /api/v1/agents/owner
PUT    /api/v1/agents/:id
DELETE /api/v1/agents/:id
```

Execution endpoint:

```text
POST /api/v1/executions/:agentId
```

Protected endpoints must receive:

```http
Authorization: Bearer YOUR_TOKEN
```

## Page Implementation Plan

### Home Page

File:

```text
app/page.tsx
```

Should include:

- Clear Agent Markets heading
- Marketplace preview
- Links to browse agents, login, and signup
- Separate calls to action for buyers and sellers

### Agents Page

File:

```text
app/agents/page.tsx
```

Should include:

- List of active agents
- Search input
- Pricing type filter
- Agent cards
- Empty state when no agents exist

### Agent Detail Page

File:

```text
app/agents/[agentId]/page.tsx
```

Should include:

- Agent name
- Description
- Price
- Pricing type
- Seller information if available
- Execute button or execution form for buyers
- Login prompt for anonymous users

### Signup Page

File:

```text
app/signup/page.tsx
```

Must include:

- Email field
- Password field
- Role selector with `buyer` and `seller`
- Submit button
- Redirect to OTP verification after successful signup

The role selector is important because it determines the user's dashboard.

### Login Page

File:

```text
app/login/page.tsx
```

Must include:

- Email field
- Password field
- Submit button
- Error state
- Loading state
- Role-based redirect after login

### Generic Dashboard Redirect

File:

```text
app/dashboard/page.tsx
```

This should only decide where to send the user:

```ts
if (user.role === "seller") {
  redirect("/seller/dashboard");
}

redirect("/buyer/dashboard");
```

### Buyer Dashboard

File:

```text
app/buyer/dashboard/page.tsx
```

Should include:

- Welcome message
- Credit balance
- Recent executions
- Recommended agents
- Link to browse all agents

### Seller Dashboard

File:

```text
app/seller/dashboard/page.tsx
```

Should include:

- Welcome message
- Agent count
- Active listing count
- Recent executions
- Create agent action
- Link to manage agents

## UI Component Guidelines

Use `components/ui` for reusable primitives:

```text
components/ui/button.tsx
components/ui/input.tsx
components/ui/card.tsx
components/ui/badge.tsx
components/ui/textarea.tsx
components/ui/select.tsx
```

Use app-specific folders for domain components:

```text
components/auth/signup-form.tsx
components/auth/login-form.tsx
components/agents/agent-card.tsx
components/agents/agent-form.tsx
components/buyer/credit-summary.tsx
components/buyer/recent-executions.tsx
components/seller/seller-agent-table.tsx
components/seller/seller-stats.tsx
```

Keep components small and focused. Pages should compose components instead of containing all UI and logic directly.

## Styling Direction

Agent Markets should feel like a professional marketplace and dashboard product.

Recommended style:

- Clean neutral background
- Strong readable typography
- Compact cards for agents
- Tables for seller management views
- Clear status badges
- Practical forms with labels and validation
- Distinct buyer and seller dashboard navigation

Avoid making the app look like a marketing-only landing page. The first screen should quickly lead users into browsing, signing up, logging in, or managing agents.

## Backend Fixes Needed For Smooth Frontend Work

The frontend can be built now, but several backend issues should be fixed for full integration:

- `check_authorized.js` assigns `req.user = decoded`, but the variable is currently named `decode`.
- The `users` table needs an `is_verified` column because login checks `existingUser.is_verified`.
- The OTP flow inserts into `otp_codes`, but the migration file should also create that table.
- Agent routes should avoid `/api/v1/agents/agents`.
- Protected seller agent routes should use `authMiddleware`.
- The login response should return the user's role.
- `execution_service.js` has naming mismatches such as `inputData` vs `data`, `agent.cost` vs `agent.price`, and `startTime` spelling.

## Recommended Build Order

1. Confirm backend runs on port `5000`.
2. Add `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local`.
3. Create `lib/api.ts`, `lib/auth.ts`, and `lib/types.ts`.
4. Build signup with buyer/seller role selection.
5. Build OTP verification.
6. Build login with role-based redirect.
7. Build `/dashboard` as a role redirect page.
8. Build `/buyer/dashboard`.
9. Build `/seller/dashboard`.
10. Build `/agents` and `/agents/[agentId]`.
11. Build seller agent creation and management pages.
12. Add loading, empty, and error states.
13. Fix backend route and auth issues.
14. Test complete buyer and seller flows separately.

## Final Target User Flows

Buyer flow:

```text
Signup as buyer
Verify OTP
Login
Redirect to /buyer/dashboard
Browse agents
Open agent details
Execute agent
View result and execution history
```

Seller flow:

```text
Signup as seller
Verify OTP
Login
Redirect to /seller/dashboard
Create agent listing
Manage listed agents
View executions and usage
Update or disable agent listings
```

These two flows should stay separate in navigation, dashboard layout, permissions, and primary actions.

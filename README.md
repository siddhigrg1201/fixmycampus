# FixMyCampus

A web app for IGDTUW students to report campus issues, track their status and
help build a better campus. Admins prioritise complaints, update their status
and view analytics.

## Features

**Students**
- Sign up and log in
- Report an issue (title, department, floor, optional room, optional photo)
- Post anonymously
- See all campus complaints, sorted by priority
- Track their own complaints and their status (pending, in progress, resolved)

**Admin**
- Set and change the priority of every complaint
- Update complaint status (students see it instantly)
- Analytics: complaints by department, status breakdown, priority breakdown,
  overdue count and the most urgent complaint

## Tech stack

React + Vite, plain CSS, React Router, Supabase (Auth, Postgres, Storage, Realtime)

## Run it locally

1. Clone the repo and install packages:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the project root:

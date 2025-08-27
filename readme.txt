# Rainbow Planner

This repository contains the initial framework for **Rainbow Planner**, a tool for managing Rainbow units.

## Structure

- `backend/` – Express server with PostgreSQL database.
- `frontend/` – Vite + React frontend.

## Database

Run the SQL found in `backend/sql/create_girls_table.sql` against your PostgreSQL instance to create the `girls` table.

## Development

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend proxies API requests to the backend during development.

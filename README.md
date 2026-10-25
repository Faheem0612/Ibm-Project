# Spoke & Chain – simple MERN bike listing

Two windows:
- **Browse bikes** (`/`) – anyone can view listed bikes and filter by type.
- **Admin** (`/admin`) – sign in with the admin key, then add or remove bikes.

## Run it
1. Have Node 18+ and MongoDB running locally (or use a MongoDB Atlas URI).
2. `cp server/.env.example server/.env` and set `ADMIN_KEY` (and `MONGO_URI` if needed).
3. `npm run install:all`
4. `npm run dev`
5. Open http://localhost:5173

Or run separately: `cd server && npm run dev` and `cd client && npm run dev`.

## API
- `GET /api/bikes` – public
- `POST /api/bikes` – admin (header `x-admin-key`)
- `DELETE /api/bikes/:id` – admin (header `x-admin-key`)

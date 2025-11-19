# 🚗 SmartWheelz – Full-Stack Car Rental Platform

A production‑ready **car rental system** where users can rent cars and owners can manage their fleet.

Hosted on **Render**:

- **Frontend:** https://smartwheelz-frontend.onrender.com
- **Backend API:** https://smartwheelz.onrender.com

---

## 📸 Screenshots

Place your screenshots inside:
`client/public/screenshots/`

Recommended file names:

- landing.png
- cars.png
- car-details.png
- dashboard.png
- manage-bookings.png

Example:

```md
### Landing Page

![Landing](./screenshots/landing.png)

### Cars Page

![Cars](./screenshots/cars.png)

### Car Details

![Car Details](./screenshots/car-details.png)

### Owner Dashboard

![Dashboard](./screenshots/dashboard.png)

### Manage Bookings

![Manage Bookings](./screenshots/manage-bookings.png)
```

---

## ✨ Features

### 🧑‍💻 User Features

- Browse cars
- Smart search & filters
- Real‑time availability checking
- Price auto‑calculation
- Booking history

### 🏢 Owner Features

- Dashboard analytics
- Add / manage / delete cars
- Soft delete + hard delete
- Toggle availability
- Manage booking statuses

### 🔐 Authentication & Security

- JWT with rotating session key
- bcrypt password hashing
- Protected routes

### 🎨 UI

- React 19
- Tailwind 4
- Motion animations
- Clean responsive UI

---

## 🛠️ Tech Stack

### **Frontend**

- React 19 + TypeScript
- Vite 7
- TailwindCSS 4
- React Router 7
- Axios

### **Backend**

- Node.js + Express 5
- MongoDB + Mongoose 8
- Multer
- JWT
- ImageKit

---

# 🚀 Local Development Setup

## 1️⃣ Clone Repo

```bash
git clone https://github.com/VIKRAMANR7/SmartWheelz.git
cd SmartWheelz
```

---

# ⚙️ Backend Setup

```bash
cd server
pnpm install
```

### Create `.env`

```
MONGODB_URI=
JWT_SECRET=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

PORT=5000
```

### Run Server

```bash
pnpm dev
```

---

# 💻 Frontend Setup

```bash
cd client
pnpm install
```

### Create `.env`

```
VITE_BASE_URL=http://localhost:5000
VITE_CURRENCY=₹
```

### Run Frontend

```bash
pnpm dev
```

---

# 🗂 Project Structure

```
SmartWheelz/
├── client/
│   ├── public/
│   │   └── screenshots/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── utils/
│       └── types/
└── server/
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── models/
    ├── configs/
    └── server.ts
```

---

# 🔗 API Endpoints

## User `/api/user`

| Method | Endpoint    | Description        |
| ------ | ----------- | ------------------ |
| POST   | `/register` | Register user      |
| POST   | `/login`    | Login              |
| GET    | `/data`     | Get logged‑in user |

---

## Owner `/api/owner`

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/add-car`        | Add new car         |
| GET    | `/cars`           | Owner cars          |
| POST   | `/toggle-car`     | Toggle availability |
| DELETE | `/delete-car/:id` | Hard delete         |

---

## Bookings `/api/bookings`

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/create`             | Create booking        |
| POST   | `/check-availability` | Check available dates |
| GET    | `/user`               | User bookings         |
| GET    | `/owner`              | Owner bookings        |

---

# 🧮 Algorithms

### Booking Conflict Check

```ts
const conflict = await Booking.find({
  car: carId,
  pickupDate: { $lte: returnDate },
  returnDate: { $gte: pickupDate },
});
```

### Price Calculation

```ts
const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
const price = days * car.pricePerDay;
```

---

# 🛫 Deployment (Render)

### **Frontend**

- Build Command: `pnpm build`
- Publish Directory: `client/dist`

### **Backend**

- Build Command: `pnpm install && pnpm build`
- Start Command: `node dist/server.js`

---

# ✔️ Post Deployment Checklist

- Update frontend `.env` with Render backend URL
- Test login + booking flow
- Test ImageKit uploads
- Test owner dashboard

---

# ⭐ Support

If you like this project → **Star the repo!**

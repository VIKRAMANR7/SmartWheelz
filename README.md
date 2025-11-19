# 🚗 SmartWheelz – Full-Stack Car Rental Platform

A complete production-grade **car rental system** where users can rent cars and owners can list/manage vehicles.
Built with **React, TypeScript, Vite, Tailwind CSS, Node.js, Express, MongoDB, and ImageKit**, featuring:

- Real-time booking validation  
- Soft delete system for cars  
- Secure JWT authentication with rotating session keys  
- Owner dashboard with analytics  

---

## 📸 Screenshots

> Add real screenshots inside `/screenshots` folder.

### Landing Page  
![Landing](./screenshots/landing.png)

### Car Details  
![Car Details](./screenshots/car-details.png)

### Owner Dashboard  
![Dashboard](./screenshots/dashboard.png)

### Manage Bookings  
![Manage Bookings](./screenshots/manage-bookings.png)

---

# ✨ Features

## 🧑‍💻 For Renters (Users)
- 🔍 Smart search & filters  
- 📅 Real-time date-based availability  
- 💰 Auto price calculation (days × pricePerDay)  
- 🚗 Detailed car specification pages  
- 📜 Booking history with statuses  

## 🏢 For Owners
- 📊 Dashboard analytics (cars, bookings, revenue)  
- 🚘 Add new cars with ImageKit uploads  
- 🔄 Toggle availability  
- 📦 Archive / Restore (Soft Delete)  
- ❌ Permanent Delete (Hard Delete)  
- 📖 Manage bookings & approvals  

## 🔐 Authentication & Security
- JWT-based auth with rotating `SESSION_KEY`  
- Role-based access control (user/owner)  
- bcrypt password hashing  
- Protected API routes  

## 🎨 UI/UX
- Tailwind CSS 4 custom theme  
- Framer Motion animations  
- React Hot Toast notifications  
- Skeleton loaders  
- Smooth navigation transitions  

---

# 🛠️ Tech Stack

### **Frontend**
- React 19  
- TypeScript  
- Vite  
- React Router DOM 7  
- Tailwind CSS 4  
- Framer Motion  
- Axios  

### **Backend**
- Node.js + Express 5  
- MongoDB + Mongoose 8  
- Multer  
- JWT  
- bcrypt  
- ImageKit SDK  

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repo
```bash
git clone https://github.com/yourusername/smartwheelz.git
cd smartwheelz
```

---

# ⚙️ Backend Setup

```bash
cd server
pnpm install
```

### Create `.env`
```env
# Database
MONGODB_URI=

# Auth
JWT_SECRET=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Server
PORT=5000
```

### Run server
```bash
pnpm run dev
```

---

# 💻 Frontend Setup

```bash
cd client
pnpm install
```

### Create `.env`
```env
VITE_BASE_URL=http://localhost:5000
VITE_CURRENCY=₹
```

### Start client
```bash
pnpm dev
```

---

# 🗂 Project Structure

```txt
smartwheelz/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CarCard.tsx
│   │   │   ├── Title.tsx
│   │   │   └── owner/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Cars.tsx
│   │   │   ├── CarDetails.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   └── owner/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── AddCar.tsx
│   │   │       ├── ManageCars.tsx
│   │   │       └── ManageBooking.tsx
│   │   ├── context/AppContext.tsx
│   │   ├── types/
│   │   │   ├── car.d.ts
│   │   │   ├── user.d.ts
│   │   │   ├── booking.d.ts
│   │   │   └── context.d.ts
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── configs/
│   └── server.ts
```

---

# 📌 API Reference

## 🔹 User Routes (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register |
| POST | `/login` | Login |
| GET | `/data` | Get logged-in user |
| GET | `/cars` | Public car list |

---

## 🔹 Owner Routes (`/api/owner`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/change-role` | Upgrade to owner |
| POST | `/add-car` | Add new car |
| GET | `/cars` | Owner's cars |
| POST | `/toggle-car` | Toggle availability |
| POST | `/delete-car` | Soft delete |
| DELETE | `/delete-car/:id` | Permanent delete |
| GET | `/dashboard` | Dashboard metrics |

---

## 🔹 Booking Routes (`/api/bookings`)
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/check-availability` | Date-range check |
| POST | `/create` | Create booking |
| GET | `/user` | User bookings |
| GET | `/owner` | Owner bookings |
| POST | `/change-status` | Update booking status |

---

# 🧮 Important Algorithms

### 🗓 Availability Check (No double booking)
```ts
const conflict = await Booking.find({
  car: carId,
  pickupDate: { $lte: returnDate },
  returnDate: { $gte: pickupDate }
});
```

### 💰 Price Calculation
```ts
const days = Math.ceil(
  (new Date(returnDate) - new Date(pickupDate)) /
  (1000 * 60 * 60 * 24)
);

const price = days * car.pricePerDay;
```

### 🔐 JWT with Rotating Session Key
```ts
export const SESSION_KEY = crypto.randomBytes(32).toString("hex");

const token = jwt.sign(
  payload,
  process.env.JWT_SECRET + SESSION_KEY
);
```

---

# 🚀 Deployment (Vercel)

### Backend
```bash
cd server
vercel --prod
```

### Frontend
```bash
cd client
pnpm build
vercel --prod
```

### Production `.env` (Server)
```env
MONGODB_URI=
JWT_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
PORT=5000
```

### Production `.env` (Client)
```env
VITE_BASE_URL=https://your-backend.vercel.app
VITE_CURRENCY=₹
```

---

# ✔️ Post Deployment Checklist

- Update client `.env`  
- Test booking flow  
- Test ImageKit uploads  
- Check dashboard revenue  
- Ensure MongoDB Atlas IP whitelist is correct  

---

# 🤝 Contributing

1. Fork  
2. Create feature branch  
3. Commit  
4. Open PR  

---

# 📜 License

MIT License  

---

# ⭐ Support  
If this project helped you, **please star the repository!**

# 🚗 SmartWheelz - Premium Car Rental Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

A full-stack, production-ready car rental platform built with the MERN stack, featuring real-time booking management, role-based access control, and seamless payment integration.

## 🌐 Live Deployment

- **Frontend:** [https://smartwheelz-frontend.onrender.com](https://smartwheelz-frontend.onrender.com)
- **Backend API:** [https://smartwheelz.onrender.com](https://smartwheelz.onrender.com)

## 📸 Screenshots

<div align="center">

### Landing Page

![Landing Page](client/public/screenshots/landing.png)

### Car Listing

![Car Listing](client/public/screenshots/cars.png)

### Car Details & Booking

![Car Details](client/public/screenshots/car-details.png)

### Owner Dashboard

![Dashboard](client/public/screenshots/dashboard.png)

### Booking Management

![Manage Bookings](client/public/screenshots/manage-bookings.png)

</div>

## ✨ Key Features

### 👤 User Features

- **Advanced Search & Filtering** - Search cars by brand, model, category, transmission type, and location
- **Date-Based Availability** - Real-time availability checking for specific date ranges
- **Seamless Booking** - Intuitive booking flow with instant confirmation
- **Booking History** - Track all past and upcoming bookings with detailed information
- **Secure Authentication** - JWT-based authentication with role-based access control

### 👨‍💼 Owner Features

- **Car Management** - Add, edit, toggle availability, archive, and delete cars
- **Booking Oversight** - View and manage all bookings (approve, cancel, confirm)
- **Analytics Dashboard** - Real-time metrics including revenue, bookings, and car performance
- **Image Management** - Integrated ImageKit for optimized image storage and delivery
- **Role Switching** - Seamless transition between user and owner roles

### 🔧 Technical Features

- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Smooth Animations** - Motion/Framer Motion for enhanced UX
- **Image Optimization** - ImageKit integration for fast image delivery
- **Error Handling** - Comprehensive error handling on both client and server
- **Type Safety** - Full TypeScript implementation across the stack
- **Code Quality** - ESLint + Prettier for consistent code formatting

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI[React 19 + TypeScript]
        Router[React Router v7]
        State[Context API]
        Anim[Motion/Framer]
        Style[TailwindCSS 4]
    end

    subgraph Server["Server Layer"]
        API[Express.js]
        Auth[JWT Authentication]
        Middleware[Custom Middleware]
        Upload[Multer File Upload]
    end

    subgraph Database["Data Layer"]
        Mongo[(MongoDB)]
        Models[Mongoose Models]
    end

    subgraph External["External Services"]
        ImageKit[ImageKit CDN]
    end

    UI --> Router
    Router --> State
    State --> Anim
    Anim --> Style

    UI -->|HTTP/REST| API
    API --> Auth
    API --> Middleware
    API --> Upload

    API --> Models
    Models --> Mongo

    Upload --> ImageKit
    ImageKit -->|Optimized URLs| UI

    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

## 🔄 Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant Auth
    participant DB
    participant ImageKit

    User->>Client: Search Cars (Location, Dates)
    Client->>API: POST /api/bookings/check-availability
    API->>DB: Query Available Cars
    DB-->>API: Return Available Cars
    API-->>Client: Available Cars List
    Client-->>User: Display Results

    User->>Client: Select Car & Book
    Client->>API: POST /api/bookings/create
    API->>Auth: Verify JWT Token
    Auth-->>API: Token Valid
    API->>DB: Check Car Availability
    DB-->>API: Car Available
    API->>DB: Create Booking Record
    DB-->>API: Booking Created
    API-->>Client: Booking Confirmation
    Client-->>User: Success Message

    User->>Client: Upload Car Image (Owner)
    Client->>API: POST /api/owner/add-car
    API->>Auth: Verify Owner Role
    Auth-->>API: Authorized
    API->>ImageKit: Upload Image
    ImageKit-->>API: Image URL
    API->>DB: Store Car Data
    DB-->>API: Car Saved
    API-->>Client: Success Response
    Client-->>User: Car Listed
```

## 🗄️ Database Schema

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ CAR : owns
    CAR ||--o{ BOOKING : "is booked in"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role "user|owner"
        string image
        timestamp createdAt
        timestamp updatedAt
    }

    CAR {
        ObjectId _id PK
        ObjectId owner FK "nullable"
        string brand
        string model
        string image
        number year
        string category
        number seating_capacity
        string fuel_type
        string transmission
        number pricePerDay
        string location
        string description
        boolean isAvailable
        timestamp createdAt
        timestamp updatedAt
    }

    BOOKING {
        ObjectId _id PK
        ObjectId car FK
        ObjectId user FK
        ObjectId owner FK
        date pickupDate
        date returnDate
        number price
        enum status "pending|confirmed|cancelled"
        timestamp createdAt
        timestamp updatedAt
    }
```

## 🎨 Component Architecture

```mermaid
graph TD
    App[App.tsx]

    subgraph Layouts
        MainLayout[Main Layout]
        OwnerLayout[Owner Layout]
    end

    subgraph Pages
        Home[Home]
        Cars[Cars]
        CarDetails[Car Details]
        MyBookings[My Bookings]
        Dashboard[Dashboard]
        AddCar[Add Car]
        ManageCars[Manage Cars]
        ManageBookings[Manage Bookings]
    end

    subgraph Components
        Navbar[Navbar]
        Footer[Footer]
        Hero[Hero]
        CarCard[Car Card]
        Login[Login Modal]
        Loader[Loader]
        OwnerNav[Owner Navbar]
        Sidebar[Sidebar]
    end

    subgraph Context
        AppContext[App Context Provider]
    end

    App --> AppContext
    AppContext --> MainLayout
    AppContext --> OwnerLayout

    MainLayout --> Navbar
    MainLayout --> Home
    MainLayout --> Cars
    MainLayout --> CarDetails
    MainLayout --> MyBookings
    MainLayout --> Footer

    OwnerLayout --> OwnerNav
    OwnerLayout --> Sidebar
    OwnerLayout --> Dashboard
    OwnerLayout --> AddCar
    OwnerLayout --> ManageCars
    OwnerLayout --> ManageBookings

    Home --> Hero
    Home --> CarCard
    Cars --> CarCard
    Navbar --> Login

    style App fill:#ff6b6b
    style AppContext fill:#4ecdc4
    style MainLayout fill:#95e1d3
    style OwnerLayout fill:#f38181
```

## 🔌 API Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Route
    participant Middleware
    participant Controller
    participant Model
    participant DB

    Client->>Route: HTTP Request
    Route->>Middleware: Pass Request

    alt Authentication Required
        Middleware->>Middleware: Verify JWT Token
        Middleware->>Model: Get User by ID
        Model->>DB: Query User
        DB-->>Model: User Data
        Model-->>Middleware: User Object
        Middleware->>Middleware: Attach User to Request
    end

    alt File Upload
        Middleware->>Middleware: Multer Process File
        Middleware->>Middleware: Validate File Type
    end

    Middleware->>Controller: Forward Request
    Controller->>Controller: Validate Input

    alt Business Logic
        Controller->>Model: Perform DB Operation
        Model->>DB: Execute Query
        DB-->>Model: Result
        Model-->>Controller: Processed Data
    end

    alt Error Occurs
        Controller->>Middleware: Throw Error
        Middleware->>Client: Error Response
    end

    Controller-->>Client: Success Response
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Motion (Framer Motion)** - Smooth animations
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety on the server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **ImageKit** - Image optimization & CDN

### DevOps & Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Fast package manager
- **Git** - Version control
- **Vercel/Render** - Deployment platforms

## 📁 Project Structure

```
smartwheelz/
├── client/                 # Frontend React application
│   ├── public/
│   │   └── screenshots/   # Application screenshots
│   ├── src/
│   │   ├── assets/        # Static assets (images, icons)
│   │   ├── components/    # Reusable components
│   │   │   └── owner/     # Owner-specific components
│   │   ├── context/       # React Context (Global State)
│   │   ├── pages/         # Page components
│   │   │   └── owner/     # Owner dashboard pages
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend Express application
│   ├── src/
│   │   ├── configs/       # Configuration files
│   │   │   ├── db.ts          # MongoDB connection
│   │   │   ├── imageKit.ts    # ImageKit setup
│   │   │   ├── session.ts     # Session configuration
│   │   │   └── validateEnv.ts # Environment validation
│   │   ├── controllers/   # Request handlers
│   │   │   ├── bookingController.ts
│   │   │   ├── ownerController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/    # Custom middleware
│   │   │   ├── asyncHandler.ts # Async error wrapper
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   ├── errorHandler.ts # Error handling
│   │   │   └── multer.ts       # File upload
│   │   ├── models/        # Mongoose schemas
│   │   │   ├── Booking.ts
│   │   │   ├── Car.ts
│   │   │   └── User.ts
│   │   ├── routes/        # API routes
│   │   │   ├── bookingRoutes.ts
│   │   │   ├── ownerRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Express server setup
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB (local or Atlas)
- ImageKit account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/smartwheelz.git
cd smartwheelz
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

3. **Environment Setup**

Create `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartwheelz
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_folder
```

Create `.env` file in the `client` directory:

```env
VITE_BASE_URL=http://localhost:5000
VITE_CURRENCY=₹
```

4. **Run the application**

```bash
# Terminal 1 - Run server
cd server
pnpm dev

# Terminal 2 - Run client
cd client
pnpm dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📝 API Documentation

### User Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/user/register` | Register new user | No            |
| POST   | `/api/user/login`    | User login        | No            |
| GET    | `/api/user/data`     | Get user data     | Yes           |
| GET    | `/api/user/cars`     | Get all cars      | No            |

### Owner Endpoints

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| POST   | `/api/owner/change-role`    | Change user to owner    | Yes           |
| POST   | `/api/owner/add-car`        | Add new car             | Yes (Owner)   |
| GET    | `/api/owner/cars`           | Get owner's cars        | Yes (Owner)   |
| POST   | `/api/owner/toggle-car`     | Toggle car availability | Yes (Owner)   |
| POST   | `/api/owner/delete-car`     | Soft delete car         | Yes (Owner)   |
| DELETE | `/api/owner/delete-car/:id` | Permanently delete car  | Yes (Owner)   |
| GET    | `/api/owner/dashboard`      | Get dashboard data      | Yes (Owner)   |
| POST   | `/api/owner/update-image`   | Update profile image    | Yes (Owner)   |

### Booking Endpoints

| Method | Endpoint                           | Description            | Auth Required |
| ------ | ---------------------------------- | ---------------------- | ------------- |
| POST   | `/api/bookings/check-availability` | Check car availability | No            |
| POST   | `/api/bookings/create`             | Create new booking     | Yes           |
| GET    | `/api/bookings/user`               | Get user's bookings    | Yes           |
| GET    | `/api/bookings/owner`              | Get owner's bookings   | Yes (Owner)   |
| POST   | `/api/bookings/change-status`      | Update booking status  | Yes (Owner)   |

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured CORS for trusted origins
- **File Upload Validation** - Strict file type and size checks
- **Role-Based Access** - Middleware to protect owner-only routes
- **Error Sanitization** - Generic error messages to prevent information leakage

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Vikraman**

- GitHub: [@VIKRAMANR7](https://github.com/VIKRAMANR7)

## 🙏 Acknowledgments

- MongoDB for the robust database solution
- ImageKit for seamless image optimization
- The React and Node.js communities for excellent documentation

---

<div align="center">

**Built with ❤️ using the MERN Stack**

If you found this project helpful, please consider giving it a ⭐!

</div>

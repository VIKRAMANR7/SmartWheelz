# SmartWheelz

A full-stack car rental platform with booking management, owner dashboard, and JWT authentication.

## Live Demo

- Frontend: https://smartwheelz-frontend.onrender.com
- Backend: https://smartwheelz.onrender.com

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, React Router, Motion, Axios

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, ImageKit

## Features

- Browse and search cars by brand, model, category, and location
- Date-based availability checking
- User authentication with JWT
- Booking management for users
- Owner dashboard with analytics
- Car management (add, edit, toggle availability, delete)
- Image upload with ImageKit optimization
- Role-based access control (user/owner)

## System Architecture

```mermaid
flowchart TB
    subgraph Client
        React[React + TypeScript]
        Context[Context API]
        Router[React Router]
    end

    subgraph Server
        Express[Express API]
        JWT[JWT Auth]
        Multer[Multer Upload]
    end

    subgraph Database
        MongoDB[(MongoDB)]
    end

    subgraph External
        ImageKit[ImageKit CDN]
    end

    React --> Express
    Express --> MongoDB
    Express --> ImageKit
    ImageKit --> React
```

## Booking Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB

    User->>Client: Search (location, dates)
    Client->>API: POST /check-availability
    API->>DB: Query available cars
    DB-->>API: Available cars
    API-->>Client: Car list
    Client-->>User: Display results

    User->>Client: Select car & book
    Client->>API: POST /bookings/create
    API->>DB: Verify availability
    DB-->>API: Car available
    API->>DB: Create booking
    DB-->>API: Booking saved
    API-->>Client: Confirmation
    Client-->>User: Success message
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ CAR : owns
    CAR ||--o{ BOOKING : has

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        string image
    }

    CAR {
        ObjectId _id PK
        ObjectId owner FK
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
    }

    BOOKING {
        ObjectId _id PK
        ObjectId car FK
        ObjectId user FK
        ObjectId owner FK
        date pickupDate
        date returnDate
        number price
        string status
    }
```

## API Endpoints

### User

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/user/register | Register user |
| POST   | /api/user/login    | Login user    |
| GET    | /api/user/data     | Get user data |
| GET    | /api/user/cars     | Get all cars  |

### Owner

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | /api/owner/change-role    | Become owner         |
| POST   | /api/owner/add-car        | Add car              |
| GET    | /api/owner/cars           | Get owner cars       |
| POST   | /api/owner/toggle-car     | Toggle availability  |
| POST   | /api/owner/delete-car     | Soft delete car      |
| DELETE | /api/owner/delete-car/:id | Permanent delete     |
| GET    | /api/owner/dashboard      | Dashboard data       |
| POST   | /api/owner/update-image   | Update profile image |

### Booking

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| POST   | /api/bookings/check-availability | Check availability |
| POST   | /api/bookings/create             | Create booking     |
| GET    | /api/bookings/user               | User bookings      |
| GET    | /api/bookings/owner              | Owner bookings     |
| POST   | /api/bookings/change-status      | Update status      |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB
- ImageKit account

### Installation

```bash
git clone https://github.com/yourusername/smartwheelz.git
cd smartwheelz

cd server && pnpm install
cd ../client && pnpm install
```

### Environment Variables

**Server (.env)**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartwheelz
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_folder
```

**Client (.env)**

```
VITE_BASE_URL=http://localhost:5000
VITE_CURRENCY=₹
```

### Run Development

```bash
cd server && pnpm dev
cd client && pnpm dev
```

## Author

**Vikraman R** - [GitHub](https://github.com/VIKRAMANR7)

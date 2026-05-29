# 🚌 InterstateGo — Inter-State Bus Booking & Seat Selection Platform

> A full-stack web application for booking interstate bus tickets across Nigeria. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## 👥 Team 19

| Name | Matric Number |
|------|--------------|
| Iniubongabasi-Sunshine Afia | 20231046 |
| Anita Kingsley Emenyi | 20230161 |
| Abbas Arif | 20232068 |
| Muhammad Bashir | 20232291 |

---

## 🌟 Features

### Passengers
- Register and login with email verification
- Search Nigerian interstate routes by city and date
- View available buses with seat availability and amenities
- Visual seat map — pick exactly where you want to sit
- Simulated payment (card number, expiry, CVV)
- Receive booking confirmation email with reference code
- QR code ticket for park verification
- View booking history (upcoming, completed, cancelled)
- Cancel bookings with automatic refund calculation
  - Full refund if cancelled 24+ hours before departure
  - 50% refund if cancelled less than 24 hours before
- Leave reviews after completed trips
- Edit profile details

### Admin
- Full dashboard with revenue and bookings charts
- Manage all Nigerian interstate routes (add, edit, deactivate, delete)
- Manage buses (add, edit, deactivate, reset seats, delete)
- View and filter all bookings
- Cancel bookings on behalf of passengers (with reason)
- Mark trips as completed
- View and search all registered users

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- Recharts (charts)
- React Hot Toast (notifications)
- React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js (password hashing)
- Nodemailer (email sending)
- QRCode (ticket QR codes)

**Database:**
- MongoDB Atlas (cloud)

---

## 📁 Project Structure

```
bus-booking/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Route.js
│   │   ├── Bus.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── busRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Sidebar.js
    │   │   ├── Spinner.js
    │   │   ├── Skeleton.js
    │   │   ├── PrivateRoute.js
    │   │   └── AdminRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Homepage.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── VerifyEmail.js
    │   │   ├── SearchResults.js
    │   │   ├── SeatSelection.js
    │   │   ├── Booking.js
    │   │   ├── BookingHistory.js
    │   │   ├── BookingDetails.js
    │   │   ├── Profile.js
    │   │   ├── NotFound.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Routes.js
    │   │       ├── Buses.js
    │   │       ├── Bookings.js
    │   │       └── Users.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org) (v18 or higher)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com)

---

### 1. Clone or Download the Project

If you have Git:
```bash
git clone <repository-url>
cd bus-booking
```

Or just open the project folder in VS Code directly.

---

### 2. Set Up the Backend

Open a terminal in VS Code and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the following — **ask the project owner for the actual values**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=busBooking_super_secret_2025
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

Then start the backend:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected: ...
```

---

### 3. Set Up the Frontend

Open a **second terminal** in VS Code (click the + button in the terminal panel) and run:

```bash
cd frontend
npm install
npm start
```

The app will open automatically at:
```
http://localhost:3000
```

---

## 🔐 Admin Access

To access the admin dashboard, login with the admin account credentials (ask the project owner). Admin users are automatically redirected to `/admin` after login.

Admin dashboard is at:
```
http://localhost:3000/admin
```

---

## 🗺️ Available Routes

The platform covers these Nigerian interstate routes (both directions):

| Route | Distance | Duration | Base Price |
|-------|----------|----------|------------|
| Lagos ↔ Abuja | 755 km | 8h 30m | ₦12,000 |
| Lagos ↔ Port Harcourt | 540 km | 6h 30m | ₦9,000 |
| Lagos ↔ Calabar | 680 km | 8h | ₦11,000 |
| Lagos ↔ Uyo | 620 km | 7h 30m | ₦10,000 |
| Port Harcourt ↔ Abuja | 615 km | 7h 30m | ₦10,500 |
| Uyo ↔ Abuja | 700 km | 8h 30m | ₦11,500 |
| Calabar ↔ Abuja | 660 km | 8h | ₦11,000 |

---

## 🚌 Bus Types

| Type | Seats | Amenities | Price |
|------|-------|-----------|-------|
| Toyota Coaster | 30 seats | AC + USB | Base price + 30% |
| Toyota Hiace | 16 seats | AC only | Base price |

---

## 📧 Email Features

The platform sends emails for:
- Email verification after registration
- Booking confirmation with reference code
- Booking cancellation with refund details
- Password reset link

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new passenger |
| POST | /api/auth/login | Login |
| GET | /api/auth/verify-email/:token | Verify email |
| POST | /api/auth/forgot-password | Send reset link |
| PUT | /api/auth/reset-password/:token | Reset password |
| GET | /api/auth/me | Get profile |
| PUT | /api/auth/me | Update profile |
| GET | /api/auth/users | Get all users (admin) |

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/routes | Get all routes |
| GET | /api/routes/popular | Get popular routes |
| GET | /api/routes/:id | Get single route |
| POST | /api/routes | Add route (admin) |
| PUT | /api/routes/:id | Update route (admin) |
| PUT | /api/routes/:id/deactivate | Deactivate route (admin) |
| DELETE | /api/routes/:id | Delete route (admin) |

### Buses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/buses | Get all buses (admin) |
| GET | /api/buses/route/:routeId | Get buses for a route |
| GET | /api/buses/:id | Get single bus |
| POST | /api/buses | Add bus (admin) |
| PUT | /api/buses/:id | Update bus (admin) |
| PUT | /api/buses/:id/deactivate | Deactivate bus (admin) |
| PUT | /api/buses/:id/reset-seats | Reset seats (admin) |
| DELETE | /api/buses/:id | Delete bus (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my-bookings | Get my bookings |
| GET | /api/bookings/:id | Get booking details |
| PUT | /api/bookings/:id/cancel | Cancel booking |
| PUT | /api/bookings/:id/reschedule | Reschedule booking |
| GET | /api/bookings | Get all bookings (admin) |
| PUT | /api/bookings/:id/admin-cancel | Admin cancel booking |
| PUT | /api/bookings/:id/complete | Mark as completed (admin) |

---

## ⚠️ Important Notes

- This app uses **simulated payment** — no real money is charged
- Make sure your internet connection can reach MongoDB Atlas (school WiFi may block it — use mobile hotspot if needed)
- The `.env` file is **not included** in the project for security reasons — you must create it yourself with the correct values
- Never share your `.env` file or push it to GitHub

---

## 📄 License

This project was built for academic purposes as part of a MERN Stack Practical course.

© 2025 InterstateGo — Team 19

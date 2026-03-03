

# M1P13MEAN - E-Commerce Backend

A full-featured e-commerce backend API built with the MEAN stack (MongoDB, Express, Node.js) for the M1 Web Advanced course project.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)

## Features

- ✅ **User Authentication** - JWT-based authentication with bcryptjs password hashing
- ✅ **Role-Based Access Control** - Admin and user roles with middleware protection
- ✅ **Shop Management** - Create, update, and manage shops
- ✅ **Product Catalog** - Manage products with categories and filtering
- ✅ **Category Management** - Organize products by categories
- ✅ **Booking System** - Handle customer bookings with expiration services
- ✅ **Statistics & Analytics** - Track shop and product statistics
- ✅ **Image Management** - Upload images to Cloudinary
- ✅ **CORS Support** - Cross-origin resource sharing enabled
- ✅ **Scheduled Tasks** - Node-cron for automated tasks

## Tech Stack

- **Runtime** - Node.js
- **Framework** - Express.js v5.2.1
- **Database** - MongoDB with Mongoose v9.2.0
- **Authentication** - JWT (jsonwebtoken v9.0.3)
- **Password Hashing** - bcryptjs v3.0.3
- **File Upload** - Multer v2.0.2 with Cloudinary storage
- **Task Scheduling** - node-cron v4.2.1
- **Environment** - dotenv v17.2.4
- **Development** - nodemon v3.1.11

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Cloudinary account (for image uploads)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd m1p13mean-mitia-tolotra-back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Or install specific packages:
   ```bash
   npm install bcryptjs jsonwebtoken
   npm install cors 
   npm install node-cron
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mongodb://127.0.0.1:27017/m1p13mean-db
# Or for MongoDB Atlas:
# DATABASE_URL=url

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
```

## Project Structure

```
.
├── controllers/              # Route controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── shopController.js
│   └── statsController.js
├── models/                   # MongoDB schemas
│   ├── User.js
│   ├── Shop.js
│   ├── Product.js
│   ├── Category.js
│   └── Booking.js
├── routes/                   # Express route definitions
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── shopRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── statsRoutes.js
│   └── bookingRoutes.js
├── middleware/               # Custom middleware
│   ├── authMiddleware.js     # JWT verification
│   ├── adminMiddleware.js    # Admin role check
│   ├── roleMiddleware.js     # Role-based access control
│   └── multer-config.js      # File upload configuration
├── services/                 # Business logic services
│   └── expirationServices.js # Booking expiration handling
├── images/                   # Local image storage
├── server.js                 # Main application file
├── package.json              # Project dependencies
└── README.md                 # This file
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in .env)

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout

### Admin Routes (`/api/admin`)
- `GET /` - Get all admin data
- `DELETE /user/:id` - Delete a user (admin only)
- `PUT /user/:id` - Update user information (admin only)

### Shop Routes (`/api/shop`)
- `GET /` - Get all shops
- `GET /:id` - Get shop by ID
- `POST /` - Create a new shop
- `PUT /:id` - Update shop
- `DELETE /:id` - Delete shop

### Category Routes (`/api/category`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create a new category
- `PUT /:id` - Update category
- `DELETE /:id` - Delete category

### Product Routes (`/api/product`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `POST /` - Create a new product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

### Booking Routes (`/api/booking`)
- `GET /` - Get all bookings
- `GET /:id` - Get booking by ID
- `POST /` - Create a new booking
- `PUT /:id` - Update booking
- `DELETE /:id` - Delete booking

### Statistics Routes (`/api/stats`)
- `GET /` - Get application statistics

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication:

1. Users register/login via authentication endpoints
2. Upon successful login, a JWT token is issued
3. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Middleware Protection
- **Auth Middleware** - Verifies JWT token validity
- **Admin Middleware** - Restricts access to admin-only endpoints
- **Role Middleware** - Implements role-based access control

## Project Authors

- Mitia
- Tolotra

---

**Course:** M1 Web Advanced  
**Institution:** ITU

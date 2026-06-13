# Food Delivery Platform

A full-stack food delivery platform that connects Customers, Restaurants, and Delivery Partners through a real-time ordering and delivery system. The platform provides live order tracking, restaurant management, delivery assignment, notifications, and analytics dashboards.

## Overview

This project is designed to streamline the food ordering and delivery process by supporting three different user roles:

* Customer
* Restaurant Owner
* Delivery Partner

Customers can browse restaurants, place orders, and track deliveries in real time. Restaurants can manage their menus and orders, while delivery partners can accept nearby delivery requests and share their live location during deliveries.

## Features

### Customer Features

* User registration and authentication
* Browse restaurants and food items
* Search foods and restaurants
* Add items to cart
* Place food orders
* View order history
* Real-time order tracking
* Live delivery location tracking
* Receive order status updates

### Restaurant Features

* Restaurant registration and profile management
* Add, edit, and delete food items
* Manage menu inventory
* Receive incoming orders
* Accept or reject orders
* Update order status
* Track earnings and order statistics

### Delivery Partner Features

* Delivery partner registration and authentication
* Receive nearby delivery requests
* Accept delivery assignments
* Share live location
* Track completed deliveries
* View daily earnings and delivery statistics

### Real-Time Features

* Real-time notifications
* Live order status updates
* Live location tracking
* Delivery partner assignment
* Instant communication between system components

### Order Workflow

1. Customer places an order.
2. Restaurant receives the order.
3. Restaurant confirms and starts preparation.
4. Order status changes to "Preparing".
5. Available delivery partner receives notification.
6. Delivery partner accepts the order.
7. Order status changes to "Out for Delivery".
8. Customer tracks delivery in real time.
9. Delivery partner completes delivery.
10. Order status changes to "Delivered".

## System Architecture

```text
Customer
    │
    ▼
Frontend Application
    │
    ▼
Backend API Server
    │
 ┌──┼──────────────┐
 ▼  ▼              ▼
Database     Notification Service
 │
 ▼
Restaurant Dashboard
 │
 ▼
Delivery Partner Dashboard

Real-Time Communication
        │
        ▼
   WebSocket / Socket.IO
```

## Tech Stack

### Frontend

* React.js
* Next.js
* JavaScript
* TypeScript
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Real-Time Communication

* Socket.IO
* WebSockets

### Maps and Location Services

* Google Maps API / Mapbox

### Payments

* Stripe

### Deployment

* Vercel
* Cloud Services

## Screenshots

Add project screenshots here.

### Customer Dashboard

```text
Insert Screenshot
```

### Restaurant Dashboard

```text
Insert Screenshot
```

### Delivery Partner Dashboard

```text
Insert Screenshot
```

### Live Tracking System

```text
Insert Screenshot
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Akash504-ai/food-delivery-platform.git
```

### Navigate to Project

```bash
cd food-delivery-platform
```

### Install Dependencies

#### Frontend

```bash
cd Frontend
npm install
```

#### Backend

```bash
cd Backend
npm install
```

#### ML Service (Optional)

```bash
cd ml-service
npm install
```

### Configure Environment Variables

Create a `.env` file and add:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_key

GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Run Development Servers

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

## API Modules

### Authentication

* User Registration
* User Login
* JWT Authentication
* Role-Based Authorization

### Restaurant Management

* Create Restaurant
* Manage Menu
* Update Orders

### Customer Operations

* Cart Management
* Order Placement
* Order Tracking

### Delivery Operations

* Delivery Assignment
* Live Location Updates
* Earnings Management

## Database Design

### Collections

#### Users

```javascript
{
  _id,
  name,
  email,
  role,
  password
}
```

#### Restaurants

```javascript
{
  _id,
  ownerId,
  restaurantName,
  address,
  menu
}
```

#### Orders

```javascript
{
  _id,
  userId,
  restaurantId,
  deliveryPartnerId,
  items,
  totalAmount,
  status
}
```

#### Delivery Partners

```javascript
{
  _id,
  userId,
  currentLocation,
  earnings
}
```

## Future Improvements

* AI-based food recommendations
* Restaurant ratings and reviews
* Coupon and discount system
* In-app chat
* Push notifications
* Route optimization for delivery partners
* Multi-language support
* Advanced analytics dashboard

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Akash Santra**

GitHub: https://github.com/Akash504-ai

---

Built to provide a scalable and real-time food delivery experience for customers, restaurants, and delivery partners.

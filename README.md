# LS-FITNESS API

A RESTful API backend for a fitness and training platform built with Node.js, Express, and MongoDB.

## Overview

LS-FITNESS API provides backend services for a comprehensive fitness application:

| Feature                 | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Exercise Management** | Exercise library with video content via Vimeo integration       |
| **Training Plans**      | Customizable workout plans with progress tracking               |
| **Courses & Lessons**   | Educational content delivery with quizzes                       |
| **Nutrition Tracking**  | Meals database with nutritional calculations via Foodvisor API  |
| **User Management**     | Multi-role system (admin, sub-admin, LS-trainer, trainer, user) |
| **Real-time Chat**      | Private and group messaging via Socket.IO                       |
| **Authentication**      | JWT-based auth with Google and Facebook OAuth support           |
| **Payments**            | PayPal integration for transactions                             |

## Tech Stack

| Category       | Technologies                             |
| -------------- | ---------------------------------------- |
| Runtime        | Node.js                                  |
| Framework      | Express.js                               |
| Database       | MongoDB with Mongoose                    |
| Authentication | JWT, Passport.js (Google/Facebook OAuth) |
| Real-time      | Socket.IO                               |
| File Uploads   | Multer, Sharp                            |
| Video          | Vimeo API                                |
| Nutrition      | Foodvisor API                            |
| Payments       | PayPal                                   |
| Validation     | express-validator                        |

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for version)
- MongoDB instance

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Paula-Refaat/LS-FITNESS.git
   cd LS-FITNESS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `config.env` file in the root directory:

   ```env
   # Server
   PORT=8000
   NODE_ENV=development
   BASE_URL=http://localhost:8000

   # Database
   DB_URL= # MongoDB connection string

   # JWT
   JWT_SECRET_KEY= # JWT secret key
   JWT_EXPIRE_TIME=90d

   # Email (Gmail SMTP)
   EMAIL_USER= # Your Gmail email address
   EMAIL_PASSWORD= # Your Gmail password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_FROM= # Name of the sender


   # Nutrition API (Foodvisor)
   NUTRITION_API_KEY= # Your Foodvisor API key
   NUTRITION_URL=https://vision.foodvisor.io/api/1.0/en/analysis/

   # Vimeo
   VIMEO_ACCESS_TOKEN= # Your Vimeo access token
   VIMEO_API=https://api.vimeo.com/videos

   # PayPal
   PAYPAL_CLIENT_ID= # Your PayPal client ID
   PAYPAL_CLIENT_SECRET= # Your PayPal secret key
   PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com

   # Google OAuth
   GOOGLE_CLIENT_ID= # Your Google app ID
   GOOGLE_CLIENT_SECRET= # Your Google app secret
   GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

   # Facebook OAuth
   FACEBOOK_APP_ID= # Your Facebook app ID
   FACEBOOK_APP_SECRET= # Your Facebook app secret
   FACEBOOK_CALLBACK_URL=http://localhost:8000/api/v1/auth/facebook/callback

   # File Uploads
   ALLOWED_MIME_TYPES=image/jpeg|image/png|image/gif|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|video/mp4|video/mpeg|audio/mpeg|audio/wav|application/zip|application/x-zip-compressed|application/octet-stream|application/x-rar-compressed|application/x-tar|application/x-7z-compressed|text/plain|text/csv|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet


   ```

4. **Start the server**

   ```bash
   # Development (with nodemon)
   npm run start:dev

   # Production
   npm run start:prod
   ```

   The API runs on `http://localhost:8000` by default.

## Project Structure

```
LS-FITNESS/
├── config/          # Database configuration
├── middlewares/     # Express middlewares (auth, permissions, error handling)
├── models/          # Mongoose schemas
├── routes/          # API route definitions
│   └── apis/        # Individual route modules
├── services/        # Business logic layer
├── socket/          # Socket.IO implementation
├── uploads/         # Static file storage
├── utils/           # Helper utilities and validators
└── server.js        # Application entry point
```

## API Routes

All routes are prefixed with `/api/v1/`.

| Resource       | Endpoint         |
| -------------- | ---------------- |
| Authentication | `/auth`          |
| Users          | `/users`         |
| Exercises      | `/exercises`     |
| Body Parts     | `/bodyParts`     |
| Courses        | `/courses`       |
| Lessons        | `/lessons`       |
| Training Plans | `/trainingPlan`  |
| Meals          | `/meals`         |
| Chats          | `/chats`         |
| Messages       | `/messages`      |
| Notifications  | `/notifications` |
| Orders         | `/orders`        |

## Available Scripts

| Script                   | Description                      |
| ------------------------ | -------------------------------- |
| `npm run start:dev`      | Start with nodemon (development) |
| `npm run start:prod`     | Start in production mode         |
| `npm run update:package` | Update dependencies              |

## Real-time Features

Socket.IO is integrated for real-time messaging.

| Event            | Description                     |
| ---------------- | ------------------------------- |
| `addUser`        | Register user connection        |
| `joinRoom`       | Join a chat room                |
| `leaveRoom`      | Leave a chat room               |
| `sendMessage`    | Send private or group messages  |
| `toggleReaction` | Add or remove message reactions |

## Author

**Paula Refaat** — [@Paula-Refaat](https://github.com/Paula-Refaat)

## License

ISC License — see `package.json` for details.

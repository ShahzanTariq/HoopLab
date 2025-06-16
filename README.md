# HoopLab

A basketball training and workout management platform for creating and managing personalized training routines.

## Overview

HoopLab is a full-stack web application that allows users to browse basketball workouts, create custom training plans, and manage their fitness routines. This is a personal project built to demonstrate modern web development practices with React, Node.js, and AWS services.

## Features

- **Workout Library**: Browse basketball-specific workouts filtered by difficulty level and category
- **Custom Training Plans**: Create and manage personalized workout plans
- **User Authentication**: Secure login using OpenID Connect (OIDC)
- **Cloud Integration**: Data persistence with AWS DynamoDB
- **Contact System**: Feedback system with email notifications
- **Responsive Design**: Modern UI built with Mantine components

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Mantine UI Components
- React Router for navigation
- React OIDC Context for authentication

**Backend:**
- Node.js + Express + TypeScript
- AWS SDK v3 for DynamoDB
- Nodemailer for email functionality

**Database:**
- AWS DynamoDB

## Project Structure

```
HoopLab/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # UI components (header, tables, selectors)
│   │   ├── pages/      # Main pages (workout, profile, contact)
│   │   └── styles/     # CSS modules
├── backend/            # Express API server
│   ├── src/
│   │   ├── config/     # DynamoDB configuration
│   │   ├── routes/     # API endpoints
│   │   └── server.ts   # Main server
└── package.json        # Monorepo scripts
```

## Development Setup

**Note:** This project requires AWS credentials and pre-populated DynamoDB tables. It's designed as a portfolio piece rather than a plug-and-play application.

### Required Environment Variables
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
DYNAMODB_TABLE=workouts-table
DYNAMODB_TABLE_PLANS=plans-table

# Email (Optional)
EMAIL_USER=your-gmail
EMAIL_PASS=app-password
RECEIVER_EMAIL=feedback-email
```

### Scripts
```bash
npm run dev        # Run both frontend and backend
npm start          # Frontend only (port 3000)
npm run server     # Backend only (port 5000)
npm run build      # Production build
```

## Key Components

- **Workout Browser**: Filter workouts by level (Beginner→Professional) and category
- **Plan Builder**: Add/remove workouts from custom training plans
- **User Profiles**: OIDC-authenticated user management
- **Contact Form**: Email feedback system

## Project Status

This is a personal portfolio project demonstrating:
- Full-stack TypeScript development
- React with modern hooks and context
- RESTful API design
- AWS cloud integration
- Authentication implementation

---

*Note: This project requires AWS setup and is not intended for direct cloning/running by others due to external dependencies and data requirements.*
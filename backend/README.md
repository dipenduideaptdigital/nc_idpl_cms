````md
# IDPL CMS Engine - Backend Architecture & Authentication System

## Project Overview

This backend is being developed using:

- Node.js
- Express.js
- MySQL
- Prisma ORM

The backend follows a modular architecture with enterprise-focused authentication, authorization, RBAC, session management, and security practices.

---

# Tech Stack

## Backend Framework
- Express.js

## Database
- MySQL

## ORM
- Prisma ORM

## Authentication
- JWT Access Token
- Refresh Token Strategy

## Validation
- Zod

## Logging
- Pino

## Security
- Helmet
- HPP
- CORS
- Rate Limiting
- HttpOnly Cookies

---

# Backend Architecture

The backend uses a:

- Modular Feature-Based Architecture
- Layered Separation Pattern

Structure:

```bash
src/
│
├── config/
├── modules/
├── routes/
├── shared/
├── jobs/
├── database/
└── server.js
````

---

# Current Completed Modules

## Core Infrastructure

* Express App Setup
* Global Middleware Setup
* Centralized Error Handling
* Logger Configuration
* Environment Configuration
* API Versioning Structure
* Graceful Shutdown Handling

---

# Database Architecture

## Prisma Models Implemented

### User

Handles:

* authentication
* system roles
* functional roles
* account status
* refresh tokens
* password reset tokens

### SystemRole

Static system hierarchy:

* SUPER_ADMIN
* ADMIN
* USER

### FunctionalRole

Dynamic business/admin roles:

* SEO_MANAGER
* DESIGNER
* CONTENT_MANAGER
* HR
* etc.

### Permission

Granular permission system.

Permission naming convention planned:

```text
module.action
```

Example:

```text
blog.create
blog.update
project.delete
```

### FunctionalRolePermission

Many-to-many relation:

* functional roles
* permissions

### UserFunctionalRole

Many-to-many relation:

* users
* functional roles

### RefreshToken

Handles:

* multi-session login
* logout
* logout all devices
* token revocation

### PasswordResetToken

Prepared for future password reset flow.

### AdminInvitation

Prepared for:

* invite-based admin onboarding
* admin activation flow
* secure invite acceptance

---

# Database Optimizations Added

## Indexes

### RefreshToken

Indexes added:

* userId
* expiresAt
* revokedAt

### PasswordResetToken

Indexes added:

* expiresAt

### AdminInvitation

Indexes added:

* email
* expiresAt

Purpose:

* faster token lookup
* cleanup optimization
* scalable query performance

---

# Authentication System

## Implemented Authentication Features

### User Registration

* email normalization
* password hashing
* duplicate email prevention
* default USER role assignment

### User Login

* email normalization
* account status validation
* secure password comparison
* JWT access token generation
* refresh token generation
* hashed refresh token storage

### Admin Login

Separate admin login endpoint:

```text
/api/v1/auth/admin-login
```

Supports:

* stricter rate limiting
* future 2FA integration
* admin isolation
* WAF/Nginx security policies

### Refresh Token System

Implemented:

* refresh token verification
* hashed token lookup
* revoked token detection
* expired token validation
* token reuse detection

### Logout

Implemented:

* current device logout
* logout all devices

### Session Security

Implemented:

* HttpOnly cookies
* refresh token hashing
* token revocation
* session invalidation

---

# Security Architecture

## Password Security

* bcrypt hashing
* salt rounds configured

## Refresh Token Security

Refresh tokens are NOT stored raw in database.

Stored as:

```text
SHA256 hashed token
```

Benefits:

* protects sessions during DB leaks
* production-grade token handling

---

# Account Status Handling

Supported statuses:

* ACTIVE
* INACTIVE
* SUSPENDED
* PENDING

Authentication checks implemented for all states.

---

# Authentication Middleware

Implemented:

* JWT verification
* user extraction
* account status validation
* protected route handling

---

# Authorization System

Implemented:

* system role authorization
* permission-based authorization
* SUPER_ADMIN bypass logic

---

# Validation System

Validation implemented using:

* Zod

Current validations:

* register validation
* login validation

---

# API Security

## Rate Limiting

Implemented separate limiters for:

* user login
* admin login
* refresh token endpoint

Purpose:

* brute force protection
* admin endpoint hardening

---

# Cookie Strategy

Centralized cookie configuration implemented.

Files:

```text
src/config/cookies.js
```

Supports:

* environment-based secure cookies
* sameSite handling
* centralized cookie management

---

# Sanitization Strategy

Implemented:

```text
sanitizeUser()
```

Uses:

* whitelist exposure strategy

Sensitive fields removed from API responses:

* password
* refresh token data
* nested permission graph

---

# Database Transactions

Transactional login flow implemented using:

```text
prisma.$transaction()
```

Ensures:

* refresh token creation
* login timestamp update

occur atomically.

---

# Token Cleanup Job

Implemented cleanup job:

```text
cleanupExpiredTokens()
```

Handles:

* expired refresh tokens
* revoked old tokens

Purpose:

* prevent table bloat
* maintain session hygiene

---

# Seed System

Implemented:

* system roles seeding
* super admin seeding

System roles:

* SUPER_ADMIN
* ADMIN
* USER

Super admin created through environment variables.

---

# API Endpoints Implemented

## Auth Routes

### User Registration

```http
POST /api/v1/auth/register
```

### User Login

```http
POST /api/v1/auth/login
```

### Admin Login

```http
POST /api/v1/auth/admin-login
```

### Refresh Access Token

```http
POST /api/v1/auth/refresh-token
```

### Logout Current Device

```http
POST /api/v1/auth/logout
```

### Logout All Devices

```http
POST /api/v1/auth/logout-all
```

---

# Production-Level Concerns Already Addressed

Implemented:

* modular architecture
* RBAC foundation
* hashed refresh tokens
* token reuse detection
* transactional writes
* centralized cookie config
* rate limiting
* email normalization
* cleanup jobs
* whitelist sanitization
* system role separation
* permission-ready schema
* admin isolation
* scalable Prisma schema

---

# Pending / Planned Features

## Authentication Hardening

* refresh token rotation
* device fingerprinting
* suspicious login detection

## Admin Invitation System

* invite admin
* invite expiration
* secure onboarding
* invitation resend
* invitation invalidation

## Password Management

* forgot password
* reset password
* email verification

## Audit System

* login audit logs
* admin action tracking
* permission change tracking

## Infrastructure

* Redis integration
* distributed rate limiting
* queue workers
* AWS deployment setup

---

# Current Backend Status

The backend foundation is now ready for:

* enterprise authentication
* RBAC expansion
* admin management
* CMS module development
* secure session handling
* scalable feature implementation

```
```

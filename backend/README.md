# IDPL CMS Engine - Backend Architecture & Authentication System

## Project Overview

IDPL CMS Engine is being developed as a scalable, enterprise-grade CMS backend architecture using:

- Node.js
- Express.js
- MySQL
- Prisma ORM

The system follows a modular, security-focused architecture designed for:

- enterprise authentication
- RBAC authorization
- secure session management
- admin isolation
- scalable CMS expansion
- future microservice readiness

---

# Tech Stack

## Backend Framework
- Express.js

## Runtime
- Node.js

## Database
- MySQL

## ORM
- Prisma ORM

## Validation
- Zod

## Authentication
- JWT Access Tokens
- Refresh Token Strategy

## Password Hashing
- bcrypt

## Logging
- Pino

## Email Service
- Nodemailer

## Security
- Helmet
- HPP
- CORS
- Rate Limiting
- HttpOnly Cookies

---

# Backend Architecture

The backend uses:

- Modular Feature-Based Architecture
- Layered Service Architecture
- Separation of Concerns Pattern

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
```

---

# Architectural Principles

The backend is designed around:

- scalability
- maintainability
- security-first development
- modular domain separation
- centralized validation
- reusable business logic
- production-grade authentication practices

---

# Current Completed Modules

# Core Infrastructure

Implemented:

- Express App Setup
- Global Middleware Setup
- Centralized Error Handling
- Logger Configuration
- Environment Configuration
- API Versioning Structure
- Graceful Shutdown Handling
- Request Validation Middleware
- Modular Route Mounting

---

# Database Architecture

## Prisma Models Implemented

---

## User

Handles:

- authentication
- account lifecycle
- system roles
- functional roles
- profile management
- session management
- password reset management

---

## SystemRole

Static authorization hierarchy:

```text
SUPER_ADMIN
ADMIN
USER
```

---

## FunctionalRole

Business-level dynamic roles.

Examples:

```text
SEO_MANAGER
CONTENT_MANAGER
PRODUCT_MANAGER
HR_MANAGER
DESIGNER
```

---

## Permission

Granular permission layer.

Permission naming convention:

```text
module.action
```

Examples:

```text
blog.create
blog.update
blog.delete
project.manage
users.invite
```

---

## FunctionalRolePermission

Many-to-many relation between:

- functional roles
- permissions

---

## UserFunctionalRole

Many-to-many relation between:

- users
- functional roles

---

## RefreshToken

Handles:

- multi-device sessions
- logout
- logout all devices
- token revocation
- session invalidation

---

## PasswordResetToken

Handles:

- secure password reset flow
- token expiration
- token invalidation
- reset cooldown protection

---

## AdminInvitation

Prepared for:

- invite-based admin onboarding
- secure admin registration
- invitation expiration
- role pre-assignment
- future audit tracking

---

# Database Optimizations

## Added Indexes

### RefreshToken

Indexes:

- userId
- expiresAt
- revokedAt

Purpose:

- faster token lookup
- scalable revocation queries
- cleanup optimization

---

### PasswordResetToken

Indexes:

- expiresAt
- usedAt
- userId + createdAt

Purpose:

- cooldown checks
- reset lookup performance
- cleanup efficiency

---

### AdminInvitation

Indexes:

- email
- expiresAt

Purpose:

- invitation lookup optimization
- expiration cleanup

---

# Authentication System

# Implemented Authentication Features

---

## User Registration

Implemented:

- email normalization
- duplicate email prevention
- password hashing
- default USER role assignment
- transactional-safe creation flow

Features:

- normalized email storage
- strong password validation
- secure response sanitization

---

## User Login

Implemented:

- email normalization
- account status validation
- secure password comparison
- JWT access token generation
- refresh token generation
- hashed refresh token storage
- login timestamp update

Security Features:

- invalid credential protection
- suspended account blocking
- inactive account blocking

---

## Admin Login

Separate admin login endpoint:

```http
POST /api/v1/auth/admin-login
```

Purpose:

- admin isolation
- stricter rate limiting
- future MFA support
- future WAF/Nginx isolation policies

---

## Refresh Token System

Implemented:

- refresh token verification
- hashed token lookup
- revoked token validation
- expiration validation
- token reuse detection
- session invalidation

Security Features:

- hashed token persistence
- reuse attack detection
- forced session revocation

---

## Logout System

Implemented:

### Current Device Logout

```http
POST /api/v1/auth/logout
```

### Logout All Devices

```http
POST /api/v1/auth/logout-all
```

Features:

- token revocation
- cookie clearing
- session invalidation

---

# Password Management System

Implemented:

---

## Forgot Password

```http
POST /api/v1/auth/forgot-password
```

Features:

- secure token generation
- hashed reset token storage
- email enumeration protection
- cooldown protection
- non-blocking email sending

---

## Reset Password

```http
POST /api/v1/auth/reset-password
```

Features:

- token expiration validation
- token usage invalidation
- password reuse prevention
- session revocation
- transactional reset flow

---

## Change Password

```http
PATCH /api/v1/auth/change-password
```

Features:

- current password verification
- password reuse prevention
- all-session revocation
- active reset token invalidation

Security Features:

- transactional security updates
- forced re-authentication
- account status validation

---

# Session Management

Implemented:

- multi-session login support
- refresh token revocation
- logout all devices
- token expiration validation
- reuse attack detection
- secure cookie strategy

---

# Cookie Security

Centralized cookie management implemented.

File:

```text
src/config/cookies.js
```

Supports:

- HttpOnly cookies
- environment-aware secure cookies
- SameSite handling
- centralized configuration

---

# Security Architecture

# Password Security

Implemented:

- bcrypt hashing
- strong password policy
- password reuse prevention

Password Rules:

- minimum length
- uppercase required
- lowercase required
- numeric required
- special character required

---

# Refresh Token Security

Refresh tokens are NEVER stored raw.

Stored as:

```text
SHA256 hashed token
```

Benefits:

- database leak protection
- session security hardening
- enterprise-grade token handling

---

# Input Validation System

Validation implemented using:

- Zod

Current validations:

- registration
- login
- forgot password
- reset password
- change password
- profile update
- admin user management

---

# Email Normalization Strategy

Implemented at:

- validation layer
- service layer

Normalization includes:

- trim()
- lowercase()

Benefits:

- duplicate prevention
- login consistency
- query stability

---

# Sanitization Strategy

Implemented:

```text
sanitizeUser()
serializeProfile()
```

Uses:

- whitelist response strategy

Sensitive fields removed:

- password
- refresh tokens
- token hashes
- nested permission graph

---

# Profile Management System

Implemented:

---

## Get Current Profile

```http
GET /api/v1/users/me
```

Features:

- authenticated access
- safe profile serialization
- account status validation

---

## Update Current Profile

```http
PATCH /api/v1/users/me
```

Supported fields:

- name
- avatar

Security Features:

- allow-list updates
- URL validation
- normalization
- no-op update detection
- strict schema validation

---

# Authorization System

# RBAC Foundation Implemented

Implemented:

- system role authorization
- hierarchy validation
- functional role architecture
- permission-ready schema

---

## System Role Hierarchy

```text
SUPER_ADMIN
ADMIN
USER
```

---

## Hierarchy Protection

Implemented protections:

- SUPER_ADMIN protection
- self-role modification prevention
- self-suspension prevention
- admin hierarchy enforcement

---

# Admin User Management

Implemented:

---

## Update User Status

```http
PATCH /api/v1/admin/users/:id/status
```

Features:

- hierarchy validation
- self-lock prevention
- session revocation on suspension/deactivation

---

## Update User Role

```http
PATCH /api/v1/admin/users/:id/role
```

Features:

- hierarchy validation
- role assignment restrictions
- forced session invalidation

Note:

This endpoint will later be replaced/refactored into an invitation-based admin onboarding system.

---

# API Security

# Rate Limiting

Separate limiters implemented for:

- user login
- admin login
- refresh token endpoint
- sensitive account operations

Purpose:

- brute-force protection
- endpoint hardening
- abuse prevention

---

# Database Transactions

Implemented transactional flows using:

```js
prisma.$transaction()
```

Used for:

- login session creation
- password reset flows
- password changes
- session revocation

Purpose:

- atomic consistency
- rollback safety
- production reliability

---

# Token Cleanup Jobs

Implemented:

```text
cleanupExpiredTokens()
```

Handles:

- expired refresh tokens
- revoked stale tokens

Purpose:

- prevent table bloat
- maintain session hygiene

---

# Seed System

Implemented:

- system role seeding
- super admin seeding

Roles seeded:

```text
SUPER_ADMIN
ADMIN
USER
```

Super admin created from environment variables.

---

# API Endpoints Implemented

# Auth Routes

## Registration

```http
POST /api/v1/auth/register
```

## User Login

```http
POST /api/v1/auth/login
```

## Admin Login

```http
POST /api/v1/auth/admin-login
```

## Refresh Token

```http
POST /api/v1/auth/refresh-token
```

## Forgot Password

```http
POST /api/v1/auth/forgot-password
```

## Reset Password

```http
POST /api/v1/auth/reset-password
```

## Change Password

```http
PATCH /api/v1/auth/change-password
```

## Logout

```http
POST /api/v1/auth/logout
```

## Logout All Devices

```http
POST /api/v1/auth/logout-all
```

---

# User Routes

## Get Current Profile

```http
GET /api/v1/users/me
```

## Update Current Profile

```http
PATCH /api/v1/users/me
```

---

# Admin User Management Routes

## Update User Status

```http
PATCH /api/v1/admin/users/:id/status
```

## Update User Role

```http
PATCH /api/v1/admin/users/:id/role
```

---

# Production-Level Concerns Already Addressed

Implemented:

- modular architecture
- layered architecture
- RBAC foundation
- hashed refresh tokens
- token reuse detection
- transactional writes
- centralized cookie config
- rate limiting
- email normalization
- cleanup jobs
- whitelist sanitization
- admin isolation
- scalable Prisma schema
- hierarchy protection
- session revocation strategies
- secure password reset flow
- profile sanitization
- strict validation system

---

# Planned / Upcoming Features

# Enterprise Admin Invitation System

Planned:

- invite-based admin onboarding
- secure invitation acceptance
- invitation expiration
- invitation invalidation
- invitation resend
- pre-assigned admin permissions

---

# Permission-Based Authorization

Planned middleware:

```js
authorizePermissions("blog.create")
```

---

# Audit Logging System

Planned tracking:

- login events
- admin actions
- role changes
- permission changes
- invitation activity
- account suspension activity

---

# Authentication Hardening

Planned:

- refresh token rotation
- device fingerprinting
- suspicious login detection
- MFA/TOTP support

---

# Infrastructure Improvements

Planned:

- Redis integration
- distributed rate limiting
- queue workers
- background email queues
- AWS deployment setup
- Dockerized deployment
- CI/CD pipeline

---

# Current Backend Status

The backend foundation is now production-oriented and ready for:

- enterprise authentication
- RBAC expansion
- CMS module development
- admin management
- secure session handling
- scalable feature implementation
- future permission-based authorization

# SyncSpace

> An offline-first file synchronization and collaboration platform designed to explore real-world backend engineering, distributed systems, synchronization, and conflict resolution.

## Overview

**SyncSpace** is a full-stack file management and synchronization platform inspired by the engineering challenges behind modern cloud storage systems.

The project focuses on more than simply uploading and downloading files. Its main goal is to explore how applications handle **offline changes, synchronization, conflicts, real-time updates, authentication, permissions, background processing, and reliable data storage**.

Users will be able to manage files and folders, share resources with other users, access previous file versions, and continue working when their device is temporarily offline.

When the connection is restored, SyncSpace will synchronize local changes with the server and handle potential conflicts.

---

## Why I Built This

Many beginner projects focus primarily on CRUD operations.

I wanted to build something that would allow me to understand the engineering problems that appear in larger software systems, particularly:

* How offline applications store local changes
* How local operations can be synchronized with a server
* How synchronization conflicts can be detected
* How conflicting changes can be resolved
* How to make API operations reliable and idempotent
* How real-time updates can be delivered to multiple clients
* How background jobs and retries work
* How databases should be structured for a growing application
* How authentication differs from authorization
* How to test and deploy a production-style application

SyncSpace is therefore both a portfolio project and a practical exploration of distributed application design.

---

## Core Features

### Authentication

* User registration
* User login
* Secure password hashing
* Authentication middleware
* Protected API routes

### File & Folder Management

* Create folders
* Nested folder structure
* Upload files
* Download files
* Rename files
* Move files
* Delete files
* File metadata management

### File Versioning

SyncSpace will maintain previous versions of files so users can:

* View file versions
* Track changes
* Restore previous versions

### Search

Users will be able to search their files and folders using indexed database queries.

### Sharing & Permissions

Users will be able to share files and folders with other users using permission-based access.

The authorization system will distinguish between:

* Resource ownership
* Shared access
* Read permissions
* Write permissions

### Activity History

Important actions will be recorded so users can understand what happened to their files.

Examples include:

* File uploaded
* File renamed
* File moved
* File deleted
* File shared
* Version restored

---

# Offline-First Synchronization

The main engineering feature of SyncSpace is its **offline-first synchronization system**.

When a user loses their internet connection, the application should still allow supported operations to continue locally.

Instead of immediately sending every operation to the server, the client will maintain a local operation queue.

For example:

```text
User goes offline
       ↓
Rename file
       ↓
Move file
       ↓
Create folder
       ↓
Operations stored locally
       ↓
Internet connection restored
       ↓
Sync queue processed
       ↓
Server validates operations
       ↓
Changes synchronized
```

The synchronization system will be designed to handle situations such as:

* Temporary network failure
* Reconnecting after being offline
* Duplicate requests
* Failed synchronization attempts
* Concurrent modifications
* Conflicting file versions

---

## Conflict Resolution

Offline systems introduce an important problem:

> What happens when two clients modify the same resource while they are disconnected?

SyncSpace will detect conflicting changes using version information and synchronization metadata.

Depending on the type of conflict, the system may:

* Automatically resolve the conflict
* Preserve both versions
* Create a conflict copy
* Ask the user to choose which version to keep

The goal is not to reproduce the complexity of production systems such as Dropbox.

Instead, this project focuses on understanding and implementing a clear, explainable synchronization strategy.

---

# Architecture

The initial architecture is:

```text
                   ┌─────────────────────┐
                   │      React Client   │
                   │   TypeScript + Vite │
                   └──────────┬──────────┘
                              │
                     REST / WebSocket
                              │
                              ▼
                   ┌─────────────────────┐
                   │    Node.js API      │
                   │ Express + TypeScript │
                   └──────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
      ┌────────────┐   ┌────────────┐   ┌──────────────┐
      │ PostgreSQL │   │   Redis    │   │ Object/File  │
      │  Database  │   │   Cache    │   │   Storage    │
      └────────────┘   └────────────┘   └──────────────┘
                              │
                              ▼
                     Background Workers
```

The architecture will evolve as additional features are implemented.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* IndexedDB
* WebSocket client

## Backend

* Node.js
* TypeScript
* Express.js
* REST APIs
* WebSockets

## Database

* PostgreSQL

## Caching & Infrastructure

* Redis
* Docker
* Background workers
* Job queues

## Development

* Git
* GitHub
* ESLint
* Testing framework
* API testing tools

---

# Database Design

The initial database will contain the following core entities:

```text
Users
  │
  ├── Folders
  │      │
  │      └── Files
  │             │
  │             └── File Versions
  │
  ├── Shares
  │
  └── Activities
```

Planned tables include:

### Users

Stores account information.

### Folders

Stores folder hierarchy and ownership.

Example:

```text
My Drive
├── Projects
│   ├── SyncSpace
│   └── Portfolio
│
├── Documents
└── Images
```

### Files

Stores file metadata and relationships with folders.

### File Versions

Stores information about previous versions of files.

### Shares

Stores sharing relationships and permissions.

### Sync Operations

Stores synchronization operations that need to be processed or tracked.

### Activities

Stores important user and file activity.

---

# API

The backend will expose REST APIs for core operations.

Example endpoints:

```text
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login

GET    /api/files
POST   /api/files
GET    /api/files/:id
PATCH  /api/files/:id
DELETE /api/files/:id

POST   /api/files/:id/share
GET    /api/files/:id/versions

GET    /api/folders
POST   /api/folders
PATCH  /api/folders/:id
DELETE /api/folders/:id

POST   /api/sync
GET    /api/sync/status
```

The API will evolve as the project develops.

---

# Project Structure

The planned project structure is:

```text
syncspace/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── server.ts
│   │
│   └── ...
│
├── README.md
└── .gitignore
```

---

# Reliability & Engineering Goals

SyncSpace is designed to explore several real-world engineering concepts.

### Idempotency

Synchronization requests should be designed so that retrying an operation does not accidentally perform the same action multiple times.

### Retry Handling

Temporary failures should be retried safely rather than immediately losing an operation.

### Validation

The server will validate incoming requests instead of trusting the client.

### Authentication vs Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Both will be implemented separately.

### Rate Limiting

API endpoints will eventually use rate limiting to reduce abuse and excessive requests.

### Database Indexing

Frequently queried fields will be indexed and measured to understand their impact on query performance.

---

# Testing

Testing will cover multiple layers of the application.

Planned tests include:

* Unit tests
* API integration tests
* Authentication tests
* Permission tests
* Synchronization tests
* Conflict resolution tests
* Offline/online scenarios
* Duplicate request handling
* Failure and retry scenarios
* End-to-end tests

A particularly important part of testing will be simulating unreliable networks.

Example:

```text
Client
  ↓
Request
  ↓
Network failure
  ↓
Operation remains queued
  ↓
Connection restored
  ↓
Retry
  ↓
Server processes operation
```

---

# Security

Security considerations include:

* Password hashing
* Protected API routes
* Authentication tokens
* Resource ownership validation
* Authorization checks
* Input validation
* Rate limiting
* Secure environment variables
* Protection against unauthorized file access

Sensitive credentials will never be committed to the repository.

---

# Deployment

The project will eventually be containerized using Docker.

Planned deployment architecture:

```text
                     Internet
                        │
                        ▼
                 ┌──────────────┐
                 │   Frontend   │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   API Server │
                 └──────┬───────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
        PostgreSQL    Redis    File Storage
```

The final deployment platform will be selected based on cost, simplicity, and project requirements.

---

# Development Roadmap

## Phase 1 — Foundation

* [ ] Repository setup
* [ ] React + TypeScript client
* [ ] Node.js + Express API
* [ ] PostgreSQL setup
* [ ] Health-check endpoint
* [ ] Initial database schema

## Phase 2 — File Management

* [ ] Authentication
* [ ] Dashboard
* [ ] Folder management
* [ ] File upload
* [ ] File download
* [ ] Rename
* [ ] Move
* [ ] Delete

## Phase 3 — Collaboration

* [ ] File versions
* [ ] Version restoration
* [ ] Search
* [ ] Sharing
* [ ] Permissions
* [ ] Activity history

## Phase 4 — Offline Synchronization

* [ ] IndexedDB storage
* [ ] Local operation queue
* [ ] Offline detection
* [ ] Synchronization engine
* [ ] Retry handling
* [ ] Conflict detection
* [ ] Conflict resolution

## Phase 5 — Real-Time & Background Processing

* [ ] WebSocket updates
* [ ] Background jobs
* [ ] Job retries
* [ ] Idempotent operations
* [ ] Redis integration

## Phase 6 — Production Readiness

* [ ] Security improvements
* [ ] Unit tests
* [ ] Integration tests
* [ ] End-to-end tests
* [ ] Docker
* [ ] Deployment
* [ ] Performance testing
* [ ] Documentation

---

# What I Want to Learn

Through this project, I want to strengthen my understanding of:

* Full-stack software engineering
* Backend architecture
* REST API design
* Database design
* PostgreSQL
* Redis
* WebSockets
* Distributed systems concepts
* Offline-first applications
* Synchronization algorithms
* Conflict resolution
* Background processing
* Testing
* Docker
* Deployment
* System design
* Production debugging

---

# Project Status

🚧 **Currently in development**

This project is being built incrementally, with an emphasis on understanding the engineering decisions behind each feature rather than simply completing a feature checklist.

---

# Author

Built as a software engineering portfolio project to explore production-oriented full-stack development and distributed systems concepts.

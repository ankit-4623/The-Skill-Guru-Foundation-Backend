# Notes API

A simple RESTful API for managing notes built with Express.js, TypeScript, MongoDB, and Redis.

## Features

- ✅ Create, Read, Update notes
- ✅ Search notes by title or content
- ✅ Rate limiting using Redis (5 requests per minute for note creation)
- ✅ Input validation and sanitization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Mongoose)
- **Rate Limiting**: Redis (Upstash)

## Prerequisites

Before running this project, make sure you have the following:
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for database)
- [Upstash](https://upstash.com/) account (for Redis rate limiting)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "The Skill Guru Foundation"
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_atlas_connection_string
   REDIS_URL=your_upstash_redis_url
   ```

   > ⚠️ **IMPORTANT:** You must add your own MongoDB Atlas connection string and Upstash Redis URL before running the application. The app will not start without valid database connections.

   **How to get the URLs:**
   - **MongoDB Atlas:** Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), then go to "Connect" → "Connect your application" to get your connection string.
   - **Upstash Redis:** Create a Redis database at [Upstash Console](https://console.upstash.com/), then copy the Redis URL from the database details page.

4. **Start the server**
   ```bash
   pnpm start
   ```

## API Endpoints

Base URL: `http://localhost:<PORT>/api/v1`

### Notes

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| GET    | `/notes`        | Get all notes           |
| POST   | `/notes`        | Create a new note       |
| PUT    | `/notes/:id`    | Update an existing note |
| GET    | `/notes/search` | Search notes by query   |

---

### 1. Get All Notes

**Endpoint:** `GET /api/v1/notes`

**Response:**

```json
{
  "notes": [
    {
      "_id": "64abc123...",
      "title": "My Note",
      "content": "This is my note content",
      "createdAt": "2026-02-04T10:00:00.000Z",
      "updatedAt": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create a Note

**Endpoint:** `POST /api/v1/notes`

**Request Body:**

```json
{
  "title": "My New Note",
  "content": "This is the content of my note"
}
```

**Success Response (201):**

```json
{
  "message": "Note created",
  "note": {
    "title": "My New Note",
    "content": "This is the content of my note"
  }
}
```

**Error Responses:**

- `400` - Title and content are required / must be strings / cannot be empty
- `429` - Rate limit exceeded (max 5 notes per minute per IP)

---

### 3. Update a Note

**Endpoint:** `PUT /api/v1/notes/:id`

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Success Response (200):**

```json
{
  "message": "Note updated",
  "note": {
    "_id": "64abc123...",
    "title": "Updated Title",
    "content": "Updated content",
    "createdAt": "2026-02-04T10:00:00.000Z",
    "updatedAt": "2026-02-04T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Title and content cannot be empty strings
- `404` - Note not found

---

### 4. Search Notes

**Endpoint:** `GET /api/v1/notes/search?q=<search_query>`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|--------|----------|---------------------------------|
| `q` | string | Yes | Search term for title or content |

**Example:** `GET /api/v1/notes/search?q=meeting`

**Success Response (200):**

```json
{
  "notes": [
    {
      "_id": "64abc123...",
      "title": "Meeting Notes",
      "content": "Discussed project timeline",
      "createdAt": "2026-02-04T10:00:00.000Z",
      "updatedAt": "2026-02-04T10:00:00.000Z"
    }
  ]
}
```

**Error Response:**

- `400` - Search query cannot be empty

---

## Rate Limiting

The API implements rate limiting for note creation using **Upstash Redis**:

- **Limit:** 5 notes per minute per IP address
- **Window:** 60 seconds
- **Response when exceeded:** `429 Too Many Requests`
- **Storage:** Upstash Redis (serverless Redis)

## Project Structure

```
src/
├── index.ts              # Application entry point
├── config/
│   ├── db.ts             # MongoDB connection
│   └── TryCatch.ts       # Async error handler wrapper
├── controllers/
│   └── noteControllers.ts # Note CRUD logic
├── models/
│   └── notemodel.ts      # Mongoose Note schema
└── routes/
    └── noteRoute.ts      # API route definitions
```

## Error Handling

All endpoints are wrapped with a `TryCatch` utility that handles async errors gracefully. Standard HTTP status codes are used:

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Created               |
| 400         | Bad Request           |
| 404         | Not Found             |
| 429         | Too Many Requests     |
| 500         | Internal Server Error |

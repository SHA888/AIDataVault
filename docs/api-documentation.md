# AIDataVault API Documentation

This document provides details about the AIDataVault API endpoints. The base URL for the API when running locally via Docker is `http://localhost:3001/api` (assuming the routers are mounted under `/api`).

## Table of Contents
1. [Authentication Endpoints](#1-authentication-endpoints)
    - [POST /auth/register](#post-authregister)
    - [POST /auth/login](#post-authlogin)
2. [User Endpoints](#2-user-endpoints)
    - [GET /users/profile](#get-usersprofile)

---

## 1. Authentication Endpoints

These endpoints handle user registration and login.

### POST /auth/register

Register a new user.

-   **Method:** `POST`
-   **Path:** `/auth/register` (e.g., `http://localhost:3001/api/auth/register`)
-   **Description:** Creates a new user account.
-   **Request Body:** `application/json`
    ```json
    {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
    -   `username` (string, required): Desired username.
    -   `email` (string, email format, required): User's email address.
    -   `password` (string, password format, required): User's chosen password.
-   **Responses:**
    -   **`201 Created`**: User registered successfully.
        ```json
        {
          "message": "User registered successfully.",
          "user": {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@example.com",
            // ... other user fields, password excluded
            "createdAt": "2023-10-27T10:00:00.000Z",
            "updatedAt": "2023-10-27T10:00:00.000Z"
          }
        }
        ```
    -   **`400 Bad Request`**: Invalid input (e.g., missing fields, validation error) or user already exists (username or email taken).
        ```json
        // Example: User already exists
        {
          "message": "User with this email already exists."
        }
        ```
        ```json
        // Example: Validation error
        {
          "message": "Validation error",
          "errors": ["Password must be at least 8 characters long"]
        }
        ```
    -   **`500 Internal Server Error`**: Server-side error during registration.
        ```json
        {
          "message": "Internal server error during registration."
        }
        ```

### POST /auth/login

Log in an existing user.

-   **Method:** `POST`
-   **Path:** `/auth/login` (e.g., `http://localhost:3001/api/auth/login`)
-   **Description:** Authenticates a user and returns a JWT token.
-   **Request Body:** `application/json`
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
    -   `email` (string, email format, required): User's email address.
    -   `password` (string, password format, required): User's password.
-   **Responses:**
    -   **`200 OK`**: Login successful.
        ```json
        {
          "message": "Login successful",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNjE2NDA2NDAwLCJleHAiOjE2MTY0MDk2MDB9.U_jZkX6ZCIF4B0XyXh5nB0zHc0jDc7x0nFzY0zDc0jE",
          "user": {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@example.com",
            // ... other user fields, password excluded
            "createdAt": "2023-10-27T10:00:00.000Z",
            "updatedAt": "2023-10-27T10:00:00.000Z"
          }
        }
        ```
    -   **`400 Bad Request`**: Missing email or password.
        ```json
        {
          "message": "Email and password are required."
        }
        ```
    -   **`401 Unauthorized`**: Invalid credentials (email not found or password does not match).
        ```json
        {
          "message": "Invalid credentials."
        }
        ```
    -   **`500 Internal Server Error`**: Server-side error during login.
        ```json
        {
          "message": "Internal server error during login."
        }
        ```

---

## 2. User Endpoints

These endpoints are for user-specific operations and typically require authentication.

### GET /users/profile

Get the profile of the currently authenticated user.

-   **Method:** `GET`
-   **Path:** `/users/profile` (e.g., `http://localhost:3001/api/users/profile`)
-   **Description:** Retrieves the profile information for the user associated with the provided JWT token.
-   **Authentication:** Requires Bearer Token in the `Authorization` header.
    ```
    Authorization: Bearer <YOUR_JWT_TOKEN>
    ```
-   **Request Body:** None
-   **Responses:**
    -   **`200 OK`**: User profile data retrieved successfully.
        ```json
        {
          "message": "Profile data",
          "user": {
            "id": 1,
            "username": "johndoe",
            "email": "johndoe@example.com",
            // ... other user fields, password excluded
            "createdAt": "2023-10-27T10:00:00.000Z",
            "updatedAt": "2023-10-27T10:00:00.000Z"
          }
        }
        ```
    -   **`401 Unauthorized`**: Authentication token required (token not provided or malformed).
    -   **`403 Forbidden`**: Invalid or expired token.
    -   **`404 Not Found`**: User associated with the token not found in the database.
        ```json
        {
          "message": "User not found."
        }
        ```
    -   **`500 Internal Server Error`**: Server-side error while fetching profile.
        ```json
        {
          "message": "Internal server error while fetching profile."
        }
        ```

---

This API documentation will be updated as more endpoints are added or existing ones are modified.

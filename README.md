# Amazon Price Tracker

This project is a web application that tracks the price of products on Amazon.

## Prerequisites

- Node.js
- npm

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd amazon-price-bot
    ```
3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```
4.  **Install frontend dependencies:**
    ```bash
    cd price-tracker-frontend
    npm install
    cd ..
    ```

## Running the Application

1.  **Start both the frontend and backend concurrently:**
    From the `price-tracker-frontend` directory, run:
    ```bash
    npm run dev
    ```

    This will start the backend server on `http://localhost:3000` and the frontend development server on `http://localhost:5173`.

2.  **Alternatively, you can run them separately:**

    *   **To start the backend server:**
        From the `backend` directory, run:
        ```bash
        node server.js
        ```
        Or, if you have `nodemon` installed globally, you can use:
        ```bash
        nodemon server.js
        ```

    *   **To start the frontend development server:**
        From the `price-tracker-frontend` directory, run:
        ```bash
        npm run dev:frontend
        ```

## Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```
PORT=3000
MONGO_URI=<your-mongodb-uri>
```

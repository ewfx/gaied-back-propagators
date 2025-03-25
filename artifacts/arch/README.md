# Project Architecture Documentation

## Overviewn of Project

This project consists of a backend service built with Flask and a frontend application built with React and Vite. The backend handles email processing, including duplicate detection and storage, while the frontend provides a user interface for interacting with the backend.



## Backend

### Overview

The backend is a Flask application that processes emails, checks for duplicates, and stores email details in MongoDB and Redis.

### Key Components

- **Flask Application**: The main application logic is implemented in `app.py`.
- **MongoDB**: Used for persistent storage of email details.
- **Redis**: Used for caching email details to speed up duplicate checks.
- **Environment Variables**: Stored in `.env` file for sensitive information like API keys and database URIs.

### `app.py`

- **Environment Variables**: Loaded using `dotenv`.
- **MongoDB Connection**: Established using `pymongo`.
- **Redis Connection**: Established using `redis`.
- **Email Processing**: Functions to compute email hash, check for duplicates, store email details, and process emails using a language model.

### `llm.py`

- **Email Processing**: Contains functions to read `.eml` files and process emails using a language model.

### Dockerfile

- **Base Image**: Python 3.10-slim.
- **Dependencies**: Installed from `requirements.txt`.
- **Application**: Copied and run using Flask.

## Frontend

### Overview

The frontend is a React application built with Vite, providing a user interface for interacting with the backend.

### Key Components

- **React Application**: Main application logic implemented in `App.tsx` and `main.tsx`.
- **Vite**: Used for building and serving the frontend application.
- **TypeScript**: Used for type checking and development.


### `App.tsx`

- **Main Component**: Contains the main application logic and UI components.

### `main.tsx`

- **Entry Point**: Renders the main `App` component into the DOM.

### Dockerfile

- **Base Image**: Node.js 18.
- **Dependencies**: Installed from `package.json`.
- **Application**: Built and served using Vite.

## Docker Compose

### Overview

Docker Compose is used to manage and run the backend and frontend services.

### Configuration

```yaml
version: "3.8"

services:
  backend:
    build: ./code/src/Backend
    ports:
      - "5000:5000"
    volumes:
      - ./code/src/Backend:/app
    environment:
      - FLASK_ENV=development
    restart: unless-stopped

  frontend:
    build: ./code/src/Frontend
    ports:
      - "8080:8080"
    volumes:
      - ./code/src/Frontend:/app
    depends_on:
      - backend
    restart: unless-stopped
```

## Conclusion

This project integrates a Flask backend with a React frontend, using MongoDB and Redis for data storage and caching. Docker and Docker Compose are used for containerization and orchestration, making it easy to deploy and manage the application.
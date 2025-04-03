# Hotel Haven

### License

Copyright &copy; 2025 Anuhas Dissanayake. All Rights Reserved.
This product is licensed under [MIT License](License.txt).

---

## Introduction

Hotel Haven is a smart hotel booking platform that uses AI-powered search and recommendations to help users find the perfect hotel for their needs. The platform provides a user-friendly interface for browsing hotels, searching for specific locations, and booking rooms with ease.

---

## Features

- Browse available hotels with detailed information
- Semantic hotel search with OpenAI embeddings
- Responsive design for all devices
- Detailed hotel pages with image galleries
- Location-based hotel search
- Price filtering and sorting options
- User authentication and authorization
- Booking functionality

**Deployed URLs**

- Frontend: [https://hotel-haven-frontend.vercel.app](https://hotel-haven-frontend.vercel.app)
- Backend: [https://hotel-haven-api.vercel.app](https://hotel-haven-api.vercel.app)

---

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Shadcn UI**: A set of accessible and customizable UI components.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Redux**: A predictable state container for JavaScript applications.
- **React Router**: Declarative routing for React applications.
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **Clerk**: Authentication and user management for React applications.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Lucide React**: A collection of simple and customizable SVG icons.
- **Embla Carousel**: A lightweight carousel library with autoplay functionality.
- **Sonner**: A toast notification library for React.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **LangChain**: A framework for developing applications powered by language models.
- **OpenAI**: Utilized for AI-powered search and recommendation features.
- **Clerk**: Authentication and user management for Node.js applications.
- **Zod**: TypeScript-first schema declaration and validation library.

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AnuhasDev/hotel-haven.git
cd hotel-haven
```

2. Install dependencies for both frontend and backend:

```bash
# Navigate to the frontend directory and install dependencies
cd Frontend
npm install --legacy-peer-deps

# Navigate to the backend directory and install dependencies
cd ../Backend
npm install
```

### Environment Variables

Create a `.env` file in the `Backend` directory and add the following environment variables:

```env
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=your_frontend_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Create a `.env` file in the `Frontend` directory and add the following environment variables:

```env
VITE_REACT_APP_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Initializing the Database

1. Seed the database with sample data and embeddings:

```bash
cd Backend
npm run seed
```

2. Create a Vector Search Index:

- In MongoDB Atlas, go to "Atlas Search" tab and select the `hotelVectors` collection.
- Create a vector index named `vector_index` with following JSON configuration:

```json
{
	"fields": [
		{
			"type": "vector",
			"path": "embedding",
			"numDimensions": 1536,
			"similarity": "cosine"
		}
	]
}
```

- Wait for it to build.
- Set network access to allow your IP in Atlas under "Network Access."

### Running the Application

1. Start the backend server (Terminal 1):

```bash
cd Backend
npm run dev
```

2. Start the frontend server (Terminal 2):

```bash
cd Frontend
npm run dev
```

3. Open your browser and navigate to the link displayed in your Terminal 2.

---

## Project Structure

### Frontend

- `src/components`: Contains reusable UI components.
- `src/layouts`: Contains layout components for different routes.
- `src/pages`: Contains page components for different routes.
- `src/lib`: Contains utility functions and API configuration.
- `src/index.css`: Global CSS styles.
- `src/main.jsx`: Entry point for the React application.

### Backend

- `src/api`: Contains route handlers and middleware.
- `src/application`: Contains business logic for different entities.
- `src/domain`: Contains domain models and error classes.
- `src/infrastructure`: Contains database connection and schemas.
- `src/index.ts`: Entry point for the Express application.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## License

This project is licensed under [MIT License](License.txt).

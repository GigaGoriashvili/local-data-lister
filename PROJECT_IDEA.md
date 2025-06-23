# Project: Local Data Lister

## 👥 Team Information
- **Team Members**: Giga Goriashvili
- **Selected Base Project**: Local Data Lister

## 🎯 Project Vision
**Problem Statement**: Users need a quick, accessible, and easily filterable way to find information about local points of interest (e.g., restaurants, parks, events) through a web application, requiring a persistent and flexible data storage solution for easy data management.
**Target Users**: Individuals seeking local information (e.g., tourists, new residents, locals looking for specific services or entertainment). Also, implicitly, developers learning full-stack data flow with NoSQL databases.
**Value Proposition**: Provides a clear, organized, and filterable display of local information, leveraging a flexible NoSQL database (MongoDB) for scalable and adaptable data storage. For the developer, it serves as a robust demonstration of fundamental full-stack web development concepts, including persistent server-side data management, client-side data consumption, and interactive list filtering, all within a type-safe environment.

## 🏗️ Architecture & Technical Design

### Tech Stack
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript (using Mongoose for MongoDB OGM)
- **Database**: MongoDB
- **Deployment**: AWS (EC2 for backend, S3 for static frontend assets, MongoDB Atlas for database hosting)
- **Testing**: Jest, React Testing Library, Supertest (for API integration tests)

### System Architecture
- **Component Hierarchy**:
    - `App`: Main application container.
    - `Header`: Contains application title and potentially the search bar.
    - `SearchFilter`: Input field and logic for filtering the list.
    - `LocalItemList`: Container component responsible for fetching data and rendering `LocalItem` components. Handles filtering logic.
    - `LocalItem`: Displays individual local entity details (name, type, address, description).
    - `LoadingSpinner`/`ErrorMessage`: Basic UI for data fetching states.

- **API Design**:
    - **Endpoint**: `GET /api/local-items`
        - **Description**: Retrieves a list of all local data items from MongoDB.
        - **Request**: No parameters.
        - **Response**: `200 OK` with an array of `LocalItem` objects.
        ```json
        [
            {
                "_id": "60d0fe3d8f8d9f0015b6d517", // MongoDB _id
                "name": "Central Park",
                "type": "Park",
                "address": "123 Park Ave",
                "description": "Large urban park with walking trails and playgrounds.",
                "tags": ["outdoor", "nature", "family"],
                "__v": 0 // Mongoose version key
            },
            {
                "_id": "60d0fe3d8f8d9f0015b6d518",
                "name": "The Gourmet Grill",
                "type": "Restaurant",
                "address": "456 Main St",
                "description": "Fine dining restaurant specializing in grilled meats.",
                "tags": ["food", "dinner", "steak"],
                "__v": 0
            }
        ]
        ```
    - **Data Flow**:
        1. Frontend (`LocalItemList` component) makes a GET request to `/api/local-items` upon component mount.
        2. Node.js backend connects to MongoDB (via Mongoose), queries the `localitems` collection, and retrieves the documents.
        3. Backend sends the retrieved data as a JSON response.
        4. Frontend receives the data, updates its state, and renders `LocalItem` components.
        5. User interacts with `SearchFilter` to update the displayed list (filtering happens client-side).

- **Database Schema (MongoDB Document Structure)**:
    - While MongoDB is schema-less, we'll define a robust Mongoose schema to enforce structure and enable type safety.
    ```typescript
    // In backend/src/models/LocalItem.ts
    import { Document, Schema, model } from 'mongoose';

    export interface ILocalItem extends Document {
        name: string;
        type: 'Restaurant' | 'Park' | 'Event' | string;
        address: string;
        description: string;
        tags: string[];
    }

    const LocalItemSchema: Schema = new Schema({
        name: { type: String, required: true },
        type: { type: String, required: true },
        address: { type: String, required: true },
        description: { type: String, required: true },
        tags: { type: [String], default: [] }
    });

    export const LocalItem = model<ILocalItem>('LocalItem', LocalItemSchema);
    ```
    - Frontend interface will mirror this structure (excluding Mongoose specific fields like `_id`, `__v` or handling them as optional).

- **Authentication**: No user authentication required or implemented as per the project's scope. The application serves publicly accessible data.

### Key Design Decisions
-   **MongoDB as Primary Data Source**: Utilize MongoDB for persistent storage of local item data. This provides flexibility for evolving data structures and simplifies data management compared to static files. Mongoose will be used for schema definition and interaction.
-   **Client-Side Filtering**: All filtering and search logic will be handled on the frontend (React). This offloads processing from the server, minimizes database queries for every filter change, and demonstrates React's capabilities for dynamic UI updates.
-   **TypeScript End-to-End**: Leverage TypeScript across both frontend and backend to enforce strict type checking for data structures (`LocalItem`), API request/response contracts, and component props. This enhances code quality, readability, and maintainability.

## 🧪 Test-Driven Development Strategy
- **Core Features to Test**:
    - Backend MongoDB connection: Verifying successful connection and disconnection.
    - Backend API endpoint: Verifying it returns the correct data structure and HTTP status from MongoDB.
    - Frontend data fetching: Ensuring data is correctly fetched, loading states are handled, and error conditions are displayed.
    - List rendering: Confirming that fetched items are correctly displayed in the `LocalItemList`.
    - Filtering/Search functionality: Testing that the list filters accurately based on various inputs (partial matches, case-insensitivity, no results).
    - Individual `LocalItem` component: Testing its rendering with various data inputs.
- **Testing Approach**:
    - **Unit Tests**: For isolated backend utility functions, Mongoose models, individual React components (e.g., `LocalItem`, `SearchFilter`).
    - **Integration Tests**: For backend API routes (using Supertest to hit actual endpoints), frontend data fetching from the backend, and interaction-based tests for filtering.
    - **End-to-End Tests**: (Optional, if time permits) Using Cypress to simulate user flow from initial load to filtering.
- **Test Coverage Goals**: Focus on achieving high coverage (e.g., 80%+) for core logic pathways, including database interactions (read), data fetching, data transformation, list rendering, and the client-side filtering algorithm.

## 📦 Feature Breakdown

### Core Features (Must-Have)
- [x] **Node.js Backend with MongoDB Integration**: An Express.js server connected to MongoDB, providing local data via a `/api/local-items` endpoint.
- [x] **MongoDB Data Management**: Define a Mongoose schema for `LocalItem` and populate the database with initial data.
- [x] **React Frontend Data Display**: A React application that fetches the list of local items from the backend and displays them in a clear, readable list format.
- [x] **TypeScript Data Definition**: Strict TypeScript interfaces/types defined for the `LocalItem` data structure used across both frontend and backend.
- [x] **Client-Side Filtering/Search**: Implement a text input field on the frontend allowing users to filter the displayed list by keywords matching item name, type, description, or tags.

### Enhanced Features (Nice-to-Have)
- [ ] **Basic Styling & Responsiveness**: Apply basic CSS for improved aesthetics and ensure the application is usable on different screen sizes.
- [ ] **Loading and Error States**: Display visual indicators (e.g., a spinner for loading, an error message) during data fetching.
- [ ] **Sorting Options**: Add functionality to sort the displayed list by criteria like name or type.
- [ ] **Debounced Search Input**: Optimize search performance by debouncing the input, preventing excessive re-renders during typing.

## 📅 4-Week Development Plan

### Week 1: Planning & Setup
- [x] Project repository setup (monorepo structure or separate frontend/backend).
- [x] Initialize React + TypeScript frontend and Node.js + TypeScript backend projects.
- [x] Set up **MongoDB Atlas** account and create a new cluster.
- [x] Define `LocalItem` TypeScript interface and **Mongoose schema**.
- [x] Initial test framework setup (Jest, React Testing Library, Supertest).
- [x] Environment configuration (e.g., using `dotenv` for MongoDB connection string).

### Week 2: Minimal App + Testing
- [x] **Backend**: Implement MongoDB connection logic using Mongoose.
- [x] **Backend**: Create Mongoose model for `LocalItem`.
- [x] **Backend**: Implement the `/api/local-items` endpoint to fetch data from MongoDB.
- [x] **Frontend**: Create `LocalItem` and `LocalItemList` components.
- [x] **Frontend**: Implement data fetching logic to consume the backend API.
- [x] Display the fetched local items on the UI.
- [x] Write unit tests for backend Mongoose model and basic frontend components.
- [x] Implement initial loading/error states in the frontend.

### Week 3: Core Feature Development + Deployment Prep
- [x] **Frontend**: Implement `SearchFilter` component and integrate it with `LocalItemList` for client-side filtering logic.
- [x] **Testing**: Write integration tests for backend API endpoint (using Supertest) and frontend data flow (API fetch -> list rendering -> filtering).
- [x] Begin AWS deployment setup: Configure EC2 instance, install Node.js/Nginx/PM2.
- [ ] Implement basic UI/UX improvements (e.g., responsive layout, card-like display for items).

### Week 4: Polish + Final Development
- [ ] Implement chosen enhanced features (e.g., sorting, debouncing search input).
- [ ] Comprehensive testing: Add more edge case tests for filtering, improve test coverage.
- [ ] Refine UI/UX, ensuring a smooth and intuitive user experience.
- [ ] Complete project documentation (README, API docs, architecture notes).
- [ ] Final deployment to AWS and prepare for demo.

## 🚀 Deployment Strategy
- **AWS Services**:
    - **EC2**: Host the Node.js backend server.
    - **S3**: Store static frontend assets (HTML, CSS, JS bundles).
    - **MongoDB Atlas**: Managed cloud database service for MongoDB instance.
    - **CloudFront**: Optional, for CDN and SSL for S3 content (can use Nginx on EC2 instead for simplicity if managing one server).
    - **Route 53**: Optional, for custom domain mapping.
- **Environment Variables**: Manage sensitive configurations (e.g., MongoDB connection string, port numbers) using `dotenv` for local development and direct environment variables on the EC2 instance for production.
- **Database Hosting**: MongoDB Atlas (recommended for ease of setup, scalability, and security compared to self-hosting MongoDB on EC2).
- **Domain & SSL**: If a custom domain is used, configure Route 53. SSL will be managed via Nginx on the EC2 instance using Let's Encrypt, or via AWS Certificate Manager if using CloudFront.

## 📚 Documentation Plan
- **README**: Comprehensive `README.md` in the root of the project with:
    - Project overview and vision.
    - Detailed setup and run instructions for both frontend and backend.
    - MongoDB Atlas setup instructions (connection string, IP whitelisting).
    - Available scripts (e.g., `npm start`, `npm test`).
    - Technologies used.
    - Deployment instructions.
- **API Documentation**: A dedicated section in the `README.md` or a separate `API.md` describing:
    - The `/api/local-items` endpoint (HTTP method, URL, expected response format).
    - Example JSON data.
- **Architecture Docs**: A brief section in the `README.md` outlining:
    - High-level system architecture.
    - Component hierarchy.
    - Key design decisions and their rationale (especially concerning MongoDB).
- **Testing Docs**: A section in the `README.md` detailing:
    - How to run tests.
    - What types of tests are implemented (unit, integration).
    - General test coverage goals.

## 🤔 Potential Challenges & Solutions
-   **Challenge 1**: Setting up and connecting to MongoDB Atlas and managing connection strings/IP whitelisting.
    -   *Solution approach*: Follow MongoDB Atlas documentation carefully for cluster creation, user setup, network access configuration, and obtaining the connection string. Store connection string securely via environment variables.
-   **Challenge 2**: Ensuring Mongoose schema validity and handling potential data inconsistencies (even though MongoDB is schema-less, Mongoose enforces it).
    -   *Solution approach*: Define a clear, well-structured Mongoose schema. Use TypeScript interfaces to enforce data shapes. Implement robust error handling for database operations.
-   **Challenge 3**: Managing and seeding initial data into MongoDB for development and deployment.
    -   *Solution approach*: Create a simple Node.js script to connect to MongoDB and insert initial mock data (e.g., from a JSON file) into the `localitems` collection. This script can be run once after deployment or as part of a CI/CD pipeline.

## 📈 Success Metrics
- **Functionality**:
    - The Node.js backend successfully connects to MongoDB and serves `LocalItem` data.
    - The React frontend consistently fetches, displays, and dynamically updates the list of local items from MongoDB.
    - The client-side filtering/search feature accurately narrows down the displayed list based on user input.
- **Code Quality**:
    - Consistent and effective use of TypeScript throughout the codebase (minimal `any` types, clear interfaces, Mongoose types).
    - Adherence to ESLint and Prettier rules for code style and consistency.
    - Modular and reusable React components and backend services (e.g., separate files for routes, models, controllers).
- **Performance**:
    - Initial data fetch from MongoDB and display completes within 2-3 seconds on a reasonable internet connection.
    - Filtering operations result in near-instantaneous UI updates (< 0.5 seconds).
    - The application remains responsive during user interactions.
- **User Experience**:
    - The UI is intuitive and easy to navigate for finding and filtering local information.
    - The list of items is clearly presented and readable.
    - Basic responsiveness ensures usability across common device screen sizes.

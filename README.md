# NextJS-Blog-Databse

## Getting Started

To get started with this project, follow the instructions below.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repository to your local machine.

    ```bash
    git clone https://github.com/KelvinatorWas/next-js-blog-db.git
    ```

3. Navigate to the project directory.

    ```bash
    cd next-js-blog-db
    ```

4. Install project dependencies locally.

    ```bash
    npm install
    ```

5. Build and run the Docker containers.

    ```bash
    docker-compose up --build
    ```

### Database Seeding

Seed data is required to populate the database with initial information. Run the following command to seed the database:

```bash
npm run seed
```

### Running the Application

To start the development server using nodemon, run:

```bash
npm run start:nodemon
```

This will start the development server, and you can access the application at http://localhost:3001.

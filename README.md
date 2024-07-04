Overview
This project implements a Node.js REST API using the Moleculer microservices framework and MongoDB for data storage. It provides basic CRUD operations for managing users and their associated addresses. The project is containerized using Docker, making setup and deployment straightforward.

Prerequisites
Before you begin, ensure you have the following installed on your system:

Docker
Docker Compose
Setup and Installation
Clone the Repository
To get started, clone this repository to your local machine:

bash

git clone <repository-url>
cd <repository-folder>
Build and Run with Docker Compose
To build and start the services using Docker Compose, run:

bash

docker-compose up --build
This command will start all the required services as defined in the docker-compose.yml file, including:

Node.js application
MongoDB
NATS (for Moleculer transport)
API Endpoints
The application supports the following RESTful endpoints:

Users:

GET /api/users: Retrieve all users.

POST /api/users: Create a new user.
Body: {"name": "string", "email": "string", "password": "string"}

GET /api/users/
: Retrieve a user by ID.

PUT /api/users/
: Update a user by ID.
Body: {"name": "string", "email": "string", "password": "string"}

DELETE /api/users/
: Delete a user by ID.


Addresses:

GET /api/addresses/user/
: Retrieve all addresses for a user.

POST /api/addresses: Create a new address for a user.
Body: {"userId": "string", "street": "string", "city": "string", "zip": "string"}

GET /api/addresses/
: Retrieve an address by ID.

PUT /api/addresses/
: Update an address by ID.
Body: {"street": "string", "city": "string", "zip": "string"}

DELETE /api/addresses/
: Delete an address by ID.

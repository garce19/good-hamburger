# Good Hamburger API

RESTful API for managing hamburger orders with automatic discount calculation based on item combinations.

## Technology Stack

- Node.js 18+ with Express.js
- MySQL 8.0
- Docker & Docker Compose
- Jest for unit testing

## Features

- Complete CRUD operations for orders
- Menu item management (sandwiches and extras)
- Automatic discount calculation based on item combinations
- Comprehensive input validation and error handling
- Fully containerized with Docker Compose
- Unit tested business logic

## Business Rules

The system applies automatic discounts based on item combinations:

| Items Selected | Discount Applied |
|----------------|------------------|
| Sandwich + Fries + Soft Drink | 20% |
| Sandwich + Soft Drink | 15% |
| Sandwich + Fries | 10% |
| Sandwich only | 0% |

**Order Constraints:**
- Each order must contain exactly one sandwich
- Maximum one serving of fries per order
- Maximum one soft drink per order
- Duplicate extras are not allowed

## Getting Started

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git

## Running with Docker

### 1. Clone the Repository

```bash
git clone <repository-url>
cd good-hamburger
```

### 2. Build and Start the Containers

Build the Docker images and start all services:

```bash
docker-compose up --build
```

This command will:
- Build the API container image
- Build the MySQL container with initialization script
- Create and start both containers
- Initialize the database with schema and seed data

### 3. Verify the Services

Once the containers are running, verify that the services are accessible:

- **API:** http://localhost:3000
- **MySQL:** localhost:3306

Test the API health:
```bash
curl http://localhost:3000/api/health
```

### 4. Stop the Containers

To stop the running containers:

```bash
docker-compose down
```

To stop and remove all data (including database):

```bash
docker-compose down -v
```

### 5. View Container Logs

To view real-time logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f api
docker-compose logs -f mysql
```

### 6. Rebuild After Code Changes

When you make changes to the code, rebuild and restart:

```bash
docker-compose up -d --build api
```

## Local Development (Without Docker)

If you prefer to run the application without Docker:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=good_hamburger
NODE_ENV=development
```

### 3. Set Up MySQL Database

Ensure MySQL 8.0 is running locally and execute the initialization script:

```bash
mysql -u root -p < init.sql
```

### 4. Start the Development Server

```bash
npm run dev
```

The API will be available at http://localhost:3000

## API Reference

### Menu Endpoints

#### Retrieve all menu items
```http
GET /api/menu
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [...]
}
```

#### Retrieve sandwiches
```http
GET /api/menu/sandwiches
```

#### Retrieve extras
```http
GET /api/menu/extras
```

### Order Endpoints

#### Create a new order
```http
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "sandwich_id": 1,
  "extras": ["fries", "soft_drink"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "sandwich_id": 1,
      "has_fries": true,
      "has_soft_drink": true,
      "subtotal": "9.50",
      "discount_percentage": "20.00",
      "discount_amount": "1.90",
      "total": "7.60"
    },
    "breakdown": {
      "subtotal": 9.5,
      "discount_percentage": 20,
      "discount_amount": 1.9,
      "total": 7.6
    }
  }
}
```

#### Retrieve all orders
```http
GET /api/orders
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sandwich_id": 1,
      "sandwich_name": "Burger",
      "has_fries": true,
      "has_soft_drink": true,
      "subtotal": "9.50",
      "discount_percentage": "20.00",
      "discount_amount": "1.90",
      "total": "7.60",
      "created_at": "2025-12-02T12:00:00.000Z",
      "updated_at": "2025-12-02T12:00:00.000Z"
    }
  ]
}
```

#### Update an existing order
```http
PUT /api/orders/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "sandwich_id": 2,
  "extras": ["soft_drink"]
}
```

**Response:** `200 OK`

#### Delete an order
```http
DELETE /api/orders/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order deleted successfully."
}
```

## How to Test

### Unit Tests

The project includes unit tests for the business logic layer.

#### Run All Tests

```bash
npm test
```

#### Run Tests in Watch Mode

For development, run tests in watch mode to automatically rerun on file changes:

```bash
npm test -- --watch
```

#### Generate Coverage Report

```bash
npm test -- --coverage
```

This will generate a detailed coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Coverage reports are saved in the `coverage/` directory.

#### Current Test Coverage

The test suite covers:
- **Discount Service:** All discount calculation scenarios
- **Business Rules:** Validation of discount rules for all item combinations
- **Total Calculations:** Subtotal, discount amount, and final total calculations

### Manual API Testing

#### Using Docker Environment

Ensure the Docker containers are running:

```bash
docker-compose up
```

#### Test Scenarios

**1. Retrieve All Menu Items**

```bash
curl http://localhost:3000/api/menu
```

**2. Create Order with Maximum Discount (20%)**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 1, "extras": ["fries", "soft_drink"]}'
```

Expected: 20% discount applied.

**3. Create Order with Medium Discount (15%)**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 2, "extras": ["soft_drink"]}'
```

Expected: 15% discount applied.

**4. Create Order with Low Discount (10%)**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 3, "extras": ["fries"]}'
```

Expected: 10% discount applied.

**5. Create Order without Extras (0% discount)**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 1, "extras": []}'
```

Expected: No discount applied.

**6. Test Validation - Duplicate Extras**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 1, "extras": ["fries", "fries"]}'
```

Expected response:
```json
{
  "success": false,
  "error": "Duplicate extras are not allowed. Each extra can be added only once."
}
```

**7. Test Validation - Missing Sandwich**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"extras": ["fries"]}'
```

Expected response:
```json
{
  "success": false,
  "error": "A sandwich must be selected to create an order."
}
```

**8. Retrieve All Orders**

```bash
curl http://localhost:3000/api/orders
```

**9. Update an Order**

```bash
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 2, "extras": ["soft_drink"]}'
```

**10. Delete an Order**

```bash
curl -X DELETE http://localhost:3000/api/orders/1
```

### Testing with Postman or Insomnia

You can also import these endpoints into Postman or Insomnia:

1. Create a new collection
2. Add the base URL: `http://localhost:3000`
3. Create requests for each endpoint listed in the API Reference section
4. Test different scenarios and edge cases

## Project Structure
```
good-hamburger/
├── src/
│   ├── config/
│   │   └── database.js           # MySQL connection pool
│   ├── controllers/
│   │   ├── menuController.js     # Menu item handlers
│   │   └── orderController.js    # Order CRUD handlers
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handler
│   ├── routes/
│   │   ├── menuRoutes.js         # Menu endpoints
│   │   └── orderRoutes.js        # Order endpoints
│   ├── services/
│   │   └── discountService.js    # Discount calculation logic
│   ├── app.js                    # Express application setup
│   └── server.js                 # Server entry point
├── tests/
│   └── discountService.test.js   # Unit tests
├── docker-compose.yaml            # Container orchestration
├── Dockerfile                     # API container image
├── Dockerfile.mysql               # MySQL container with init script
├── init.sql                       # Database schema and seed data
└── package.json                   # Project dependencies
```

## Environment Variables

The application uses the following environment variables:

```env
PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=good_hamburger
NODE_ENV=production
```

For local development, create a `.env` file with appropriate values.

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

**HTTP Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Database Schema

**menu_items table:**
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `type` (ENUM: 'sandwich', 'extra')
- `created_at` (TIMESTAMP)

**orders table:**
- `id` (INT, Primary Key)
- `sandwich_id` (INT, Foreign Key)
- `has_fries` (BOOLEAN)
- `has_soft_drink` (BOOLEAN)
- `subtotal` (DECIMAL)
- `discount_percentage` (DECIMAL)
- `discount_amount` (DECIMAL)
- `total` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Author

German Rojas

## License

ISC
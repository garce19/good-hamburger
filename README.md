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

- Docker
- Docker Compose

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd good-hamburger
```

2. Build and start the application:
```bash
docker-compose up --build
```

The services will be available at:
- API: `http://localhost:3000`
- MySQL: `localhost:3306`

### Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables by creating a `.env` file based on `.env.example`

3. Ensure MySQL 8.0 is running locally and execute the initialization script:
```bash
mysql -u root -p < init.sql
```

4. Start the development server:
```bash
npm run dev
```

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

## Testing

### Run Unit Tests
```bash
npm test
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

### Test Coverage

The test suite currently covers:
- Discount calculation logic
- Business rules validation
- Total amount calculations

### Example Manual Tests

**Create order with maximum discount:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"sandwich_id": 1, "extras": ["fries", "soft_drink"]}'
```

**Attempt to create order with duplicate extras:**
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
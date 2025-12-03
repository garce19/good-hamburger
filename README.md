# Good Hamburger API

Backend API for the Good Hamburger ordering system.

## Tech Stack

- **Node.js** with Express
- **MySQL** 8.0
- **Docker** & Docker Compose
- **Jest** for testing

## Features

- RESTful API for menu management
- Order creation with automatic discount calculation
- CRUD operations for orders
- Input validation and error handling
- Dockerized application

## Business Rules

1. If customer selects sandwich + fries + soft drink: **20% discount**
2. If customer selects sandwich + soft drink: **15% discount**
3. If customer selects sandwich + fries: **10% discount**
4. Each order can contain maximum: 1 sandwich, 1 fries, 1 soft drink

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation & Running

1. Clone the repository
```bash
git clone <your-repo-url>
cd good-hamburger-api
```

2. Start the application with Docker
```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`

MySQL will be available at `localhost:3306`

### Without Docker (Development)

1. Install dependencies
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env` and adjust if needed)

3. Make sure MySQL is running locally and run init.sql

4. Start the server
```bash
npm run dev
```

## API Endpoints

### Menu Endpoints

#### Get all menu items
```http
GET /api/menu
```

#### Get sandwiches only
```http
GET /api/menu/sandwiches
```

#### Get extras only
```http
GET /api/menu/extras
```

### Order Endpoints

#### Create order
```http
POST /api/orders
Content-Type: application/json

{
  "sandwich_id": 1,
  "extras": ["fries", "soft_drink"]
}
```

Response:
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

#### Get all orders
```http
GET /api/orders
```

#### Update order
```http
PUT /api/orders/:id
Content-Type: application/json

{
  "sandwich_id": 2,
  "extras": ["soft_drink"]
}
```

#### Delete order
```http
DELETE /api/orders/:id
```

## Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Testing Strategy

#### Unit Tests
- Discount calculation logic
- Business rules validation
- Utility functions

#### Integration Tests (can be added)
- API endpoint testing with supertest
- Database operations
- Error handling

### Manual Testing

1. Start the application: `docker-compose up`

2. Use Postman, Insomnia, or curl to test endpoints

3. Test scenarios:
   - ✓ Valid order with all items (20% discount)
   - ✓ Valid order with sandwich + drink (15% discount)
   - ✓ Valid order with sandwich + fries (10% discount)
   - ✓ Valid order with only sandwich (0% discount)
   - ✗ Invalid order with duplicate items (should return error)
   - ✗ Invalid order without sandwich (should return error)
   - ✓ Update existing order
   - ✓ Delete existing order
   - ✗ Delete non-existent order (should return 404)

### Example Test Requests

**Create order with full discount (20%):**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "sandwich_id": 1,
    "extras": ["fries", "soft_drink"]
  }'
```

**Create order with duplicate items (should fail):**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "sandwich_id": 1,
    "extras": ["fries", "fries"]
  }'
```

Expected error:
```json
{
  "success": false,
  "error": "Duplicate items are not allowed. Each extra can only be added once."
}
```

## Project Structure
```
good-hamburger-api/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── tests/              # Test files
├── docker-compose.yml  # Docker services configuration
├── Dockerfile          # API container definition
├── init.sql           # Database initialization
└── package.json       # Dependencies and scripts
```

## Environment Variables

See `.env.example` for required environment variables.

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Author

Germán Rojas

## License

ISC
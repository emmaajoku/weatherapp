# Weather Application

A full-stack weather application built with FastAPI, React, and Docker.

## Project Structure

```
weather-app/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configurations
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── tests/              # Backend tests
│   ├── Dockerfile          # Backend container
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── __tests__/     # Frontend tests
│   ├── tests/             # Frontend tests
│   └── Dockerfile         # Frontend container
└── docker-compose.yml     # Container orchestration
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose
- OpenWeather API key

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/emmaajoku/weatherapp.git
cd weatherapp
```

2. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your OpenWeather API key

# Frontend
cp frontend/.env.example frontend/.env
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
The frontend uses Jest and React Testing Library for testing. The test suite includes:

1. Component Tests:
   - WeatherCard component tests
   - App component tests
   - Custom render utility with Material-UI theme provider

2. Test Coverage:
   - Component rendering
   - User interactions
   - API integration
   - Error handling
   - Loading states
   - State management
   - Edge cases

Run frontend tests with:
```bash
cd frontend
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

The test coverage threshold is set to 80% for:
- Branches
- Functions
- Lines
- Statements

## API Documentation

The API documentation is available at `/docs` when the backend is running. It includes:
- Weather data endpoints
- Error handling
- Request/response schemas

## Features

- Real-time weather data fetching
- Error handling and validation
- Responsive UI
- Unit tests for both frontend and backend
- Containerized deployment
- CI/CD pipeline (optional)

## Technologies Used

- Backend:
  - FastAPI
  - Pydantic
  - pytest
  - httpx
  - python-dotenv

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Axios
  - Jest
  - React Testing Library
  - @testing-library/user-event

- DevOps:
  - Docker
  - Docker Compose
  - GitHub Actions (optional)
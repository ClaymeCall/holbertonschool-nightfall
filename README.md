# Nightfall Project

## Overview
**Nightfall** is an immersive fictional theme park offering survival, sci-fi, and disaster-themed experiences. Visitors don’t just ride attractions—they participate in them. From contaminated labs to alien invasions, each activity has its own universe, difficulty level, and characteristics.

This web application allows visitors to:
- Discover and browse experiences
- Filter and search for activities
- Book tickets
- Manage reservations
- Enable park administrators to manage content

## Team Members
- Haitu
- Clement
- Thomas

## Features
### Experience Catalog
Visitors can browse all experiences offered by Nightfall. Each experience includes:
- Name
- Description
- Image
- Category (e.g., Survival, Horror, Escape Game, Sci-Fi, Action)
- Duration
- Intensity level
- Maximum number of participants
- Price

### Search and Filters
Users can:
- Search experiences by name
- Filter by category
- TODO: Specify additional filters (e.g., intensity, price, duration).

### Experience Details Page
Each experience has a dedicated page displaying:
- Name
- Description
- Price
- Category
- Duration
- Intensity level
- TODO: Add any additional details (e.g., images, reviews).

Logged-in users can start a reservation from this page.

### Visitor
A visitor can:
- Discover the park and its experiences
- Browse available activities
- Search and filter experiences by name and category

### Member
A registered user can:
- Create an account and log in
- Browse experiences
- Book an experience (with backend validation for:
  - Experience existence
  - Future date/time
  - Valid number of participants
  - Capacity limits)
- View their reservations
- Cancel a reservation (only if more than 48 hours before the scheduled time)

### Administrator
An administrator can:
- Add, edit, or delete/archive experiences
- View all reservations
- Manage park content (access restricted to admins)

TODO: Clarify archiving vs. deletion rules for experiences linked to reservations.

## Prerequisites
TODO: List prerequisites (e.g., Node.js, Docker, database CLI tools).

## Technologies

### Frontend
- **React** (JavaScript, HTML, CSS)

### Backend
- **Node.js** with **Express** (REST API)

### Database
TODO: Specify the chosen database technology (e.g., MySQL, PostgreSQL, MongoDB).

### DevOps
- **Docker** for containerization
- **Git** and **GitHub** for version control

### Project Management
TODO: Specify the tool used for task tracking (e.g., GitHub Projects, Trello, Notion).

## Getting Started
TODO: Add setup instructions for:
- Docker Compose
- Local development (frontend and backend)
- Environment variables (.env template)

### Using Docker Compose
TODO: Add Docker Compose instructions.

### Local Development
#### Frontend
TODO: Add frontend setup instructions.

#### Backend
TODO: Add backend setup instructions.
## Demo Accounts
TODO: Add demo accounts for:
- Visitor (no login required)
- Member (login credentials)
- Administrator (login credentials)
- [Architecture](#architecture)
## Data Model
### Experiences
- Name
- Description
- Image
- Category (e.g., Survival, Horror, Escape Game, Sci-Fi, Action)
- Duration
- Intensity level
- Maximum number of participants
- Price

### Users
- Email
- Hashed password
- Role (visitor/member/admin)

### Reservations
- Experience (reference)
- Date and time
- Number of participants
- User (reference)

TODO: Specify relationships between entities (e.g., one-to-many, many-to-many).
TODO: Add any additional fields or constraints.
## API Routes
TODO: List all API endpoints with their methods, parameters, and responses.

Example routes:
- `GET /api/experiences` - Retrieve all experiences
- `GET /api/experiences/:id` - Retrieve a specific experience
- `POST /api/experiences` - Create an experience (admin only)
- `PUT /api/experiences/:id` - Update an experience (admin only)
- `DELETE /api/experiences/:id` - Delete/archive an experience (admin only)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/bookings` - Retrieve user reservations
- `POST /api/bookings` - Create a reservation
- `DELETE /api/bookings/:id` - Cancel a reservation
## Security
- Passwords are hashed and never stored in plaintext
- Backend validation for all user inputs
- Admin routes and functionalities are protected
- Users cannot self-assign admin roles
- No sensitive data (API keys, tokens) is committed to the repository
- `.env` file is included in `.gitignore`
- TODO: Specify additional security measures (e.g., rate limiting, CORS, CSRF protection).
## Project Organization
- **4 days** for development, **1 day** for presentation and evaluation
- Work split among 3 team members (frontend, backend, database/DevOps)
- Prioritized MVP features:
  1. Experience catalog
  2. Search and filters
  3. Experience details page
  4. Booking system
  5. User account management
  6. Personal dashboard
  7. Cancellation policy
  8. Admin interface

TODO: Add a link to the project management tool (e.g., GitHub Projects, Trello, Notion).
TODO: Define branch naming conventions and Git workflow.
## Screenshots
TODO: Add screenshots of the application (e.g., homepage, experience details, booking flow, admin dashboard).

## Responsive Design
The application is designed to work on:
- Desktop
- Smartphone

TODO: Specify breakpoints or frameworks used (e.g., CSS Grid, Flexbox, Bootstrap).

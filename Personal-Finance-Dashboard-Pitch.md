# Personal Finance Dashboard

## 30-Second Elevator Pitch

"I'm building a simple Personal Expense Tracker that solves one problem really well: helping people know where their money goes. Users can quickly log expenses, see their monthly total, and view recent purchases. It's like having a digital receipt box that actually tells you useful information. Simple expense tracking that takes 30 seconds to use."

## MVP Core Features

### 1. User Registration & Login
- Simple email/password registration
- Basic login/logout
- Session management (stay logged in)

### 2. Add Expenses
- Quick expense form: amount, description, date
- 4 simple categories: Food, Transport, Entertainment, Other
- Save expense to user's account

### 3. View Expenses
- List of all user's expenses (newest first)
- Show: date, amount, description, category
- Delete button for each expense

### 4. Simple Dashboard
- Monthly spending total
- Expense count by category
- "Recent expenses" list (last 5 entries)

## Project Management 

### Foundation
**Backend Setup**
- [x] Set up Express server
- [x] Create PostgreSQL database
- [x] Build users and expenses tables
- [x] Create user registration/login API

**Expense API**
- [x] Build expense CRUD endpoints
- [x] Add basic validation
- [x] Test all APIs with Postman

**Basic Frontend**
- [x] Set up React app
- [x] Create login/register pages
- [x] Build expense form
- [x] Connect to backend APIs

### Complete & Polish
**Days 8-9: Dashboard**
- [x] Build expense list view
- [x] Create simple dashboard
- [x] Add expense deletion

**Polish & Deploy**
- [x] Basic styling (clean, simple)
- [x] Bug fixes and testing
- [x] Deploy to production
- [x] Final documentation


## Technical Implementation

### Database Schema 
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(8, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints 
```javascript
// Authentication
POST /api/auth/register  // Register new user
POST /api/auth/login     // Login user
POST /api/auth/logout    // Logout user

// Expenses
GET /api/expenses        // Get all user expenses
POST /api/expenses       // Add new expense
DELETE /api/expenses/:id // Delete expense
GET /api/expenses/summary // Get monthly total & category counts
```

### Frontend Pages
1. **Login/Register** (`/auth`) - Combined auth page
2. **Dashboard** (`/dashboard`) - Main page with summary and recent expenses
3. **Add Expense** (`/add`) - Simple form to add expenses

### Component Structure
```
App
├── AuthPage (login/register forms)
├── Dashboard 
│   ├── MonthlySummary (total spent this month)
│   ├── CategoryBreakdown (simple counts)
│   └── RecentExpenses (last 5 expenses with delete buttons)
└── AddExpense (amount, description, category, date form)
```

### User Stories 

#### Authentication
- **As a user**, I want to create an account with my email, so I can save my expense data.
- **As a user**, I want to log in to see my expenses, so my data is private and accessible.

#### Expense Tracking
- **As a user**, I want to quickly add an expense with amount and description, so I can track what I spend.
- **As a user**, I want to see all my expenses in a list, so I can review my spending.
- **As a user**, I want to delete an expense, so I can remove mistakes.

#### Dashboard
- **As a user**, I want to see how much I've spent this month, so I know my current spending level.
- **As a user**, I want to see my recent expenses, so I can quickly verify my latest entries.

## Technology Stack
- **Frontend:** React, React Router, basic CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** bcrypt for password hashing, sessions
- **Deployment:** Render or Heroku
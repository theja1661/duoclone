# Duolingo Clone Backend

A Spring Boot REST API backend for a learning platform similar to Duolingo. This application provides user authentication, course management, progress tracking, and gamification features.

## Features

### Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Automatic USER/ADMIN role assignment
  - Admin Detection: Users with name="admin" AND email containing "admin"
  - Role-based endpoint protection via Spring Security
- **Password Security**: BCrypt encryption for password storage
- **Token Management**: 24-hour token expiration with validation endpoints
- **CORS Configuration**: Cross-origin support for frontend integration
- **Request Filtering**: JWT authentication filter for protected endpoints

### User Management System
- **User Registration**: Automatic role assignment during signup
- **User Authentication**: Email/password login with JWT token generation
- **Profile Management**: User data storage and retrieval
- **Admin Protection**: Prevents deletion of admin users
- **User Statistics**: Enrollment and completion tracking per user

### Course Management System
- **Dynamic Course Creation**: Full course creation with technical content and MCQ questions
- **Course Structure**: 
  - Basic information (name, description, level, duration)
  - Curriculum planning with learning objectives
  - Technical content with code examples and multiple programming languages
  - MCQ questions with explanations and correct answer tracking
- **Course Discovery**: Browse all available courses with enrollment status
- **Course Details**: Comprehensive course information retrieval
- **Course CRUD Operations**: Full create, read, update, delete functionality for admins

### Progress Tracking System
- **Enrollment Management**: Course enrollment and unenrollment functionality
- **Two-Phase Learning**: 
  - Technical content completion tracking
  - MCQ quiz progress (locked until technical content complete)
- **Real-time Progress**: Automatic progress calculation and persistence
- **Section Navigation**: Track current section and index within courses
- **Completion Status**: Course completion detection and marking
- **Progress Persistence**: Detailed progress state saving and retrieval

### User Engagement Features
- **Course Favorites**: Like/unlike courses with persistent storage
- **Personal Dashboard**: Customized course recommendations and enrolled course display
- **Learning Continuity**: Resume learning from last accessed position
- **Progress Visualization**: Percentage-based progress tracking

### Gamification System
- **Category-based Questions**: Game questions organized by programming categories
- **Question Management**: Dynamic question retrieval by category
- **Game Service**: Centralized game logic and question distribution
- **Extensible Categories**: Support for multiple programming language categories

### Admin Panel Features
- **User Management Dashboard**: 
  - View all registered users (excluding other admins)
  - User statistics (enrolled courses, completed courses)
  - User deletion with admin protection
- **Course Management Dashboard**:
  - View all courses with statistics
  - Create new courses via JSON upload or manual entry
  - Edit existing course content and structure
  - Delete courses with confirmation
- **System Analytics**: User and course statistics for platform monitoring

### Technical Architecture Features
- **RESTful API Design**: Clean, consistent API endpoints following REST principles
- **MongoDB Integration**: NoSQL database with automatic collection management
- **Spring Boot Configuration**: Auto-configuration with custom properties
- **CORS Support**: Cross-origin resource sharing for frontend integration

## Technology Stack

- **Java 21**
- **Spring Boot 3.2.5**
- **Spring Security** with JWT authentication
- **MongoDB** for data persistence
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

## Application Flow

### 1. User Authentication Flow
1. **Registration**: New users register via `/api/auth/register`
   - Admin users: name="admin" AND email contains "admin" → gets ADMIN role
   - Regular users: gets USER role automatically
2. **Login**: Users authenticate via `/api/auth/login`
   - Returns JWT token stored in localStorage
   - Admin users redirected to admin dashboard
   - Regular users redirected to home dashboard

### 2. User Learning Flow
1. **Dashboard**: Users see enrolled courses and discover new ones via `/api/user/dashboard`
2. **Course Discovery**: Browse all available courses with enrollment status
3. **Course Enrollment**: 
   - View course details via `/api/course/{id}`
   - Enroll via `/api/user/enroll/{courseId}`
4. **Learning Process**:
   - Access course content via `/api/course/{id}/progress`
   - Complete technical content sections (mark as complete)
   - Take MCQ quizzes (locked until technical content is done)
   - Progress automatically saved via `/api/course/{id}/progress`
5. **Course Management**:
   - Like/unlike courses via `/api/course/{id}/like`
   - Unenroll via `/api/course/{id}/unenroll`

### 3. Admin Management Flow
1. **Admin Dashboard**: View system statistics via `/api/admin/users` and `/api/admin/courses`
2. **User Management**: 
   - View all users (excluding other admins)
   - Delete users via `/api/admin/users/{id}`
3. **Course Management**:
   - Create courses via `/api/admin/courses` (JSON upload or manual entry)
   - Edit courses via `/api/admin/courses/{id}`
   - Delete courses via `/api/admin/courses/{id}`

## Project Structure

```
src/main/java/com/example/duoclone/
├── config/           # Configuration classes
│   ├── CorsConfig.java
│   ├── DataInitializerConfig.java
│   ├── GameDataLoader.java
│   └── JacksonConfig.java
├── controller/       # REST API endpoints (ACTIVE)
│   ├── AuthController.java     
│   ├── CourseController.java   
│   ├── GameController.java     
│   ├── UserController.java     
│   └── AdminController.java    
├── model/           # Data models
│   ├── Course.java             
│   ├── GameQuestion.java       
│   ├── User.java               
│   ├── UserCourse.java         
│   └── [Other models...]       
├── repository/      # MongoDB repositories
│   ├── CourseRepository.java    
│   ├── GameQuestionRepository.java 
│   ├── UserCourseRepository.java
│   ├── UserRepository.java      
│   └── [Other repos...]         
├── security/        # Security configuration
│   ├── CustomUserDetailsService.java 
│   ├── JwtAuthenticationFilter.java   
│   ├── JwtUtil.java                   
│   └── SecurityConfig.java           
├── service/         # Business logic
│   └── GameService.java        
└── DuocloneApplication.java    
```

## Detailed API Documentation

### Authentication Endpoints (AuthController)

#### POST /api/auth/register
**Purpose**: Register a new user with automatic role assignment  
**Frontend Usage**: `SignUp.jsx` - User registration form  
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Success Response (201)**:
```json
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00"
}
```
**Error Response **:
```json
{
  "error": "Email already registered"
}
```

#### POST /api/auth/login
**Purpose**: Authenticate user and return JWT token  
**Frontend Usage**: `SignIn.jsx` - User login form  
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00"
}
```
**Error Response (401)**:
```json
{
  "error": "Invalid email or password"
}
```

#### POST /api/auth/validate
**Purpose**: Validate JWT token  
**Frontend Usage**: `api.js` - Automatic token validation  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "valid": true,
  "email": "john@example.com",
  "role": "USER"
}
```

### User Operations (UserController)

#### GET /api/user/dashboard
**Purpose**: Get all courses with user's enrollment status  
**Frontend Usage**: `Home.jsx` - Main dashboard course display  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
[
  {
    "id": "course123",
    "name": "Java Programming",
    "description": "Learn Java from basics to advanced",
    "progress": 45
  },
  {
    "id": "course456",
    "name": "Python Basics",
    "description": "Introduction to Python programming",
    "progress": 0
  }
]
```

#### GET /api/user/enrolled-courses
**Purpose**: Get only enrolled courses with progress  
**Frontend Usage**: `Home.jsx`, `Profile.jsx` - Enrolled courses section  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
[
  {
    "id": "course123",
    "name": "Java Programming",
    "description": "Learn Java from basics to advanced",
    "progress": 45
  }
]
```

#### POST /api/user/enroll/{courseId}
**Purpose**: Enroll user in a specific course  
**Frontend Usage**: `CourseEnroll.jsx` - Course enrollment button  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (201)**:
```json
{
  "message": "Successfully enrolled in course",
  "courseId": "course123",
  "courseName": "Java Programming"
}
```
**Error Response (409)**:
```json
{
  "message": "Already enrolled in this course",
  "courseId": "course123"
}
```

### Course Management (CourseController)

#### GET /api/course/{id}
**Purpose**: Get detailed course information with user's enrollment status  
**Frontend Usage**: `CourseEnroll.jsx`, `CourseContinue.jsx` - Course details display  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "id": "course123",
  "name": "Java Programming",
  "description": "Learn Java from basics to advanced",
  "fullDescription": "Comprehensive Java course covering OOP, collections, and more...",
  "level": "Beginner to Advanced",
  "duration": "~12 hours",
  "totalLessons": 25,
  "totalExercises": 60,
  "curriculum": [
    "Java Basics and Syntax",
    "Object-Oriented Programming",
    "Collections Framework"
  ],
  "technicalContent": [
    {
      "title": "Java Variables and Data Types",
      "content": "In Java, variables are containers that store data values...",
      "language": "java",
      "codeExample": "int number = 42;\nString text = \"Hello World\";"
    }
  ],
  "mcqQuestions": [
    {
      "question": "What is the correct way to declare an integer in Java?",
      "options": ["int x = 5;", "integer x = 5;", "Int x = 5;", "INTEGER x = 5;"],
      "correctAnswerIndex": 0,
      "explanation": "In Java, 'int' is the correct keyword for integer declaration."
    }
  ],
  "enrolled": true,
  "progress": 45,
  "completed": false,
  "liked": true
}
```

#### GET /api/course/{id}/progress
**Purpose**: Get user's detailed progress in a course  
**Frontend Usage**: `CourseContinue.jsx` - Load saved progress state  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "technicalProgress": [true, true, false, false, false],
  "mcqProgress": [true, false, false, false, false],
  "currentSection": "technical",
  "currentIndex": 2,
  "progress": 40
}
```

#### PUT /api/course/{id}/progress
**Purpose**: Update user's progress (technical/MCQ completion)  
**Frontend Usage**: `CourseContinue.jsx` - Save progress automatically  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "progress": 60,
  "technicalProgress": [true, true, true, false, false],
  "mcqProgress": [true, true, false, false, false],
  "currentSection": "mcq",
  "currentIndex": 2,
  "completed": false
}
```
**Success Response (200)**:
```json
{
  "message": "Progress updated successfully",
  "progress": 60
}
```

#### POST /api/course/{id}/like
**Purpose**: Add course to user's favorites  
**Frontend Usage**: `Home.jsx` - Heart icon click (like)  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "message": "Course liked successfully",
  "liked": true
}
```

#### DELETE /api/course/{id}/like
**Purpose**: Remove course from user's favorites  
**Frontend Usage**: `Home.jsx` - Heart icon click (unlike)  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "message": "Course unliked successfully",
  "liked": false
}
```

#### GET /api/course/liked
**Purpose**: Get user's liked course IDs  
**Frontend Usage**: `Home.jsx` - Display heart icons for liked courses  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
["course123", "course456", "course789"]
```

#### DELETE /api/course/{id}/unenroll
**Purpose**: Remove enrollment and all progress  
**Frontend Usage**: `CourseContinue.jsx` - Unenroll confirmation modal  
**Headers**: `Authorization: Bearer <token>`  
**Success Response (200)**:
```json
{
  "message": "Successfully unenrolled from course",
  "courseName": "Java Programming"
}
```

### Game System (GameController)

#### GET /api/game/start/{category}
**Purpose**: Get game questions by category  
**Frontend Usage**: Available in `api.js` but not actively used in current UI  
**Success Response (200)**:
```json
[
  {
    "id": "game123",
    "question": "What does JVM stand for?",
    "options": ["Java Virtual Machine", "Java Variable Method", "Java Version Manager"],
    "correctAnswer": "Java Virtual Machine",
    "category": "JAVA"
  }
]
```

### Admin Operations (AdminController)

#### GET /api/admin/users
**Purpose**: Get all users with enrollment statistics  
**Frontend Usage**: `AdminDashboard.jsx` - Users tab display  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Success Response (200)**:
```json
[
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "enrolledCourses": 3,
    "completedCourses": 1
  },
  {
    "id": "user456",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "USER",
    "enrolledCourses": 2,
    "completedCourses": 2
  }
]
```

#### GET /api/admin/courses
**Purpose**: Get all courses for admin management  
**Frontend Usage**: `AdminDashboard.jsx` - Courses tab display  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Success Response (200)**:
```json
[
  {
    "id": "course123",
    "name": "Java Programming",
    "description": "Learn Java from basics to advanced",
    "level": "Beginner to Advanced",
    "duration": "~12 hours",
    "totalLessons": 25,
    "totalExercises": 60
  }
]
```

#### GET /api/admin/users/{id}
**Purpose**: Get specific user details  
**Frontend Usage**: `UserView.jsx` - User detail page  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Success Response (200)**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "enrolledCourses": 3,
  "completedCourses": 1
}
```

#### DELETE /api/admin/users/{id}
**Purpose**: Delete user (prevents admin deletion)  
**Frontend Usage**: `AdminDashboard.jsx` - Delete user button  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Success Response (200)**:
```json
{
  "message": "User deleted successfully"
}
```

#### POST /api/admin/courses
**Purpose**: Create new course with full content  
**Frontend Usage**: `NewCourse.jsx` - Course creation form  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Request Body**:
```json
{
  "name": "Advanced Python",
  "description": "Master Python programming",
  "fullDescription": "Comprehensive Python course...",
  "level": "Advanced",
  "duration": "~15 hours",
  "totalLessons": 30,
  "totalExercises": 75,
  "curriculum": ["Advanced OOP", "Decorators", "Async Programming"],
  "technicalContent": [
    {
      "title": "Python Decorators",
      "content": "Decorators are a powerful feature in Python...",
      "language": "python",
      "codeExample": "@decorator\ndef function():\n    pass"
    }
  ],
  "mcqQuestions": [
    {
      "question": "What symbol is used for decorators in Python?",
      "options": ["@", "#", "&", "%"],
      "correctAnswerIndex": 0,
      "explanation": "The @ symbol is used to denote decorators in Python."
    }
  ]
}
```
**Success Response (201)**:
```json
{
  "message": "Course created successfully",
  "courseId": "course789",
  "courseName": "Advanced Python"
}
```

#### PUT /api/admin/courses/{id}
**Purpose**: Update existing course  
**Frontend Usage**: `EditCourse.jsx` - Course editing form  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Request Body**: Same as POST /api/admin/courses  
**Success Response (200)**:
```json
{
  "message": "Course updated successfully",
  "courseId": "course123"
}
```

#### DELETE /api/admin/courses/{id}
**Purpose**: Delete course  
**Frontend Usage**: `AdminDashboard.jsx` - Delete course button  
**Headers**: `Authorization: Bearer <token>` (Admin role required)  
**Success Response (200)**:
```json
{
  "message": "Course deleted successfully"
}
```

## Authentication & Authorization

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control
- **USER Role**: Access to user endpoints (`/api/user/*`, `/api/course/*`, `/api/game/*`)
- **ADMIN Role**: Access to all endpoints including admin operations (`/api/admin/*`)

### Error Responses
**401 Unauthorized**:
```json
{
  "error": "User not found"
}
```

**403 Forbidden**:
```json
{
  "error": "Access denied"
}
```

**404 Not Found**:
```json
{
  "error": "Course not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Operation failed: [specific error message]"
}
```


## Data Models

### Core Models (Active)
- **User**: Stores user information, role, and liked courses
- **Course**: Complete course data including technical content and MCQ questions
- **UserCourse**: Tracks enrollment, progress, and completion status
- **GameQuestion**: Stores game/quiz questions by category


## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MongoDB 4.4+

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd duoclone
   ```

2. **Install MongoDB**
   - Download and install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service on default port 27017

3. **Configure application properties**
   - The application is configured to connect to MongoDB on `localhost:27017`
   - Database name: `duoclone`
   - Default JWT secret is provided (change in production)

4. **Build the project**
   ```bash
   mvn clean install
   ```

5. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or run the JAR file:
   ```bash
   java -jar target/duoclone-0.0.1-SNAPSHOT.jar
   ```

6. **Verify installation**
   - The application will start on `http://localhost:8080`
   - MongoDB collections will be created automatically
   - Sample data will be loaded on first startup

## Configuration

### Database Configuration
The application uses MongoDB with the following default settings:
- Host: localhost
- Port: 27017
- Database: duoclone

### Security Configuration
- JWT tokens expire after 24 hours (86400000 ms)
- CORS is configured to allow requests from frontend
- Password encoding uses BCrypt


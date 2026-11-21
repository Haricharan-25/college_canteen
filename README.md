# CampusBite – Online College Canteen Food Ordering System

CampusBite is a commercial-grade, full-stack college canteen ordering web application engineered with **Spring Boot (Java 17)**, **React.js (Vite)**, and permanent **MySQL** database persistence.

---

## 1. System Architecture & Tech Stack

### Frontend
- **Framework:** React.js 18 with Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Iconography:** Lucide React
- **Design Theme:** Pure solid modern food-tech visual identity:
  - Primary: `#2563EB` (Solid Royal Blue)
  - Secondary: `#0F172A` (Solid Dark Slate Navy)
  - Background: `#F8FAFC` (Clean light-grey surface)
  - Cards: `#FFFFFF` with crisp borders and soft shadows
  - **Zero Gradients**: Follows clean, distraction-free commercial SaaS ergonomics.

### Backend
- **Framework:** Java 17, Spring Boot 3.2.4
- **Modules:** Spring Web, Spring Data JPA, Hibernate, Bean Validation
- **Architecture:** Layered Architecture (`controller`, `service`, `repository`, `model`, `dto`, `config`)
- **API Style:** RESTful endpoints with input validation, CORS configuration, and centralized global exception handling

### Database
- **Engine:** MySQL 8.0+
- **Database Name:** `campusbite_db`
- **Tables:** `users`, `food`, `orders`, `order_items`
- **Relationships:** Foreign key constraints with cascading deletes for order items and user associations.
- **Auto-Seeder:** Built-in `DatabaseSeeder.java` auto-populates initial users, sample food items across all 4 categories, and demo orders when tables are empty.

---

## 2. Directory Structure

```
college-fsd/
│
├── backend/                               # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/campusbite/backend/
│   │   │   │   ├── config/               # CorsConfig, DatabaseSeeder, GlobalExceptionHandler
│   │   │   │   ├── controller/           # FoodController, OrderController, AdminController, AuthController
│   │   │   │   ├── dto/                  # FoodDTO, OrderRequestDTO, OrderResponseDTO, AuthDTO, AdminDashboardStatsDTO
│   │   │   │   ├── model/                # Food, User, Order, OrderItem entities
│   │   │   │   ├── repository/           # FoodRepository, OrderRepository, OrderItemRepository, UserRepository
│   │   │   │   ├── service/              # FoodService, OrderService, AdminService, AuthService
│   │   │   │   └── CampusBiteApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties# MySQL connection settings
│   │   │       └── schema.sql            # Table definitions and seed data
│   │   └── test/
│   ├── pom.xml                           # Maven dependencies
│   └── target/                           # Compiled Java bytecode
│
├── frontend/                              # React Single Page Application
│   ├── public/                           # SVG icons and static assets
│   ├── src/
│   │   ├── components/                   # Navbar, FoodCard, OrderTracker
│   │   ├── context/                      # AuthContext (Role Switcher), CartContext
│   │   ├── pages/                        # Home, Menu, Cart, OrderTracking, OrderHistory, AdminDashboard, Auth
│   │   ├── services/                     # Axios REST API connectors
│   │   ├── App.jsx                       # App routes and Admin protection guard
│   │   ├── index.css                     # Design tokens and solid-color styling
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── dist/                             # Production-ready build
│
├── start-backend.bat                      # One-click Windows starter for Spring Boot
├── start-frontend.bat                     # One-click Windows starter for React Vite
└── README.md
```

---

## 3. Database Setup Instructions (MySQL)

1. Ensure MySQL Server is running locally on port `3306`.
2. Open MySQL Workbench or MySQL CLI:
   ```bash
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS campusbite_db;
   ```
4. Verify or update credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campusbite_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```
5. *(Optional)* If you wish to execute the SQL script manually, load `backend/src/main/resources/schema.sql`. (Note: Spring Boot's `DatabaseSeeder` will also auto-seed the tables on first startup).

---

## 4. How to Run the Application

### Option A: Using One-Click Batch Files
- Double-click `start-backend.bat` to launch the Spring Boot backend on `http://localhost:8080`.
- Double-click `start-frontend.bat` to launch the React frontend on `http://localhost:3000`.

### Option B: Running from Terminal

#### 1. Start Spring Boot Backend:
```bash
cd backend
mvn spring-boot:run
```
*(Note: If passing `-Dmaven.repo.local` manually in PowerShell, enclose it in quotes: `mvn "-Dmaven.repo.local=C:\college-fsd\backend\.m2repo" spring-boot:run`. However, this is already configured in `.mvn/maven.config`, so plain `mvn spring-boot:run` works immediately!)*

Backend will listen at: `http://localhost:8080`

#### 2. Start React Frontend:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`

---

## 5. Pre-Seeded Demonstration Accounts

For viva and project demonstrations, the top navigation banner includes a 1-click **Role Switcher** ("Student View" vs "Admin View") or you can log in through `/login`:

| Role | Name | Email | Password |
|---|---|---|---|
| **Canteen Admin** | Admin Canteen Staff | `admin@canteen.com` | `admin123` |
| **Student** | Rahul Sharma | `rahul@college.edu` | `student123` |
| **Student** | Priya Patel | `priya@college.edu` | `student123` |

---

## 6. Key Application Features

### Student Module
- **Student Dashboard:** Welcome banner, peak hour notices, search bar, and popular meal cards.
- **Dynamic Food Menu:** Categorized tabs (**Breakfast**, **Lunch**, **Snacks**, **Beverages**), live dish availability badge, and single-click Add to Cart.
- **Real-time Dish Search:** Filter dishes by name with dynamic instant re-rendering and friendly empty states.
- **Cart & Pricing Engine:** Subtotal calculations, quantity modifier (+ / -), and safety check preventing ordering of unavailable dishes.
- **Order Placement:** Generates unique order reference IDs (`CB-YYYYMMDD-XXXX`), calculates final totals using server-side database rates, and saves directly to MySQL.
- **Live Order Tracking:** 5-stage progress indicator:
  `Order Received` ➔ `Accepted` ➔ `Preparing Food` ➔ `Ready for Pickup` ➔ `Order Completed`
  Includes automatic 5-second polling for live kitchen changes.
- **Order History:** Full audit trail of past orders with timestamps, ordered dishes, and status links.

### Admin Module
- **Operations Dashboard:** Live KPI cards (**Total Foods**, **Total Orders**, **Pending Queue**, **Completed Pickups**) and quick shortcuts.
- **Kitchen Order Management:** View all incoming student orders, inspect ordered item breakdown, filter by status, and change kitchen progress with instant student-side synchronization.
- **Food Catalog Management:**
  - Add new dishes with photos, categories, and INR prices.
  - Update dish names, descriptions, and pricing.
  - 1-click toggle for dish availability (Available / Sold Out).
  - Delete dishes with confirmation dialogs.

---

## 7. REST API Documentation

### Public / Food APIs
- `GET /api/foods`: List all dishes (supports `?category=Lunch`, `?search=dosa`, `?availableOnly=true`)
- `GET /api/foods/{id}`: Get specific food item

### Order APIs
- `POST /api/orders`: Submit cart order (computes totals from DB prices)
- `GET /api/orders`: List all orders
- `GET /api/orders/{id}`: Get order by ID
- `GET /api/orders/number/{orderNumber}`: Get order by code (e.g. `CB-20261121-1042`)
- `GET /api/orders/my?userId={id}`: List student order history

### Admin Operations
- `GET /api/admin/stats`: Get dashboard metrics (total foods, orders, pending, completed)
- `GET /api/admin/orders?status={status}`: Filter orders by status
- `PATCH /api/admin/orders/{id}/status`: Update order status (`{ "status": "Preparing" }`)
- `POST /api/admin/foods`: Add new food item
- `PUT /api/admin/foods/{id}`: Update existing food item
- `DELETE /api/admin/foods/{id}`: Delete food item

### Auth APIs
- `POST /api/auth/login`: Student & Admin authentication
- `POST /api/auth/register`: Create new student/canteen account

# ShopSphere - Full-Stack E-Commerce Platform

ShopSphere is a feature-rich, responsive, full-stack e-commerce application. It includes a complete customer shopping portal, a secure checkout system with Razorpay integration, and a comprehensive admin panel for inventory and order management.

---

## 🚀 Key Features

### **Customer Features**
* **Authentication**: Secure registration, login, and session persistence using Spring Security and JWT.
* **Product Catalog**: Browse products, view rich detailed descriptions, filter by category, price, and discounts, and sort dynamically.
* **Shopping Cart**: Fully functional persistent cart with real-time price updates and quantity management.
* **Order Management**: Add shipping addresses, place orders, and review past order history.
* **Payment Gateway**: Secured checkout integrated with the **Razorpay API** for processing payments.
* **Email Notifications**: Automated mail notifications for order placement and status updates.

### **Admin Dashboard**
* **Inventory Control**: Add, edit, delete, and view product lists.
* **Order Tracking**: Review all customer orders, modify status (Pending, Placed, Shipped, Delivered), and process order cancellations.
* **Product Insights**: Interactive charts showing sales data and stock availability.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React, Redux (State Management), Tailwind CSS, Material-UI (MUI), Alice Carousel, Axios |
| **Backend** | Java (JDK 17/22), Spring Boot, Spring Security (JWT), Spring Data JPA, Java Mail |
| **Database** | H2 (Local Development), MySQL (Production / Live) |
| **API Testing** | Postman (Collection file included in root) |

---

## 📁 Directory Structure

```text
ecommerce-project/
├── ecommerce-server/      # Spring Boot backend codebase
│   ├── src/               # Java classes and resource configurations
│   ├── data/              # Local file-based H2 database location
│   ├── start-server.bat   # Batch script to start backend (Cmd)
│   └── start-backend.ps1  # PowerShell script to start backend
├── react/                 # React frontend codebase
│   ├── src/               # React components, routes, and Redux actions
│   └── public/            # Public web assets
├── admin credential.txt   # Default system administrator login credentials
├── Ecommerce Api.postman_collection.json  # Import this into Postman to test APIs
└── README.md              # Project documentation
```

---

## 💻 Local Setup & Installation

### **1. Run the Backend (Spring Boot)**
By default, the backend is configured to use a file-based **H2 database**. There is **no need** to set up a local database server like MySQL or PostgreSQL to test it locally.

1. Navigate to the backend directory:
   ```bash
   cd ecommerce-server
   ```
2. Run the server:
   * **On Windows Command Prompt**: Run `start-server.bat`
   * **On PowerShell**: Run `.\start-backend.ps1`
   * **Direct Maven execution**: `.\mvnw spring-boot:run`

*The backend will run locally on `http://localhost:5454`.*

### **2. Run the Frontend (React)**
1. Navigate to the frontend directory:
   ```bash
   cd ../react
   ```
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

*The React application will launch automatically at `http://localhost:3000`.*

---

## 🔑 Administrator Credentials

To access the Admin Panel, sign in on the client portal with the default admin account:
* **Email**: `shelkerohan2001@gmail.com`
* **Password**: `Rohan@12`

---

## ☁️ Deployment Guide (Going Live)

This project is pre-configured with production environment variables to make hosting easy:

### **1. Database Setup**
1. Spin up a production MySQL database (e.g. on Railway, Aiven, or Clever Cloud).
2. Grab the connection details (`Host`, `User`, `Password`, `Database Name`).

### **2. Deploy Backend (e.g. Railway)**
1. Connect your GitHub repository to **Railway.app**.
2. Add your GitHub repository to a project, selecting the **`/ecommerce-server`** directory as your root.
3. In the Railway **Variables** settings, link the following environment variables to map to your production MySQL instance:
   * `SPRING_DATASOURCE_URL` = `jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}`
   * `SPRING_DATASOURCE_USERNAME` = `${{MYSQLUSER}}`
   * `SPRING_DATASOURCE_PASSWORD` = `${{MYSQLPASSWORD}}`
   * `SPRING_DATASOURCE_DRIVER_CLASS_NAME` = `com.mysql.cj.jdbc.Driver`
   * `SPRING_JPA_DATABASE_PLATFORM` = `org.hibernate.dialect.MySQLDialect`
4. Set optional variables for production payments/email integration:
   * `RAZORPAY_API_KEY` / `RAZORPAY_API_SECRET`
   * `SPRING_MAIL_USERNAME` / `SPRING_MAIL_PASSWORD`
5. Generate a public domain under Settings.

### **3. Deploy Frontend (e.g. Vercel)**
1. Import your GitHub repository into **Vercel.com**.
2. Choose **`/react`** as the Root Directory.
3. Under **Environment Variables**, add:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: *(your live Railway backend domain URL)*
4. Click **Deploy**.

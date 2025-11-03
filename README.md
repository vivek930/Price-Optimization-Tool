# 📊 Price Optimization Tool

A full-stack web application that helps businesses **manage products, forecast demand, and optimize pricing**.  
This project was developed as part of a hiring assessment.

---

## 🚀 Features

- **User Authentication & Roles** → Admin, Supplier, Buyer.
- **Product Management (CRUD)** → create, update, delete, view products.
- **Demand Forecasting** → linear forecast with chart visualization.
- **Price Optimization** → recommend optimal selling prices.
- **Search & Filter** → efficient product search and category filtering.
- **PostgreSQL Database** → relational data storage.

---

## 🛠 Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React.js, Redux Toolkit, Redux Saga, Material UI
- **Database:** PostgreSQL
- **Visualization:** Chart.js
- **State Management:** Redux

---

## ⚡ Setup Instructions (Without Docker)

## 📌 Notes - Please follow the README carefully for setup.

### 1️⃣ Prerequisites

- Install _Python_
- Install _Node.js_ and npm
- Install _PostgreSQL_

---

### 2️⃣ Database Setup

1. Start PostgreSQL on your machine.
2. Create a database (e.g., `pricing_tool`).
3. Update the `.env` file inside `backend/` with your database credentials:

   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/pricing_tool
   ```

---

### Backend Setup

# Navigate to backend

cd pricing-backend

# Create and activate virtual environment

python -m venv venv
source venv/bin/activate # Linux/Mac
venv\Scripts\activate # Windows

# Install dependencies

pip install -r requirements.txt

# Run backend server

uvicorn app.main:app --reload --host laocalhost --port 8000

# API will be available via Swagger UI:

👉 http://localhost:{PORT}/docs

---

### Frontend Setup

# Open new terminal and navigate to frontend

cd pricing-frontend

# Install dependencies

npm install

# Start frontend

npm start

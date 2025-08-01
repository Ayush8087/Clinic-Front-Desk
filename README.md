# Clinic Front Desk System

A simple, web-based application built to manage patient queues and doctor appointments at a clinic, allowing front desk staff to efficiently handle daily operations.

![image alt](https://github.com/Ayush8087/Clinic-Front-Desk/blob/main/assign%20queue.png?raw=true)

## Overview

This project is a full-stack application designed for a clinic's front desk. It provides a secure, intuitive dashboard for staff to manage walk-in patient queues, schedule appointments with doctors, and maintain up-to-date records of doctor profiles and their availability. The system is built with a modern technology stack, featuring a NestJS backend and a Next.js frontend.

## Key Features

This application implements all the core and bonus features outlined in the project description:

### Authentication
- **Secure Login:** A JWT-based authentication system allows front desk staff to log in securely.

### Queue Management
- **Add Patients to Queue:** Front desk staff can add walk-in patients to the queue, and the system automatically assigns them a queue number.
- **Track Patient Progress:** The status of each patient in the queue can be updated (e.g., "Waiting", "With Doctor", "Completed").
- **Prioritize Patients (Bonus Feature):** The system supports marking patients as "Urgent," which automatically moves them to the top of the queue. Staff can also mark an existing patient as urgent directly from the dashboard.

### Doctor Management
- **Manage Doctor Profiles:** Staff have full CRUD (Create, Read, Update, Delete) functionality to manage doctor profiles.
- **Detailed Profiles:** Each profile includes the doctor's name, specialization, gender, location, and current availability ("Available", "Busy", "Off Duty").
- **Next Availability:** For doctors who are busy or off-duty, their next available time slot can be displayed on the dashboard.

### Appointment Management
- **Book, Reschedule, & Cancel:** Staff can book new appointments, reschedule existing ones, and cancel appointments when necessary.
- **Track Appointment Status:** The status of each appointment can be tracked and updated (e.g., "Booked", "Completed", "Canceled").

### Search & Filter
- **Search Doctors:** The dashboard includes a search bar to quickly find doctors by their name or specialization.

## Technology Stack

The project is built with a modern, scalable, and type-safe technology stack.

### Backend
- **Framework:** **NestJS** (a progressive Node.js framework)
- **Database:** **MySQL**
- **ORM:** **TypeORM** (for database interactions)
- **Authentication:** **JWT** (JSON Web Tokens) for secure API endpoints

### Frontend
- **Framework:** **Next.js** (a React framework)
- **Styling:** **Tailwind CSS** (for fast and responsive UI styling)
- **Language:** **TypeScript**

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v18 or later)
- npm
- MySQL Server

### 1. Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Create the environment file
# Create a new file named .env and update it with your MySQL database credentials.
# DB_PASSWORD=your_mysql_password

# 3. Install dependencies
npm install

# 4. Run the development server
npm run start:dev
''''''
The backend server will be running at `http://localhost:3001`.

### 2. Frontend Setup

```bash
# 1. Open a new terminal and navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

## How to Use

1.  Ensure both the backend and frontend servers are running.
2.  Open your browser and navigate to `http://localhost:3000`.
3.  Log in with the default credentials:
    - **Username:** `frontdesk`
    - **Password:** `password`
4.  You will be redirected to the main dashboard where you can manage the clinic's operations.



# 📋 Front Desk System at a Clinic - Task List with Images

## 🔐 Authentication
- [ ] Implement login functionality for front desk staff  
  ![image alt](

## 🧑‍⚕️ Doctor Management
- [ ] Add doctor profiles  
  ![image alt](

- [ ] Edit doctor profiles  
  ![image alt](

- [ ] Delete doctor profiles  
  ![image alt](

- [ ] Search doctors by specialization  
 ![image alt](

- [ ] Filter doctors by location and availability  
  ![image alt](

## 📅 Appointment Management
- [ ] View all appointments  
 ![image alt](

- [ ] Book appointments  
 ![image alt](

- [ ] Reschedule appointments  
 ![image alt](

- [ ] Cancel appointments  
  ![image alt](

- [ ] Update appointment status (booked, completed, canceled)  
 ![image alt](

## 🪪 Queue Management
- [ ] Add walk-in patients to queue  
![image alt](

- [ ] Assign queue numbers  
![image alt](

- [ ] Update patient queue status (Waiting, With Doctor, Completed)  
![image alt](

- [ ] View and manage queue  
 ![image alt](

## 💻 Frontend Pages
- [ ] Build Front Desk Page  
 ![image alt](

- [ ] Build Queue Management Page  
![image alt](

- [ ] Build Appointment Management View  
 ![image alt](

## 🌟 Bonus Features (Optional)
- [ ] Deploy the application  
![image alt](

- [ ] Prioritize urgent patients in queue  
 ![image alt](
![image alt](


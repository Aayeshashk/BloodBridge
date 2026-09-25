# 🩸 BloodBridge

> A web-based platform for connecting blood donors, hospitals, and blood availability during emergency situations.

BloodBridge is a frontend web application designed to simplify the coordination of blood donation and emergency blood requests through a centralized and user-friendly interface.

The project focuses on the interaction between **Donors, Hospitals, Blood Banks, and Administrators**, providing interfaces for blood discovery, emergency requests, availability, notifications, and request tracking.

---

## ✨ Features

### 🩸 Donor Management

- Donor registration and login interface
- Donor profile management
- Blood group information
- Donor availability management

### 🚨 Emergency Blood Requests

- Create emergency blood requests
- Specify required blood group and number of units
- Track request status
- Emergency request workflow

### 🏥 Hospital Management

- Hospital-side blood request interface
- View blood availability
- Manage active requests
- Track request progress

### 🏦 Blood Bank Management

- Blood inventory interface
- Blood group availability
- Inventory management interface
- Blood request coordination

### 🔔 Notifications

- Notification interface for important blood request updates
- Request and matching status notifications

### 📊 Dashboard

- Role-based dashboard interfaces
- Blood request overview
- Blood availability overview
- User activity information

### 📱 Responsive Design

- Clean and intuitive user interface
- Responsive layouts
- Modern dashboard-style design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Application structure |
| **CSS3** | Styling and responsive design |
| **JavaScript** | Frontend logic and interactions |
| **LocalStorage** | Prototype data persistence |

---

## 🏗️ System Overview

BloodBridge is designed around four primary user roles:

```text
                    ┌──────────────────┐
                    │    BloodBridge   │
                    └────────┬─────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
          Donor           Hospital        Blood Bank
             │               │               │
             └───────────────┼───────────────┘
                             │
                             ▼
                     Blood Coordination
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         Blood Search   Blood Requests   Availability
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                       Request Tracking

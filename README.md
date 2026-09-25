🩸 BloodBridge

A web-based platform for connecting blood donors, hospitals, and blood availability during emergency situations.

BloodBridge is a frontend prototype designed to simplify the coordination of blood donation and emergency blood requests through a centralized, user-friendly interface.

The project focuses on the interaction between donors, hospitals, blood banks, and administrators, with interfaces for blood discovery, emergency requests, availability, notifications, and request tracking.

✨ Features
🩸 Blood & Donor Management
Donor registration and login interface
Donor profile management
Blood group information
Donor availability interface
🚨 Emergency Requests
Create emergency blood requests
Specify required blood group and units
View and track request status
Emergency request workflow
🏥 Blood Bank & Hospital Interface
Blood availability interface
Blood inventory representation
Hospital-side request management
Blood bank-side management interface
🔔 Notifications
Notification interface for important request and matching updates
📊 Dashboard
Role-based dashboard interfaces
Overview of blood requests and availability
User activity information
📱 Responsive Design
Clean and intuitive UI
Responsive layouts for different screen sizes
🛠️ Tech Stack
Technology	Purpose
HTML5	Application structure
CSS3	Styling and responsive UI
JavaScript	Frontend logic and interactions
LocalStorage	Prototype data persistence
🏗️ Project Architecture
                    BLOODBRIDGE
                        │
             ┌──────────┴──────────┐
             │                     │
          Users                Institutions
             │                     │
      ┌──────┼──────┐        ┌────┴────┐
      │      │      │        │         │
    Donor  Hospital Admin  Blood Bank
      │      │      │        │
      └──────┴──────┴────────┘
                 │
                 ▼
        Blood Coordination
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Search   Requests  Availability
📂 Project Structure
BloodBridge/
│
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
File Overview

index.html
Contains the main application interface and page structure.

style.css
Contains the visual styling, layouts, components, and responsive design.

script.js
Handles frontend interactions, application logic, and prototype data handling.

.gitignore
Specifies files and folders that should not be tracked by Git.

🚀 Getting Started
Clone the repository
git clone https://github.com/Aayeshashk/BloodBridge.git
Open the project
cd BloodBridge
Run locally

You can open index.html directly in a browser.

For development, you can also use VS Code Live Server.

🎯 Project Objective

BloodBridge aims to demonstrate how a centralized software platform can help coordinate blood donors, hospitals, and blood banks.

The project was designed around the following core workflow:

Blood Requirement
       ↓
Emergency Request
       ↓
Blood Search
       ↓
Potential Matching
       ↓
Availability
       ↓
Request Tracking

The prototype focuses primarily on the user experience and frontend implementation of this workflow.

🔮 Future Scope

The current version is a frontend prototype. A future full-stack version could introduce:

Backend REST APIs
PostgreSQL database
Secure user authentication
Real-time blood inventory
Location-based donor matching
Hospital and blood-bank verification
Emergency request prioritization
Real-time notifications
Request audit history
Administrative management
Cloud deployment
⚠️ Disclaimer

BloodBridge is an academic and portfolio prototype. It is not intended to replace hospitals, blood banks, healthcare professionals, or official medical systems.

👩‍💻 Author

Aayesha

Computer Engineering Student

GitHub

📄 License

This project is intended for educational and portfolio purposes.
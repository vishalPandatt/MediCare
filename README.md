# MediCare - Full Stack Healthcare Portal

A complete healthcare platform with Node.js backend and SQLite database integration.

## 📋 Features
- ✅ Patient & Doctor Registration & Login
- ✅ Persistent data storage with SQLite
- ✅ Book appointments (Patients)
- ✅ View patients list (Doctors)
- ✅ User profile management
- ✅ Responsive UI with full-screen login
- ✅ RESTful API backend

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **APIs**: RESTful with CORS support

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Backend Dependencies
```bash
cd "c:\Users\Dell\Desktop\My html\MediCare"
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database
- `cors` - Enable cross-origin requests

### Step 2: Start the Backend Server
```bash
npm start
```

You should see:
```
✅ MediCare Backend Server running on http://localhost:3001
📁 Database: ./medicare.db
🔌 CORS enabled for frontend
```

### Step 3: Start the Frontend (Keep backend running)
In a new terminal:
```bash
cd "c:\Users\Dell\Desktop\My html\MediCare"
npx http-server -p 8000
```

Or if you have the http-server already running, just ensure port 3001 is used for backend.

### Step 4: Access the Application
Open your browser and go to:
```
http://localhost:8000
```

## 🔑 Default Test Accounts

You can create your own account by registering, but here are some test credentials:

**Patient:**
- Email: patient@test.com
- Password: pass123

**Doctor:**
- Email: doctor@test.com
- Password: pass123

## 📝 Usage

### For Patients:
1. Click "Patient Login" button
2. Register with Name, Email, and Password
3. Login with your credentials
4. Click "📅 Book Appointment"
5. Select a doctor and enter date/time
6. View your profile to see personal information

### For Doctors:
1. Click "Doctor Login" button
2. Register with Name, Email, and Password
3. Login with your credentials
4. Click "👥 View Patients List"
5. View all registered patients
6. View your profile to see professional information

## 📂 Project Structure
```
MediCare/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
├── medicare.db         # SQLite database (created automatically)
└── README.md          # This file
```

## 🗄️ Database Schema

### Patients Table
- id (Primary Key)
- name, email (Unique), password
- phone, age, gender, bloodType
- height, weight, address
- emergencyContact, medicalHistory, allergies
- createdAt (timestamp)

### Doctors Table
- id (Primary Key)
- name, email (Unique), password
- phone, specialization
- license (Unique), bio
- createdAt (timestamp)

### Appointments Table
- id (Primary Key)
- patientId, patientName (references patients)
- doctorId, doctorName (references doctors)
- specialization, date, time
- status (default: 'Scheduled')
- notes, createdAt (timestamp)

## 🔌 API Endpoints

### Patient Endpoints
- `POST /api/patients/register` - Register new patient
- `POST /api/patients/login` - Login patient
- `GET /api/patients/:id` - Get patient profile
- `GET /api/patients` - Get all patients

### Doctor Endpoints
- `POST /api/doctors/register` - Register new doctor
- `POST /api/doctors/login` - Login doctor
- `GET /api/doctors/:id` - Get doctor profile
- `GET /api/doctors` - Get all doctors

### Appointment Endpoints
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/patient/:patientId` - Get patient's appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor's appointments

## 🐛 Troubleshooting

**Error: "Backend server is running on port 3001"**
- Make sure backend is running: `npm start`
- Check if port 3001 is available
- Windows: Run Command Prompt/PowerShell as Administrator

**Error: "CORS error"**
- Backend may not be running
- Check that both services are running on correct ports

**Database not found**
- Database is created automatically on first run
- Check `c:\Users\Dell\Desktop\My html\MediCare\medicare.db`

**Cannot login with registered account**
- Make sure backend is running
- Check browser console for error messages
- Verify email and password are correct

## 🚀 Future Enhancements
- Add prescription management
- Implement email notifications
- Add appointment reminders
- Create admin dashboard
- Add payment integration
- Medical records storage
- Video consultation feature

## 📧 Support
For issues or questions, please check the console logs in both backend terminal and browser developer tools.

---

**MediCare v1.0** - Built with ❤️ for better healthcare

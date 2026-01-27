╔════════════════════════════════════════════════════════════════╗
║              MEDICARE - QUICK START GUIDE v1.0                 ║
╚════════════════════════════════════════════════════════════════╝

📋 WHAT YOU HAVE BUILT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Full Healthcare Portal (MediCare)
   ├─ Frontend: HTML5, CSS3, JavaScript
   ├─ Backend: Node.js + Express.js
   ├─ Database: SQLite3
   └─ Users: Patients & Doctors


🚀 TO GET STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. VERIFY SETUP (Optional but recommended)
   $ node verify-setup.js

2. START BACKEND (Terminal 1)
   $ npm start
   
   You should see:
   ✅ Backend Server running on http://localhost:3001
   ✅ Connected to SQLite database

3. START FRONTEND (Terminal 2)
   $ npx http-server -p 8000

   You should see:
   Starting up http-server, serving ./
   Available on: http://127.0.0.1:8000

4. OPEN IN BROWSER
   → Go to: http://127.0.0.1:8000


📝 FIRST TIME USER FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Register
   ├─ Click "Login" button
   ├─ Click "Patient Registration" or "Doctor Registration"
   ├─ Fill in: Name, Email, Password
   └─ Click "Register"

Step 2: Login
   ├─ Click "Login" button
   ├─ Click "Patient Login" or "Doctor Login"
   ├─ Use same email & password from registration
   └─ Click "Login"

Step 3: Use Features
   ├─ PATIENT: Click "Book Appointment"
   ├─ DOCTOR: Click "View Patients"
   └─ Click user icon (top-right) → "View Profile"


🛠️ WHAT'S INSIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Project Files:
   ├─ index.html ......... Main UI
   ├─ script.js .......... Frontend logic & API calls
   ├─ styles.css ........ Styling
   ├─ server.js ......... Backend server & API
   ├─ package.json ....... Dependencies
   └─ medicare.db ........ Database (auto-created)

📦 Dependencies:
   ├─ express@4.18.2 .... Web framework
   ├─ sqlite3@5.1.6 ..... Database driver
   └─ cors@2.8.5 ........ Cross-origin support


🔌 API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BASE URL: http://localhost:3001/api

Authentication:
   POST /patients/register .... Register patient
   POST /patients/login ....... Login patient
   POST /doctors/register ..... Register doctor
   POST /doctors/login ........ Login doctor

Data Operations:
   GET  /patients ............. List all patients
   GET  /doctors .............. List all doctors
   POST /appointments ......... Book appointment
   GET  /appointments ......... Get appointments


💾 DATABASE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENTS Table:
   ├─ id ...................... Unique ID
   ├─ name .................... Full name
   ├─ email ................... Email (UNIQUE)
   ├─ password ................ Encrypted
   ├─ phone, age, gender ...... Personal info
   └─ bloodType, height, weight Health info

DOCTORS Table:
   ├─ id ...................... Unique ID
   ├─ name .................... Full name
   ├─ email ................... Email (UNIQUE)
   ├─ password ................ Encrypted
   ├─ phone ................... Contact
   ├─ specialization .......... Medical specialty
   └─ license ................. Medical license

APPOINTMENTS Table:
   ├─ id ...................... Unique ID
   ├─ patientId, patientName .. Patient info
   ├─ doctorId, doctorName .... Doctor info
   ├─ appointmentDate ......... When
   ├─ reason .................. Why
   └─ status .................. Confirmed/Pending


⚙️ CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backend Port ................... 3001
Frontend Port .................. 8000
Database File .................. medicare.db
API Base URL ................... http://localhost:3001/api


❌ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Backend not running"
   → Run: npm start (Terminal 1)

"Login failed" error
   → Register first! (Don't login without registering)
   → Check: Both servers running
   → See: TROUBLESHOOTING.txt

"Port already in use"
   → Check: netstat -ano | findstr 3001
   → Kill: taskkill /pid <PID> /f

"Database errors"
   → Delete: medicare.db
   → Restart: npm start


📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full docs in: README.md
Troubleshooting: TROUBLESHOOTING.txt
Setup verification: node verify-setup.js


🎯 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENTS Can:
   ✅ Register & Login
   ✅ View Profile
   ✅ Book Appointments
   ✅ Logout

DOCTORS Can:
   ✅ Register & Login
   ✅ View Profile
   ✅ See Patients List
   ✅ Logout

SYSTEM Features:
   ✅ Persistent data (SQLite)
   ✅ Error handling & validation
   ✅ Full-screen login/register
   ✅ User menu dropdown
   ✅ Responsive navigation


🔐 SECURITY NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  This is a LEARNING PROJECT, not production-ready
   - Passwords stored plain (add bcrypt for production)
   - No JWT tokens (use for production)
   - CORS allows all origins (restrict in production)
   - No rate limiting (add for production)


═══════════════════════════════════════════════════════════════════

Need help? Check: TROUBLESHOOTING.txt or README.md

Happy coding! 🚀

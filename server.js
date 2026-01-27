const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database('./medicare.db', (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// Initialize Database Tables
function initializeDatabase() {
    // Create Users (Patients) Table
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            age INTEGER,
            gender TEXT,
            bloodType TEXT,
            height TEXT,
            weight TEXT,
            address TEXT,
            emergencyContact TEXT,
            medicalHistory TEXT,
            allergies TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create Doctors Table
    db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            specialization TEXT,
            license TEXT UNIQUE NOT NULL,
            bio TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create Appointments Table
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientId INTEGER NOT NULL,
            patientName TEXT NOT NULL,
            doctorId INTEGER NOT NULL,
            doctorName TEXT NOT NULL,
            specialization TEXT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            status TEXT DEFAULT 'Scheduled',
            notes TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(patientId) REFERENCES patients(id),
            FOREIGN KEY(doctorId) REFERENCES doctors(id)
        )
    `);

    console.log('Database tables initialized');
}

// ==================== PATIENT ROUTES ====================

// Register Patient
app.post('/api/patients/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    db.run(
        `INSERT INTO patients (name, email, password, age, gender, bloodType, phone, height, weight, address, emergencyContact, medicalHistory, allergies)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, 30, 'Not Specified', 'O+', '555-0000', 'Not Provided', 'Not Provided', 'Not Provided', 'Not Provided', 'None', 'None'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                return res.status(500).json({ error: 'Registration failed' });
            }
            res.json({ id: this.lastID, message: 'Patient registered successfully' });
        }
    );
});

// Login Patient
app.post('/api/patients/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
        `SELECT * FROM patients WHERE email = ? AND password = ?`,
        [email, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Login failed' });
            }
            if (!row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.json({ 
                success: true, 
                user: row,
                userType: 'patient'
            });
        }
    );
});

// Get Patient Profile
app.get('/api/patients/:id', (req, res) => {
    db.get(
        `SELECT * FROM patients WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch patient' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.json(row);
        }
    );
});

// Get All Patients
app.get('/api/patients', (req, res) => {
    db.all(
        `SELECT id, name, email, phone, age, gender, bloodType FROM patients`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch patients' });
            }
            res.json(rows);
        }
    );
});

// ==================== DOCTOR ROUTES ====================

// Register Doctor
app.post('/api/doctors/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const license = 'LIC' + Date.now();

    db.run(
        `INSERT INTO doctors (name, email, password, specialization, license, phone, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, 'General Practitioner', license, '555-0000', 'Professional healthcare provider'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                return res.status(500).json({ error: 'Registration failed' });
            }
            res.json({ id: this.lastID, message: 'Doctor registered successfully' });
        }
    );
});

// Login Doctor
app.post('/api/doctors/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
        `SELECT * FROM doctors WHERE email = ? AND password = ?`,
        [email, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Login failed' });
            }
            if (!row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.json({ 
                success: true, 
                user: row,
                userType: 'doctor'
            });
        }
    );
});

// Get Doctor Profile
app.get('/api/doctors/:id', (req, res) => {
    db.get(
        `SELECT * FROM doctors WHERE id = ?`,
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch doctor' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            res.json(row);
        }
    );
});

// Get All Doctors
app.get('/api/doctors', (req, res) => {
    db.all(
        `SELECT id, name, specialization, license, phone FROM doctors`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch doctors' });
            }
            res.json(rows);
        }
    );
});

// ==================== APPOINTMENT ROUTES ====================

// Book Appointment
app.post('/api/appointments', (req, res) => {
    const { patientId, patientName, doctorId, doctorName, specialization, date, time } = req.body;

    if (!patientId || !doctorId || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `INSERT INTO appointments (patientId, patientName, doctorId, doctorName, specialization, date, time, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [patientId, patientName, doctorId, doctorName, specialization, date, time, 'Scheduled', ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to book appointment' });
            }
            res.json({ id: this.lastID, message: 'Appointment booked successfully' });
        }
    );
});

// Get Appointments for Patient
app.get('/api/appointments/patient/:patientId', (req, res) => {
    db.all(
        `SELECT * FROM appointments WHERE patientId = ? ORDER BY date DESC`,
        [req.params.patientId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch appointments' });
            }
            res.json(rows || []);
        }
    );
});

// Get Appointments for Doctor
app.get('/api/appointments/doctor/:doctorId', (req, res) => {
    db.all(
        `SELECT * FROM appointments WHERE doctorId = ? ORDER BY date DESC`,
        [req.params.doctorId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch appointments' });
            }
            res.json(rows || []);
        }
    );
});

// Get All Appointments
app.get('/api/appointments', (req, res) => {
    db.all(
        `SELECT * FROM appointments ORDER BY date DESC`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch appointments' });
            }
            res.json(rows || []);
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ MediCare Backend Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: ./medicare.db`);
    console.log(`🔌 CORS enabled for frontend`);
});

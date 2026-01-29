// Backend API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Data Storage (for compatibility, but will use backend)
let users = {
    patients: [],
    doctors: []
};

let appointments = [];
let medicines = [];

let currentUser = null;
let currentUserType = null;

// ==========================================
// LocalStorage Session Management
// ==========================================

function saveUserSession(user, userType) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('currentUserType', userType);
    console.log('✅ User session saved to localStorage');
}

function loadUserSession() {
    try {
        const savedUser = localStorage.getItem('currentUser');
        const savedUserType = localStorage.getItem('currentUserType');
        
        if (savedUser && savedUserType) {
            currentUser = JSON.parse(savedUser);
            currentUserType = savedUserType;
            console.log('✅ User session restored from localStorage');
            console.log('Welcome back, ' + currentUser.name);
            return true;
        }
    } catch (err) {
        console.error('Error loading user session:', err);
        clearUserSession();
    }
    return false;
}

function clearUserSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    currentUser = null;
    currentUserType = null;
    console.log('✅ User session cleared');
}

// Modal Functions
function showLoginModal(e) {
    if (e) e.preventDefault();
    // Show full-screen login page instead of modal
    document.getElementById('fullScreenLoginPage').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function closeFullScreenLogin() {
    document.getElementById('fullScreenLoginPage').classList.remove('show');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
}

// Tab Switching
function switchTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('.login-container .tab-content');
    const tabBtns = document.querySelectorAll('.login-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
}

function switchLoginTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('.login-page-content .tab-content');
    const tabBtns = document.querySelectorAll('.login-page-content .login-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
}

function switchRegTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('.register-container .tab-content');
    const tabBtns = document.querySelectorAll('.register-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
}

function switchToRegister(e) {
    e.preventDefault();
    closeFullScreenLogin();
    document.getElementById('registerModal').classList.add('show');
}

function switchToLogin(e) {
    e.preventDefault();
    document.getElementById('registerModal').classList.remove('show');
    document.getElementById('fullScreenLoginPage').classList.add('show');
}

function switchRegTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('#registerModal .tab-content');
    const tabBtns = document.querySelectorAll('#registerModal .login-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
}

// Login Functions
function handlePatientLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    // Login via API
    fetch(`${API_BASE_URL}/patients/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
            return;
        }
        currentUser = data.user;
        currentUserType = data.userType;
        // Save to localStorage so user doesn't need to login again
        saveUserSession(currentUser, currentUserType);
        closeFullScreenLogin();
        updateNavBar();
        showHome();
        alert('✅ Welcome, ' + data.user.name);
        e.target.reset();
    })
    .catch(err => {
        const errorMsg = err.error || err.message || 'Login failed';
        console.error('Login error:', err);
        alert('❌ ' + errorMsg + '\n\nMake sure:\n1. Backend server is running (npm start)\n2. User account exists\n3. Email and password are correct');
    });
}

function handleDoctorLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    // Login via API
    fetch(`${API_BASE_URL}/doctors/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
            return;
        }
        currentUser = data.user;
        currentUserType = data.userType;
        // Save to localStorage so user doesn't need to login again
        saveUserSession(currentUser, currentUserType);
        closeFullScreenLogin();
        updateNavBar();
        showHome();
        alert('✅ Welcome, ' + data.user.name);
        e.target.reset();
    })
    .catch(err => {
        const errorMsg = err.error || err.message || 'Login failed';
        console.error('Login error:', err);
        alert('❌ ' + errorMsg + '\n\nMake sure:\n1. Backend server is running (npm start)\n2. User account exists\n3. Email and password are correct');
    });
}

// Registration Functions
function handlePatientRegister(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (!name || !email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('❌ Passwords do not match');
        return;
    }

    // Register via API
    fetch(`${API_BASE_URL}/patients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
            return;
        }
        alert('✅ Registration successful! Please login with your email and password.');
        document.getElementById('registerModal').classList.remove('show');
        document.getElementById('fullScreenLoginPage').classList.add('show');
        form.reset();
    })
    .catch(err => {
        const errorMsg = err.error || err.message || 'Registration failed';
        console.error('Registration error:', err);
        alert('❌ ' + errorMsg + '\n\nMake sure backend server is running (npm start)');
    });
}

function handleDoctorRegister(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (!name || !email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('❌ Passwords do not match');
        return;
    }

    // Register via API
    fetch(`${API_BASE_URL}/doctors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
            return;
        }
        alert('✅ Registration successful! Please login with your email and password.');
        document.getElementById('registerModal').classList.remove('show');
        document.getElementById('fullScreenLoginPage').classList.add('show');
        form.reset();
    })
    .catch(err => {
        const errorMsg = err.error || err.message || 'Registration failed';
        console.error('Registration error:', err);
        alert('❌ ' + errorMsg + '\n\nMake sure backend server is running (npm start)');
    });
}

// Dashboard Functions
function showPatientDashboard() {
    document.getElementById('patientDashboard').classList.remove('hidden');
    document.getElementById('doctorDashboard').classList.add('hidden');
    loadPatientDashboard();
}

function showDoctorDashboard() {
    document.getElementById('doctorDashboard').classList.remove('hidden');
    document.getElementById('patientDashboard').classList.add('hidden');
    loadDoctorDashboard();
}

function showPatientSection(e, section) {
    e.preventDefault();
    const sections = document.querySelectorAll('#patientDashboard .dashboard-section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    // Load section-specific data
    if (section === 'doctors') {
        loadDoctorsList();
    } else if (section === 'records') {
        loadMedicalRecords();
    }
}

function showDoctorSection(e, section) {
    e.preventDefault();
    const sections = document.querySelectorAll('#doctorDashboard .dashboard-section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    // Load section-specific data
    if (section === 'patients') {
        loadPatientsList();
    } else if (section === 'schedule') {
        loadSchedule();
    }
}

// Patient Dashboard Loading
function loadPatientDashboard() {
    const upcomingAppointments = appointments.filter(a => a.patientId === currentUser.id);
    document.getElementById('appointmentCount').textContent = upcomingAppointments.length;
    loadAppointments();
    displayPatientProfile();
}

function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    const userAppointments = appointments.filter(a => a.patientId === currentUser.id);

    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = '<p>No appointments scheduled</p>';
        return;
    }

    appointmentsList.innerHTML = userAppointments.map(apt => {
        const appointmentMedicines = medicines.filter(m => m.appointmentId === apt.id);
        const medicineInfo = appointmentMedicines.length > 0 
            ? appointmentMedicines.map(m => `${m.name} (${m.dosage})`).join(', ')
            : 'No medicines';
        
        return `
            <div class="appointment-item">
                <div>
                    <h4>${apt.doctorName}</h4>
                    <p><strong>Date & Time:</strong> ${apt.date} at ${apt.time}</p>
                    <p><strong>Specialization:</strong> ${apt.specialization}</p>
                    <p><strong>Status:</strong> ${apt.status}</p>
                    <p><strong>Medicines:</strong> ${medicineInfo}</p>
                    <p><strong>Notes:</strong> ${apt.notes || 'No additional notes'}</p>
                </div>
                <button class="btn btn-secondary" onclick="cancelAppointment(${apt.id})">Cancel</button>
            </div>
        `;
    }).join('');
}

function loadDoctorsList() {
    const doctorsList = document.getElementById('doctorsList');
    doctorsList.innerHTML = users.doctors.map(doctor => `
        <div class="doctor-item">
            <div>
                <h4>${doctor.name}</h4>
                <p>Specialization: ${doctor.specialization}</p>
                <p>📞 ${doctor.phone || 'N/A'}</p>
            </div>
            <button class="btn btn-primary" onclick="bookAppointment(${doctor.id}, '${doctor.name}', '${doctor.specialization}')">Book</button>
        </div>
    `).join('');
}

function loadMedicalRecords() {
    loadMedicinesList();
    loadPrescriptionsList();
}

function switchMedicalTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('#records .tab-content');
    const tabBtns = document.querySelectorAll('.medical-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
}

function loadMedicinesList() {
    const medicinesList = document.getElementById('medicinesList');
    const patientMedicines = medicines.filter(m => m.prescribedTo === currentUser.id);

    if (patientMedicines.length === 0) {
        medicinesList.innerHTML = '<p>No active medicines</p>';
        return;
    }

    medicinesList.innerHTML = patientMedicines.map(med => `
        <div class="medicine-card">
            <div class="medicine-header">
                <h4>${med.name}</h4>
                <span class="medicine-dosage">${med.dosage}</span>
            </div>
            <div class="medicine-details">
                <p><strong>Frequency:</strong> ${med.frequency}</p>
                <p><strong>Duration:</strong> ${med.duration}</p>
                <p><strong>Instructions:</strong> ${med.instructions}</p>
                <p><strong>Prescribed By:</strong> ${users.doctors.find(d => d.id === med.prescribedBy)?.name || 'Dr. Unknown'}</p>
                <p><strong>Prescription Date:</strong> ${med.prescriptionDate}</p>
            </div>
        </div>
    `).join('');
}

function loadPrescriptionsList() {
    const prescriptionsList = document.getElementById('prescriptionsList');
    const patientPrescriptions = appointments.filter(a => a.patientId === currentUser.id);

    if (patientPrescriptions.length === 0) {
        prescriptionsList.innerHTML = '<p>No prescriptions</p>';
        return;
    }

    prescriptionsList.innerHTML = patientPrescriptions.map(apt => `
        <div class="prescription-item">
            <div>
                <h4>Consultation with ${apt.doctorName}</h4>
                <p><strong>Date:</strong> ${apt.date} at ${apt.time}</p>
                <p><strong>Specialization:</strong> ${apt.specialization}</p>
                <p><strong>Notes:</strong> ${apt.notes || 'No additional notes'}</p>
                <p><strong>Status:</strong> ${apt.status}</p>
            </div>
            <button class="btn btn-primary" onclick="viewPrescriptionDetails(${apt.id})">View Details</button>
        </div>
    `).join('');
}

function viewPrescriptionDetails(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    const appointmentMedicines = medicines.filter(m => m.appointmentId === appointmentId);
    
    let details = `Appointment Details:\n${appointment.doctorName}\nDate: ${appointment.date} at ${appointment.time}\n\nMedicines:\n`;
    appointmentMedicines.forEach(med => {
        details += `${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}\n`;
    });
    
    alert(details);
}

function displayPatientProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    document.getElementById('profileAge').textContent = currentUser.age;
    document.getElementById('profileGender').textContent = currentUser.gender;
    document.getElementById('profileBloodType').textContent = currentUser.bloodType;
    document.getElementById('profileHeight').textContent = currentUser.height;
    document.getElementById('profileWeight').textContent = currentUser.weight;
    document.getElementById('profileAddress').textContent = currentUser.address;
    document.getElementById('profileEmergency').textContent = currentUser.emergencyContact;
    document.getElementById('profileMedicalHistory').textContent = currentUser.medicalHistory;
    document.getElementById('profileAllergies').textContent = currentUser.allergies || 'None';
    
    if (currentUser.assignedDoctorId) {
        const assignedDoctor = users.doctors.find(d => d.id === currentUser.assignedDoctorId);
        document.getElementById('profileAssignedDoctor').textContent = assignedDoctor ? assignedDoctor.name : 'Not assigned';
    } else {
        document.getElementById('profileAssignedDoctor').textContent = 'Not assigned';
    }
}

function editPatientProfile() {
    alert('Profile edit feature - coming soon');
}


function bookAppointment(doctorId, doctorName, specialization) {
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    const time = prompt('Enter appointment time (HH:MM):');

    if (date && time) {
        const appointment = {
            id: appointments.length + 1,
            patientId: currentUser.id,
            patientName: currentUser.name,
            doctorId: doctorId,
            doctorName: doctorName,
            specialization: specialization,
            date: date,
            time: time,
            status: 'Scheduled'
        };

        appointments.push(appointment);
        alert('Appointment booked successfully!');
        loadAppointments();
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        appointments = appointments.filter(a => a.id !== appointmentId);
        alert('Appointment cancelled');
        loadAppointments();
    }
}

function downloadRecord(recordId) {
    alert('Record downloaded (simulated)');
}

function showBookAppointmentForm() {
    showPatientSection({ preventDefault: () => {} }, 'doctors');
}

function updateProfile() {
    alert('Profile updated successfully!');
}

function searchDoctors() {
    const searchTerm = document.getElementById('doctorSearch').value.toLowerCase();
    const doctorsList = document.getElementById('doctorsList');

    const filteredDoctors = users.doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialization.toLowerCase().includes(searchTerm)
    );

    if (filteredDoctors.length === 0) {
        doctorsList.innerHTML = '<p>No doctors found</p>';
        return;
    }

    doctorsList.innerHTML = filteredDoctors.map(doctor => `
        <div class="doctor-item">
            <div>
                <h4>${doctor.name}</h4>
                <p>Specialization: ${doctor.specialization}</p>
                <p>📞 ${doctor.phone || 'N/A'}</p>
            </div>
            <button class="btn btn-primary" onclick="bookAppointment(${doctor.id}, '${doctor.name}', '${doctor.specialization}')">Book</button>
        </div>
    `).join('');
}

// Doctor Dashboard Loading
function loadDoctorDashboard() {
    const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);
    document.getElementById('patientCount').textContent = new Set(doctorAppointments.map(a => a.patientId)).size;
    document.getElementById('todayAppointments').textContent = doctorAppointments.length;
    populatePrescriptionPatientSelect();
}

function populatePrescriptionPatientSelect() {
    const selectElement = document.getElementById('prescriptionPatient');
    const doctorPatients = appointments
        .filter(a => a.doctorId === currentUser.id)
        .map(a => ({ id: a.patientId, name: a.patientName }));
    
    const uniquePatients = [...new Map(doctorPatients.map(p => [p.id, p])).values()];
    
    selectElement.innerHTML = '<option value="">Choose a patient</option>';
    uniquePatients.forEach(patient => {
        selectElement.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
    });
}

function switchDoctorTab(e, tab) {
    e.preventDefault();
    const tabContents = document.querySelectorAll('#consultations .tab-content');
    const tabBtns = document.querySelectorAll('.doctor-tabs .tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    e.target.classList.add('active');
    
    // Load consultations when switching to that tab
    if (tab === 'consultations-list') {
        loadDoctorConsultations();
    }
}

function loadDoctorConsultations() {
    const consultationsList = document.getElementById('consultationsList');
    const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);
    
    if (doctorAppointments.length === 0) {
        consultationsList.innerHTML = '<p>No consultations scheduled</p>';
        return;
    }
    
    consultationsList.innerHTML = doctorAppointments.map(apt => {
        const appointmentMedicines = medicines.filter(m => m.appointmentId === apt.id);
        const medicineInfo = appointmentMedicines.length > 0 
            ? appointmentMedicines.map(m => `${m.name} (${m.dosage})`).join(', ')
            : 'No medicines prescribed';
        
        return `
            <div class="consultation-item">
                <div>
                    <h4>Patient: ${apt.patientName}</h4>
                    <p><strong>Date & Time:</strong> ${apt.date} at ${apt.time}</p>
                    <p><strong>Status:</strong> ${apt.status}</p>
                    <p><strong>Notes:</strong> ${apt.notes || 'No notes'}</p>
                    <p><strong>Prescribed Medicines:</strong> ${medicineInfo}</p>
                </div>
                <button class="btn btn-primary" onclick="editConsultation(${apt.id})">Edit</button>
            </div>
        `;
    }).join('');
}

function editConsultation(appointmentId) {
    alert('Edit consultation feature - coming soon');
}

function handleAddPrescription(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    const patientId = parseInt(inputs[0].value);
    const medicineName = inputs[1].value;
    const dosage = inputs[2].value;
    const frequency = inputs[3].value;
    const duration = inputs[4].value;
    const instructions = form.querySelector('textarea').value;
    
    if (!patientId) {
        alert('Please select a patient');
        return;
    }
    
    // Find the latest appointment for this patient with this doctor
    const latestAppointment = appointments
        .filter(a => a.patientId === patientId && a.doctorId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (!latestAppointment) {
        alert('No appointment found for this patient');
        return;
    }
    
    const newMedicine = {
        id: medicines.length + 1,
        name: medicineName,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        prescribedBy: currentUser.id,
        prescribedTo: patientId,
        appointmentId: latestAppointment.id,
        prescriptionDate: new Date().toISOString().split('T')[0],
        instructions: instructions
    };
    
    medicines.push(newMedicine);
    
    // Add medicine ID to appointment if not already there
    if (!latestAppointment.medicineIds) {
        latestAppointment.medicineIds = [];
    }
    latestAppointment.medicineIds.push(newMedicine.id);
    
    alert('Prescription added successfully!');
    form.reset();
}

function loadPatientsList() {
    const patientsList = document.getElementById('patientsList');
    const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.id);
    const uniquePatientIds = [...new Set(doctorAppointments.map(a => a.patientId))];
    
    if (uniquePatientIds.length === 0) {
        patientsList.innerHTML = '<p>No patients yet</p>';
        return;
    }
    
    patientsList.innerHTML = uniquePatientIds.map(patientId => {
        const patient = users.patients.find(p => p.id === patientId);
        const patientAppointments = doctorAppointments.filter(a => a.patientId === patientId);
        const lastAppointment = patientAppointments[patientAppointments.length - 1];
        
        return `
            <div class="patient-item">
                <div>
                    <h4>${patient.name}</h4>
                    <p><strong>Age:</strong> ${patient.age} | <strong>Blood Type:</strong> ${patient.bloodType}</p>
                    <p><strong>Phone:</strong> ${patient.phone}</p>
                    <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
                    <p><strong>Allergies:</strong> ${patient.allergies || 'None'}</p>
                    <p><strong>Last Appointment:</strong> ${lastAppointment.date} at ${lastAppointment.time}</p>
                </div>
                <button class="btn btn-primary" onclick="viewPatientDetails(${patient.id}, '${patient.name}')">View Full Details</button>
            </div>
        `;
    }).join('');
}

function loadSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    const mockSchedule = [
        { id: 1, day: 'Monday-Friday', time: '09:00 AM - 12:00 PM', available: true },
        { id: 2, day: 'Monday-Friday', time: '02:00 PM - 05:00 PM', available: true },
        { id: 3, day: 'Saturday', time: '10:00 AM - 02:00 PM', available: true }
    ];

    scheduleList.innerHTML = mockSchedule.map(schedule => `
        <div class="schedule-item">
            <div>
                <h4>${schedule.day}</h4>
                <p>Time: ${schedule.time}</p>
                <p>Status: ${schedule.available ? 'Available' : 'Not Available'}</p>
            </div>
            <button class="btn btn-secondary" onclick="deleteSchedule(${schedule.id})">Delete</button>
        </div>
    `).join('');
}

function addScheduleSlot() {
    const day = prompt('Enter day (e.g., Monday, Tuesday):');
    const time = prompt('Enter time (e.g., 09:00 AM - 12:00 PM):');

    if (day && time) {
        alert('Schedule slot added successfully!');
        loadSchedule();
    }
}

function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        alert('Schedule deleted');
        loadSchedule();
    }
}

function viewPatientDetails(patientId, patientName) {
    const patient = users.patients.find(p => p.id === patientId);
    const patientMedicines = medicines.filter(m => m.prescribedTo === patientId && m.prescribedBy === currentUser.id);
    
    let details = `Patient: ${patient.name}\n\n`;
    details += `Age: ${patient.age}\nGender: ${patient.gender}\nBlood Type: ${patient.bloodType}\n`;
    details += `Height: ${patient.height}\nWeight: ${patient.weight}\n`;
    details += `Phone: ${patient.phone}\nAddress: ${patient.address}\n`;
    details += `Emergency Contact: ${patient.emergencyContact}\n`;
    details += `Medical History: ${patient.medicalHistory}\n`;
    details += `Allergies: ${patient.allergies || 'None'}\n\n`;
    
    details += `Current Medicines:\n`;
    if (patientMedicines.length === 0) {
        details += 'No medicines prescribed\n';
    } else {
        patientMedicines.forEach(med => {
            details += `- ${med.name} (${med.dosage}), ${med.frequency}, ${med.duration}\n`;
        });
    }
    
    alert(details);
}

function updateDoctorProfile() {
    alert('Profile updated successfully!');
}

// Contact Form
function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        currentUserType = null;
        document.getElementById('patientDashboard').classList.add('hidden');
        document.getElementById('doctorDashboard').classList.add('hidden');
        alert('You have been logged out');
    }
}

// Close modals when clicking outside
window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !href.includes('loginModal') && !href.includes('registerModal')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navigation Bar Update
function updateNavBar() {
    const loginItem = document.getElementById('loginNavItem');
    const userItem = document.getElementById('userNavItem');
    const guestButtons = document.getElementById('guestButtons');
    const patientButtons = document.getElementById('patientButtons');
    const doctorButtons = document.getElementById('doctorButtons');
    
    // Check if elements exist before using them
    if (!loginItem || !userItem || !guestButtons || !patientButtons || !doctorButtons) {
        console.warn('⚠️ Navigation elements not found in DOM');
        return;
    }
    
    if (currentUser) {
        loginItem.style.display = 'none';
        userItem.style.display = 'block';
        
        // Update hero buttons based on user type
        if (currentUserType === 'patient') {
            guestButtons.style.display = 'none';
            patientButtons.style.display = 'flex';
            doctorButtons.style.display = 'none';
        } else if (currentUserType === 'doctor') {
            guestButtons.style.display = 'none';
            patientButtons.style.display = 'none';
            doctorButtons.style.display = 'flex';
        }
    } else {
        loginItem.style.display = 'block';
        userItem.style.display = 'none';
        guestButtons.style.display = 'flex';
        patientButtons.style.display = 'none';
        doctorButtons.style.display = 'none';
    }
}

// Toggle User Dropdown Menu
function toggleUserMenu(e) {
    e.preventDefault();
    const menu = document.getElementById('userDropdownMenu');
    menu.classList.toggle('show');
}

// View User Profile
function viewUserProfile(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    // Hide main sections - check if elements exist first
    const homeEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const contactEl = document.getElementById('contact');
    
    if (homeEl) homeEl.style.display = 'none';
    if (aboutEl) aboutEl.style.display = 'none';
    if (servicesEl) servicesEl.style.display = 'none';
    if (contactEl) contactEl.style.display = 'none';
    
    // Show profile page
    const profilePage = document.getElementById('userProfilePage');
    if (!profilePage) {
        console.error('❌ Profile page element not found');
        return;
    }
    profilePage.style.display = 'block';
    
    // Populate profile data - use textContent to set values
    setTimeout(function() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileType = document.getElementById('profileType');
        
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;
        if (profileType) profileType.textContent = currentUserType === 'patient' ? 'Patient' : 'Doctor';
        
        if (currentUserType === 'patient') {
            const patientDet = document.getElementById('patientDetails');
            const doctorDet = document.getElementById('doctorDetails');
            
            if (patientDet) patientDet.style.display = 'block';
            if (doctorDet) doctorDet.style.display = 'none';
            
            const profileAge = document.getElementById('profileAge');
            const profileGender = document.getElementById('profileGender');
            const profileBloodType = document.getElementById('profileBloodType');
            const profilePhone = document.getElementById('profilePhone');
            
            if (profileAge) profileAge.textContent = currentUser.age || 'Not Provided';
            if (profileGender) profileGender.textContent = currentUser.gender || 'Not Provided';
            if (profileBloodType) profileBloodType.textContent = currentUser.bloodType || 'Not Provided';
            if (profilePhone) profilePhone.textContent = currentUser.phone || 'Not Provided';
        } else {
            const patientDet = document.getElementById('patientDetails');
            const doctorDet = document.getElementById('doctorDetails');
            
            if (patientDet) patientDet.style.display = 'none';
            if (doctorDet) doctorDet.style.display = 'block';
            
            const profileSpecialization = document.getElementById('profileSpecialization');
            const profileLicense = document.getElementById('profileLicense');
            const profileDoctorPhone = document.getElementById('profileDoctorPhone');
            
            if (profileSpecialization) profileSpecialization.textContent = currentUser.specialization || 'Not Provided';
            if (profileLicense) profileLicense.textContent = currentUser.license || 'Not Provided';
            if (profileDoctorPhone) profileDoctorPhone.textContent = currentUser.phone || 'Not Provided';
        }
    }, 100);
    
    // Close dropdown menu
    const dropdownMenu = document.getElementById('userDropdownMenu');
    if (dropdownMenu) dropdownMenu.classList.remove('show');

}

// Back to Home
function backToHome() {
    // Show main sections - check if elements exist
    const homeEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const contactEl = document.getElementById('contact');
    const profilePageEl = document.getElementById('userProfilePage');
    
    if (homeEl) homeEl.style.display = 'block';
    if (aboutEl) aboutEl.style.display = 'block';
    if (servicesEl) servicesEl.style.display = 'block';
    if (contactEl) contactEl.style.display = 'block';
    
    // Hide profile page
    if (profilePageEl) profilePageEl.style.display = 'none';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Show Home
function showHome() {
    const homeEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const contactEl = document.getElementById('contact');
    const profilePageEl = document.getElementById('userProfilePage');
    
    if (homeEl) homeEl.style.display = 'block';
    if (aboutEl) aboutEl.style.display = 'block';
    if (servicesEl) servicesEl.style.display = 'block';
    if (contactEl) contactEl.style.display = 'block';
    if (profilePageEl) profilePageEl.style.display = 'none';
    window.scrollTo(0, 0);
}

// Book Appointment - Patient Feature
function showBookAppointment(e) {
    if (e) e.preventDefault();
    
    if (!currentUser || currentUserType !== 'patient') {
        alert('Please login as a patient to book an appointment');
        return;
    }
    
    // Hide home sections
    const homeEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const contactEl = document.getElementById('contact');
    
    if (homeEl) homeEl.style.display = 'none';
    if (aboutEl) aboutEl.style.display = 'none';
    if (servicesEl) servicesEl.style.display = 'none';
    if (contactEl) contactEl.style.display = 'none';
    
    // Show appointment booking page
    const bookingPage = document.getElementById('appointmentBookingPage');
    if (bookingPage) {
        bookingPage.style.display = 'block';
    }
    
    // Fill user info
    const appointmentName = document.getElementById('appointmentName');
    const appointmentEmail = document.getElementById('appointmentEmail');
    const appointmentAge = document.getElementById('appointmentAge');
    const appointmentPhone = document.getElementById('appointmentPhone');
    
    if (appointmentName) appointmentName.value = currentUser.name || '';
    if (appointmentEmail) appointmentEmail.value = currentUser.email || '';
    if (appointmentAge) appointmentAge.value = currentUser.age || '';
    if (appointmentPhone) appointmentPhone.value = currentUser.phone || '';
    
    // Load doctors into dropdown
    fetch(`${API_BASE_URL}/doctors`)
        .then(res => res.json())
        .then(doctors => {
            const doctorSelect = document.getElementById('appointmentDoctor');
            if (!doctorSelect) return;
            
            doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = 'Dr. ' + doctor.name + ' (' + doctor.specialization + ')';
                doctorSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Failed to load doctors:', err);
            const doctorSelect = document.getElementById('appointmentDoctor');
            if (doctorSelect) {
                doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
            }
        });
}

// View Patients List - Doctor Feature
function showPatientsList(e) {
    if (e) e.preventDefault();
    
    if (!currentUser || currentUserType !== 'doctor') {
        alert('Please login as a doctor to view patients');
        return;
    }
    
    // Fetch patients from API
    fetch(`${API_BASE_URL}/patients`)
        .then(res => res.json())
        .then(patients => {
            if (patients.length === 0) {
                alert('No patients in the system');
                return;
            }
            
            const patientList = patients.map((p, index) => {
                return (index + 1) + '. ' + p.name + ' (Email: ' + p.email + ', Age: ' + p.age + ', Gender: ' + p.gender + ')';
            }).join('\n');
            
            alert('👥 PATIENTS LIST:\n\n' + patientList);
        })
        .catch(err => {
            alert('❌ Failed to load patients. Make sure backend is running.');
            console.error(err);
        });
}

// Logout
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear from localStorage
        clearUserSession();
        updateNavBar();
        showHome();
        alert('You have been logged out successfully');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userNav = document.querySelector('.user-nav-item');
    if (userNav && !userNav.contains(event.target)) {
        document.getElementById('userDropdownMenu').classList.remove('show');
    }
});

// Initialize
console.log('MediCare Website Loaded');

// Try to restore user session from localStorage on page load
if (loadUserSession()) {
    updateNavBar();
    showHome();
} else {
    updateNavBar();
}

// Submit appointment booking
function submitAppointmentBooking(e) {
    e.preventDefault();
    
    if (!currentUser || currentUserType !== 'patient') {
        alert('Please login as a patient');
        return;
    }
    
    // Get form values
    const doctorId = document.getElementById('appointmentDoctor').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const appointmentReason = document.getElementById('appointmentReason').value;
    const appointmentAge = document.getElementById('appointmentAge').value;
    const appointmentGender = document.getElementById('appointmentGender').value;
    const appointmentPhone = document.getElementById('appointmentPhone').value;
    
    if (!doctorId || !appointmentDate || !appointmentTime || !appointmentReason) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    // Find selected doctor name
    const doctorSelect = document.getElementById('appointmentDoctor');
    const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
    const doctorName = selectedOption.text.split('(')[0].replace('Dr. ', '').trim();
    
    // Book appointment via API
    fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            patientId: currentUser.id,
            patientName: currentUser.name,
            doctorId: parseInt(doctorId),
            doctorName: doctorName,
            date: appointmentDate,
            time: appointmentTime,
            reason: appointmentReason,
            age: appointmentAge,
            gender: appointmentGender,
            phone: appointmentPhone
        })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
        }
        return res.json();
    })
    .then(data => {
        if (data.error) {
            alert('❌ ' + data.error);
            return;
        }
        alert('✅ Appointment booked successfully!\n\nDoctor: ' + doctorName + 
              '\nDate: ' + appointmentDate + '\nTime: ' + appointmentTime);
        
        // Reset form
        document.querySelector('.appointment-form').reset();
        
        // Show the new appointment in the list
        setTimeout(() => {
            showMyAppointments();
        }, 500);
    })
    .catch(err => {
        const errorMsg = err.error || err.message || 'Failed to book appointment';
        alert('❌ ' + errorMsg);
        console.error('Booking error:', err);
    });
}

// View My Appointments
function showMyAppointments() {
    if (!currentUser || currentUserType !== 'patient') {
        alert('Please login as a patient to view appointments');
        return;
    }
    
    // Hide home sections
    const homeEl = document.getElementById('home');
    const aboutEl = document.getElementById('about');
    const servicesEl = document.getElementById('services');
    const contactEl = document.getElementById('contact');
    
    if (homeEl) homeEl.style.display = 'none';
    if (aboutEl) aboutEl.style.display = 'none';
    if (servicesEl) servicesEl.style.display = 'none';
    if (contactEl) contactEl.style.display = 'none';
    
    // Show appointments page
    const appointmentView = document.getElementById('appointmentViewPage');
    if (appointmentView) {
        appointmentView.style.display = 'block';
    }
    
    // Fetch appointments from API
    fetch(`${API_BASE_URL}/appointments?patientId=${currentUser.id}`)
        .then(res => res.json())
        .then(appointments => {
            const appointmentsList = document.getElementById('appointmentsList');
            
            if (!appointments || appointments.length === 0) {
                appointmentsList.innerHTML = '<p class="no-appointments">No appointments scheduled yet.</p>';
                return;
            }
            
            // Group appointments by status
            const upcoming = appointments.filter(apt => new Date(apt.date) >= new Date());
            const past = appointments.filter(apt => new Date(apt.date) < new Date());
            
            let html = '';
            
            if (upcoming.length > 0) {
                html += '<h3 class="appointments-section-title">📅 Upcoming Appointments</h3>';
                html += '<div class="appointments-grid">';
                upcoming.forEach(apt => {
                    html += `
                        <div class="appointment-card">
                            <div class="appointment-status">Scheduled</div>
                            <div class="appointment-content">
                                <h4>Dr. ${apt.doctorName}</h4>
                                <p class="appointment-detail"><strong>Date:</strong> ${apt.date}</p>
                                <p class="appointment-detail"><strong>Time:</strong> ${apt.time}</p>
                                <p class="appointment-detail"><strong>Reason:</strong> ${apt.reason || 'Not specified'}</p>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            if (past.length > 0) {
                html += '<h3 class="appointments-section-title" style="margin-top: 2rem;">✅ Past Appointments</h3>';
                html += '<div class="appointments-grid">';
                past.forEach(apt => {
                    html += `
                        <div class="appointment-card completed">
                            <div class="appointment-status">Completed</div>
                            <div class="appointment-content">
                                <h4>Dr. ${apt.doctorName}</h4>
                                <p class="appointment-detail"><strong>Date:</strong> ${apt.date}</p>
                                <p class="appointment-detail"><strong>Time:</strong> ${apt.time}</p>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            appointmentsList.innerHTML = html;
        })
        .catch(err => {
            console.error('Error fetching appointments:', err);
            const appointmentsList = document.getElementById('appointmentsList');
            appointmentsList.innerHTML = '<p class="error">Failed to load appointments. Please try again.</p>';
        });
}

updateNavBar();

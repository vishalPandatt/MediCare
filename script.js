// Data Storage (simulated database)
let users = {
    patients: [
        {
            id: 1,
            email: 'patient1@example.com',
            password: 'pass123',
            name: 'John Doe',
            phone: '555-0001',
            age: 35,
            gender: 'Male',
            bloodType: 'O+',
            address: '123 Main Street, City',
            emergencyContact: 'Jane Doe (555-0002)',
            medicalHistory: 'Diabetes, Hypertension',
            allergies: 'Penicillin',
            assignedDoctorId: 1,
            height: '180 cm',
            weight: '75 kg'
        }
    ],
    doctors: [
        { id: 1, email: 'doctor1@example.com', password: 'pass123', name: 'Dr. Smith', specialization: 'Cardiologist', license: 'LIC001', phone: '555-1001', bio: 'Expert in cardiac care' },
        { id: 2, email: 'doctor2@example.com', password: 'pass123', name: 'Dr. Johnson', specialization: 'Dermatologist', license: 'LIC002', phone: '555-1002', bio: 'Specialized in skin diseases' },
        { id: 3, email: 'doctor3@example.com', password: 'pass123', name: 'Dr. Williams', specialization: 'Neurologist', license: 'LIC003', phone: '555-1003', bio: 'Brain and nervous system specialist' },
    ]
};

let appointments = [
    {
        id: 1,
        patientId: 1,
        patientName: 'John Doe',
        doctorId: 1,
        doctorName: 'Dr. Smith',
        specialization: 'Cardiologist',
        date: '2025-02-15',
        time: '10:00 AM',
        status: 'Scheduled',
        notes: 'Regular checkup',
        medicineIds: [1]
    }
];

let medicines = [
    {
        id: 1,
        name: 'Aspirin',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '30 days',
        prescribedBy: 1,
        prescribedTo: 1,
        appointmentId: 1,
        prescriptionDate: '2025-02-15',
        instructions: 'Take with food'
    }
];

let currentUser = null;
let currentUserType = null;

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

    const user = users.patients.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        currentUserType = 'patient';
        closeLoginModal();
        showPatientDashboard();
        alert('Welcome, ' + user.name);
    } else {
        alert('Invalid credentials');
    }
}

function handleDoctorLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const user = users.doctors.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        currentUserType = 'doctor';
        closeLoginModal();
        showDoctorDashboard();
        alert('Welcome, ' + user.name);
    } else {
        alert('Invalid credentials');
    }
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

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (users.patients.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newPatient = {
        id: users.patients.length + 1,
        email: email,
        password: password,
        name: name,
        phone: '555-' + Math.floor(Math.random() * 10000),
        age: 30,
        gender: 'Not Specified',
        bloodType: 'O+',
        address: 'Not Provided',
        emergencyContact: 'Not Provided',
        medicalHistory: 'None',
        allergies: 'None',
        assignedDoctorId: null,
        height: 'Not Provided',
        weight: 'Not Provided'
    };

    users.patients.push(newPatient);
    alert('Registration successful! Please login with your email and password.');
    document.getElementById('registerModal').classList.remove('show');
    document.getElementById('fullScreenLoginPage').classList.add('show');
}

function handleDoctorRegister(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (users.doctors.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newDoctor = {
        id: users.doctors.length + 1,
        email: email,
        password: password,
        name: name,
        phone: '555-' + Math.floor(Math.random() * 10000),
        license: 'LIC' + (users.doctors.length + 100),
        specialization: 'General Practitioner',
        bio: 'Professional healthcare provider'
    };

    users.doctors.push(newDoctor);
    alert('Registration successful! Please login with your email and password.');
    document.getElementById('registerModal').classList.remove('show');
    document.getElementById('fullScreenLoginPage').classList.add('show');
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

// Initialize
console.log('MediCare Website Loaded');

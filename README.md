# Clinic Front Desk - Automated Queue Management System

## Overview

This system provides an automated patient queue management solution for clinics, featuring real-time status updates and intelligent doctor-patient assignment.

## 🚀 Key Features

### Automated Status Management
- **Real-time Queue Updates**: Status changes automatically trigger queue updates
- **Smart Doctor Assignment**: Patients are automatically assigned to available doctors
- **Automatic Transitions**: When a patient is marked as "Completed", their doctor is automatically assigned to the next waiting patient

### Queue Status Types
1. **Waiting** ⏳ - Patient is in queue, waiting for doctor assignment
2. **With Doctor** 👨‍⚕️ - Patient is currently being treated
3. **Completed** ✅ - Patient treatment is finished

### Priority System
- **Normal Priority**: Standard queue processing
- **Urgent Priority**: Patients marked as urgent are prioritized in the queue

## 🔄 How It Works

### 1. Patient Addition
- When a patient is added to the queue, the system automatically:
  - Assigns them a queue number
  - Attempts to find an available doctor
  - Updates their status to "With Doctor" if a doctor is available

### 2. Status Transitions
- **Waiting → With Doctor**: Automatic when a doctor becomes available
- **With Doctor → Completed**: Manual update by staff
- **Completed**: Automatically frees up the doctor and assigns them to the next patient

### 3. Doctor Assignment Logic
- Available doctors are automatically assigned to waiting patients
- Priority is given to urgent patients
- First-come-first-served for patients with the same priority level

## 🛠️ Technical Implementation

### Backend Services
- **QueueService**: Manages queue operations and automatic assignments
- **AppointmentsService**: Integrates with queue system for appointment completion
- **Real-time Updates**: Automatic status propagation across the system

### Frontend Components
- **QueueStatusBar**: Real-time dashboard showing queue statistics
- **Enhanced Queue Display**: Visual indicators for each status type
- **Auto-refresh**: Updates every 10-30 seconds for real-time information

## 📊 Dashboard Features

### Queue Status Dashboard
- Real-time counts for each status type
- Efficiency score calculation
- Doctor workload monitoring
- Progress tracking

### Visual Indicators
- Color-coded status badges
- Priority indicators (🚨 for urgent patients)
- Doctor assignment status
- Border colors for quick status identification

## 🔧 API Endpoints

### Queue Management
- `GET /queue` - Get all queue entries
- `GET /queue/stats` - Get queue statistics
- `GET /queue/workload` - Get doctor workload information
- `POST /queue` - Add patient to queue
- `PATCH /queue/:id/status` - Update patient status
- `PATCH /queue/:id/prioritize` - Mark patient as urgent

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create new appointment
- `PATCH /appointments/:id` - Update appointment status

## 🚀 Getting Started

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database**: Ensure your database is running and migrations are applied

## 💡 Usage Examples

### Adding a Patient
1. Click "Add Patient" button
2. Enter patient name
3. Optionally assign a specific doctor
4. Mark as urgent if needed
5. System automatically assigns doctor if available

### Managing Patient Status
1. Use the status dropdown to change patient status
2. Marking as "Completed" automatically:
   - Frees up the doctor
   - Assigns doctor to next waiting patient
   - Updates queue display

### Monitoring Queue
- View real-time statistics in the status dashboard
- Monitor doctor workload
- Track efficiency metrics

## 🔒 Security Features
- Authentication required for all operations
- Role-based access control
- Secure API endpoints

## 📱 Responsive Design
- Mobile-friendly interface
- Real-time updates across all devices
- Intuitive user experience

## 🚨 Troubleshooting

### Common Issues
1. **Patient not assigned to doctor**: Check if doctors are available
2. **Status not updating**: Refresh the page or wait for auto-refresh
3. **Queue not showing**: Verify backend services are running

### Performance Tips
- Use the manual refresh button for immediate updates
- Monitor the efficiency score for system health
- Check doctor workload for bottlenecks

## 🔮 Future Enhancements
- Push notifications for status changes
- Advanced scheduling algorithms
- Integration with electronic health records
- Mobile app for doctors and staff
- Analytics and reporting dashboard

---

**Note**: This system is designed for real-time clinic operations. Ensure stable internet connectivity for optimal performance.


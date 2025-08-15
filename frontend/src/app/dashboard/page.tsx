'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import AddDoctorModal from '../../components/AddDoctorModal';
import EditDoctorModal from '../../components/EditDoctorModal';
import AddPatientModal from '../../components/AddPatientModal';
import BookAppointmentModal from '../../components/BookAppointmentModal';
import RescheduleModal from '../../components/RescheduleModal';

// --- Interfaces ---
interface Doctor { id: number; name: string; specialization: string; availability: string; gender: string; location: string; nextAvailableAt: string | null; }
interface QueueEntry { id: number; patientName: string; status: string; priority: string; doctor: Doctor | null; }
interface Appointment { id: number; patientName: string; appointmentTime: string; status: string; doctor: Doctor; }

export default function DashboardPage() {
    // --- State variables ---
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
    const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);
    const router = useRouter();

    // --- Data Fetching ---
    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors', { params: { search: doctorSearchTerm } });
            setDoctors(response.data);
        } catch (error) { console.error('Failed to fetch doctors:', error); }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await fetchDoctors();
            const [queueRes, appointmentsRes] = await Promise.all([
                api.get('/queue'),
                api.get('/appointments'),
            ]);
            setQueue(queueRes.data);
            setAppointments(appointmentsRes.data);
        } catch (error) { console.error('Failed to fetch data:', error); router.push('/'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => { if (!isLoading) { fetchDoctors(); } }, 500);
        return () => clearTimeout(timer);
    }, [doctorSearchTerm]);

    // --- Handler Functions ---
    const handleUpdateQueueStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/queue/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) { alert('Could not update status.'); }
    };
    const handlePrioritizePatient = async (id: number) => {
        try {
            await api.patch(`/queue/${id}/prioritize`);
            fetchData();
        } catch (error) { alert('Could not prioritize patient.'); }
    };
    const handleDeleteFromQueue = async (id: number) => {
        if (confirm('Are you sure you want to remove this patient from the queue?')) {
            try {
                await api.delete(`/queue/${id}`);
                fetchData();
            } catch (error) { alert('Could not remove patient from queue.'); }
        }
    };
    const handleDeleteAppointment = async (id: number) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            try {
                await api.delete(`/appointments/${id}`);
                fetchData();
            } catch (error) { alert('Could not delete appointment.'); }
        }
    };
    const handleChangeDoctor = async (patientId: number, newDoctorId: number | null) => {
        try {
            await api.patch(`/queue/${patientId}/doctor`, { doctorId: newDoctorId });
            fetchData();
        } catch (error) { alert('Could not change doctor assignment.'); }
    };
    const handleUpdateAppointmentStatus = async (id: number, status: string) => {
        if (status === 'Canceled' && !confirm('Are you sure you want to cancel?')) return;
        try {
            await api.patch(`/appointments/${id}`, { status });
            fetchData();
        } catch (error) { alert('Could not update appointment.'); }
    };
    const handleDeleteDoctor = async (id: number) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try {
                await api.delete(`/doctors/${id}`);
                fetchData();
            } catch (error) { alert('Error deleting doctor.'); }
        }
    };
    const openEditModal = (doctor: Doctor) => { setDoctorToEdit(doctor); setIsEditDoctorModalOpen(true); };
    const openRescheduleModal = (appointment: Appointment) => { setAppointmentToReschedule(appointment); setIsRescheduleModalOpen(true); };
    const handleLogout = () => { localStorage.removeItem('token'); router.push('/'); };

    if (isLoading) { return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">Loading...</div>; }

    return (
        <>
            {isDoctorModalOpen && <AddDoctorModal onClose={() => setIsDoctorModalOpen(false)} onSuccess={fetchData} />}
            {isEditDoctorModalOpen && doctorToEdit && <EditDoctorModal doctor={doctorToEdit} onClose={() => setIsEditDoctorModalOpen(false)} onSuccess={fetchData} />}
            {isPatientModalOpen && <AddPatientModal doctors={doctors} onClose={() => setIsPatientModalOpen(false)} onSuccess={fetchData} />}
            {isBookingModalOpen && <BookAppointmentModal doctors={doctors} onClose={() => setIsBookingModalOpen(false)} onSuccess={fetchData} />}
            {isRescheduleModalOpen && appointmentToReschedule && <RescheduleModal appointment={appointmentToReschedule} onClose={() => setIsRescheduleModalOpen(false)} onSuccess={fetchData} />}

            <main className="min-h-screen bg-gray-900 text-white p-8 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">Front Desk Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Log Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Patient Queue</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setIsPatientModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    + Add Patient
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {queue.map((entry, index) => (
                                <div key={entry.id} className={`bg-gray-700/50 p-4 rounded-lg flex justify-between items-center ${entry.status === 'Completed' ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        {entry.status === 'Completed' ? (
                                            <div className="bg-green-500 text-white text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full">✓</div>
                                        ) : (
                                            <span className={`bg-gray-800 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${entry.priority === 'Urgent' ? 'text-red-400' : 'text-gray-300'}`}>{index + 1}</span>
                                        )}
                                        <div>
                                            <p className="font-bold text-lg">{entry.patientName}</p>
                                            {entry.doctor && (
                                                <p className="text-xs text-cyan-400">
                                                    w/ Dr. {entry.doctor.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {entry.priority !== 'Urgent' && entry.status !== 'Completed' && (
                                            <button onClick={() => handlePrioritizePatient(entry.id)} className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                                                Treat Urgently
                                            </button>
                                        )}
                                        <select
                                            value={entry.status}
                                            onChange={(e) => handleUpdateQueueStatus(entry.id, e.target.value)}
                                            className="bg-gray-600 text-white text-sm rounded-lg p-2"
                                        >
                                            <option>Waiting</option>
                                            <option>With Doctor</option>
                                            <option>Completed</option>
                                        </select>
                                        <select
                                            value={entry.doctor?.id || ''}
                                            onChange={(e) => handleChangeDoctor(entry.id, e.target.value ? parseInt(e.target.value) : null)}
                                            className="bg-gray-600 text-white text-sm rounded-lg p-2"
                                        >
                                            <option value="">No Doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    Dr. {doctor.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => handleDeleteFromQueue(entry.id)} 
                                            className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {queue.length === 0 && <p className="text-gray-500 text-center py-4">The queue is empty.</p>}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Doctors</h2>
                                <button onClick={() => setIsDoctorModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">+ Add Doctor</button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                value={doctorSearchTerm}
                                onChange={(e) => setDoctorSearchTerm(e.target.value)}
                                className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
                            />
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <div key={doctor.id} className="bg-gray-700/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">{doctor.name}</p>
                                                <p className="text-sm text-gray-400">{doctor.specialization}</p>
                                                {doctor.availability !== 'Available' && doctor.nextAvailableAt && (
                                                    <p className="text-xs text-amber-400 pt-1">
                                                        Next available: {doctor.nextAvailableAt}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                doctor.availability === 'Available' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-800'
                                            }`}>
                                                {doctor.availability}
                                            </span>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-2 border-t border-gray-600 pt-2">
                                            <button onClick={() => openEditModal(doctor)} className="text-xs text-cyan-400 hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteDoctor(doctor.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                                        </div>

                                    </div>
                                ))}
                                {doctors.length === 0 && <p className="text-gray-500 text-center py-4">No doctors found.</p>}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Appointments</h2>
                                <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">+ Book</button>
                            </div>
                            <div className="space-y-4">
                                {appointments.map((appt) => (
                                    <div key={appt.id} className={`bg-gray-700/50 p-4 rounded-lg ${appt.status !== 'Booked' ? 'opacity-50' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">{appt.patientName}</p>
                                                <p className="text-sm text-gray-400">w/ Dr. {appt.doctor.name}</p>
                                                <p className="text-xs text-gray-500 pt-1">{new Date(appt.appointmentTime).toLocaleString()}</p>
                                            </div>
                                            <p className="font-semibold text-sm">{appt.status}</p>
                                        </div>
                                        <div className="flex gap-4 mt-2 border-t border-gray-600 pt-2 text-xs">
                                            {appt.status === 'Booked' && (
                                                <>
                                                    <button onClick={() => handleUpdateAppointmentStatus(appt.id, 'Completed')} className="text-green-400 hover:underline">Complete</button>
                                                    <button onClick={() => openRescheduleModal(appt)} className="text-cyan-400 hover:underline">Reschedule</button>
                                                    <button onClick={() => handleUpdateAppointmentStatus(appt.id, 'Canceled')} className="text-red-400 hover:underline">Cancel</button>
                                                </>
                                            )}
                                            <button onClick={() => handleDeleteAppointment(appt.id)} className="text-red-400 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {appointments.length === 0 && <p className="text-gray-500 text-center py-4">No appointments scheduled.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
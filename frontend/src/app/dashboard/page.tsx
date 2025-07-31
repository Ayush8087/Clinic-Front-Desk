'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import AddDoctorModal from '../../components/AddDoctorModal';
import AddPatientModal from '../../components/AddPatientModal';
import BookAppointmentModal from '../../components/BookAppointmentModal';

// Defines the "shape" of our data
interface Doctor {
    id: number;
    name: string;
    specialization: string;
    availability: string;
}

interface QueueEntry {
    id: number;
    patientName: string;
    status: string;
    priority: string;
    doctor: Doctor | null;
}

interface Appointment {
    id: number;
    patientName: string;
    appointmentTime: string;
    status: string;
    doctor: { name: string };
}

export default function DashboardPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const [doctorsRes, queueRes, appointmentsRes] = await Promise.all([
                api.get('/doctors'),
                api.get('/queue'),
                api.get('/appointments'),
            ]);
            setDoctors(doctorsRes.data);
            setQueue(queueRes.data);
            setAppointments(appointmentsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateQueueStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/queue/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            alert('Could not update status.');
        }
    };

    const handlePrioritizePatient = async (id: number) => {
        try {
            await api.patch(`/queue/${id}/prioritize`);
            fetchData();
        } catch (error) {
            alert('Could not prioritize patient.');
        }
    };

    const handleCancelAppointment = async (id: number) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.patch(`/appointments/${id}/cancel`);
                fetchData();
            } catch (error) {
                alert('Error cancelling appointment.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">Loading...</div>;
    }

    return (
        <>
            {isDoctorModalOpen && <AddDoctorModal onClose={() => setIsDoctorModalOpen(false)} onSuccess={() => { setIsDoctorModalOpen(false); fetchData(); }} />}
            {isPatientModalOpen && <AddPatientModal doctors={doctors} onClose={() => setIsPatientModalOpen(false)} onSuccess={() => { setIsPatientModalOpen(false); fetchData(); }} />}
            {isBookingModalOpen && <BookAppointmentModal doctors={doctors} onClose={() => setIsBookingModalOpen(false)} onSuccess={() => { setIsBookingModalOpen(false); fetchData(); }} />}

            <main className="min-h-screen bg-gray-900 text-white p-8 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">Front Desk Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        Log Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Patient Queue</h2>
                            <button onClick={() => setIsPatientModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                + Add Patient
                            </button>
                        </div>
                        <div className="space-y-4">
                            {queue.map((entry, index) => (
                                <div key={entry.id} className={`bg-gray-700/50 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-700 ${entry.status === 'Completed' ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        {entry.status === 'Completed' ? (
                                            <div className="bg-green-500 text-white text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full">✓</div>
                                        ) : (
                                            <span className={`bg-gray-800 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${entry.priority === 'Urgent' ? 'text-red-400' : 'text-gray-300'}`}>{index + 1}</span>
                                        )}
                                        <div>
                                            <p className="font-bold text-lg">{entry.patientName}</p>
                                            {entry.doctor && <p className="text-xs text-cyan-400">w/ Dr. {entry.doctor.name}</p>}
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
                                            className="bg-gray-600 text-white text-sm rounded-lg p-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Waiting">Waiting</option>
                                            <option value="With Doctor">With Doctor</option>
                                            <option value="Completed">Completed</option>
                                        </select>
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
                                <button onClick={() => setIsDoctorModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    + Add Doctor
                                </button>
                            </div>
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                     <div key={doctor.id} className="bg-gray-700/50 p-4 rounded-lg transition-all hover:bg-gray-700">
                                        <p className="font-bold text-lg">{doctor.name}</p>
                                        <p className="text-sm text-gray-400">{doctor.specialization}</p>
                                     </div>
                                ))}
                                {doctors.length === 0 && <p className="text-gray-500 text-center py-4">No doctors on duty.</p>}
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Appointments</h2>
                                <button onClick={() => setIsBookingModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    + Book
                                </button>
                            </div>
                            <div className="space-y-4">
                                {appointments.map((appt) => (
                                    <div key={appt.id} className={`bg-gray-700/50 p-4 rounded-lg ${appt.status === 'Canceled' ? 'opacity-40' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">{appt.patientName}</p>
                                                <p className="text-sm text-gray-400">Dr. {appt.doctor.name}</p>
                                                <p className="text-xs text-gray-500 pt-1">{new Date(appt.appointmentTime).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">{appt.status}</p>
                                                {appt.status === 'Booked' && (
                                                    <button onClick={() => handleCancelAppointment(appt.id)} className="text-xs text-red-400 hover:underline mt-1">Cancel</button>
                                                )}
                                            </div>
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
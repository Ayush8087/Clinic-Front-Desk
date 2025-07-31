'use client';
import { useState } from 'react';
import api from '../services/api';

interface Doctor {
    id: number;
    name: string;
    specialization: string; // We need specialization here
}

interface Props {
    doctors: Doctor[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookAppointmentModal({ doctors, onClose, onSuccess }: Props) {
    const [patientName, setPatientName] = useState('');
    const [doctorId, setDoctorId] = useState<number | ''>('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientName || !doctorId || !appointmentTime) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await api.post('/appointments', {
                patientName,
                doctorId,
                appointmentTime: new Date(appointmentTime).toISOString(),
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to book appointment', error);
            alert('Error booking appointment.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Book New Appointment</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Patient's Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
                    />
                    <select
                        value={doctorId}
                        onChange={(e) => setDoctorId(Number(e.target.value))}
                        className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
                    >
                        <option value="" disabled>Select a Specialization</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.specialization}
                            </option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
                    />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 rounded">Book Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
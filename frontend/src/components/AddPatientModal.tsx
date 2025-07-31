'use client';
import { useState } from 'react';
import api from '../services/api';

interface Doctor { id: number; name: string; }
interface Props {
    doctors: Doctor[]; // <-- Receive doctors as a prop
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPatientModal({ doctors, onClose, onSuccess }: Props) {
    const [patientName, setPatientName] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [doctorId, setDoctorId] = useState<number | ''>(''); // <-- New state for doctor ID

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientName) return;
        try {
            const payload: any = {
                patientName,
                priority: isUrgent ? 'Urgent' : 'Normal',
            };
            if (doctorId) {
                payload.doctorId = doctorId;
            }
            await api.post('/queue', payload);
            onSuccess();
        } catch (error) { console.error('Failed to add patient', error); alert('Error adding patient.'); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add Patient to Queue</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Patient's Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />

                    {/* --- NEW DOCTOR DROPDOWN --- */}
                    <select value={doctorId} onChange={(e) => setDoctorId(Number(e.target.value))} className="w-full p-3 mb-4 bg-gray-700 rounded text-white">
                        <option value="">Assign Doctor (Optional)</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                        ))}
                    </select>

                    <div className="flex items-center mb-6">
                        <input id="urgent-checkbox" type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-5 h-5 text-red-600" />
                        <label htmlFor="urgent-checkbox" className="ms-2 text-lg font-medium text-red-500">Mark as Urgent</label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 rounded">Add to Queue</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
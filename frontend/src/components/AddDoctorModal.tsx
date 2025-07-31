'use client';
import { useState } from 'react';
import api from '../services/api';

interface Props { onClose: () => void; onSuccess: () => void; }

export default function AddDoctorModal({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !specialization) return;
        try {
            await api.post('/doctors', { name, specialization });
            onSuccess();
        } catch (error) { console.error('Failed to add doctor', error); alert('Error adding doctor.'); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add New Doctor</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Doctor's Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
                    <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded text-white" />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 rounded">Save Doctor</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
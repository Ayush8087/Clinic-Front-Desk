'use client';
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Doctor { id: number; name: string; specialization: string; gender: string; location: string; availability: string; }
interface Props { doctor: Doctor; onClose: () => void; onSuccess: () => void; }

export default function EditDoctorModal({ doctor, onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [gender, setGender] = useState('Male');
    const [location, setLocation] = useState('');
    const [availability, setAvailability] = useState('Available');

    useEffect(() => {
        if (doctor) {
            setName(doctor.name);
            setSpecialization(doctor.specialization);
            setGender(doctor.gender);
            setLocation(doctor.location);
            setAvailability(doctor.availability);
        }
    }, [doctor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/doctors/${doctor.id}`, { name, specialization, gender, location, availability });
            onSuccess();
        } catch (error) { console.error('Failed to update doctor', error); alert('Error updating doctor.'); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Edit Doctor</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Doctor's Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
                    <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />

                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded text-white" />
                    <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded text-white">
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Off Duty">Off Duty</option>
                    </select>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 rounded">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
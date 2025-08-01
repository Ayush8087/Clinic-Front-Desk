'use client';
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Appointment {
    id: number;
    appointmentTime: string;
}

interface Props {
    appointment: Appointment;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RescheduleModal({ appointment, onClose, onSuccess }: Props) {
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        // Pre-fill the input with the current appointment time
        const formattedTime = new Date(appointment.appointmentTime).toISOString().slice(0, 16);
        setNewTime(formattedTime);
    }, [appointment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.patch(`/appointments/${appointment.id}`, {
                appointmentTime: new Date(newTime).toISOString(),
            });
            onSuccess();
        } catch (error) {
            alert('Error rescheduling appointment.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Reschedule Appointment</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="datetime-local"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
                    />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
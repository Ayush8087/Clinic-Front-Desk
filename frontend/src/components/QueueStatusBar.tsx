'use client';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface QueueStats {
    waiting: number;
    withDoctor: number;
    completed: number;
    total: number;
}

interface DoctorWorkload {
    doctorId: number;
    doctorName: string;
    patientCount: number;
}

export default function QueueStatusBar() {
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [workload, setWorkload] = useState<DoctorWorkload[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatusData = async () => {
        try {
            const [statsRes, workloadRes] = await Promise.all([
                api.get('/queue/stats'),
                api.get('/queue/workload')
            ]);
            setStats(statsRes.data);
            setWorkload(workloadRes.data);
        } catch (error) {
            console.error('Failed to fetch status data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    console.log(stats);
    useEffect(() => {
        fetchStatusData();
        // Refresh every 30 seconds for real-time updates
        const interval = setInterval(fetchStatusData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Queue Status</h2>
            
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{stats.waiting}</div>
                    <div className="text-sm text-gray-400">Waiting</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{stats.withDoctor}</div>
                    <div className="text-sm text-gray-400">With Doctor</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress: {stats.completed}/{stats.total}</span>
                    <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Doctor Workload */}
            {workload.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Doctor Workload</h3>
                    <div className="space-y-2">
                        {workload.map((doctor) => (
                            <div key={doctor.doctorId} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                <span className="font-medium">Dr. {doctor.doctorName}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    doctor.patientCount === 0 ? 'bg-green-500 text-white' :
                                    doctor.patientCount === 1 ? 'bg-blue-500 text-white' :
                                    'bg-yellow-500 text-black'
                                }`}>
                                    {doctor.patientCount} patient{doctor.patientCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="text-xs text-gray-500 text-center mt-4">
                Auto-refreshing every 30 seconds
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

export default function LoginPage() {
    const [username, setUsername] = useState('frontdesk');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            const token = response.data.access_token;
            if (token) {
                localStorage.setItem('token', token);
                router.push('/dashboard');
            }
        } catch (err) { setError('Invalid username or password.'); console.error('Login failed:', err); }
    };

    return (
        <main className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className="p-10 bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Front Desk Login</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">Login</button>
            </form>
        </main>
    );
}
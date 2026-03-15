import React, { useState } from 'react';
import { api } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import InteractiveButton from '../components/InteractiveButton';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('auth/register/', { username, email, password });
            navigate('/login');
        } catch (err: any) {
            console.error('Registration Error:', err);
            if (err.response) {
                // Handle DRF validation errors which are objects like { username: [...], password: [...] }
                const data = err.response.data;
                if (typeof data === 'object' && !data.detail) {
                    const messages = Object.keys(data).map(key => `${ key }: ${ data[key].join(', ') }`).join('\n');
                    setError(messages);
                } else {
                    setError(data.detail || 'Registration failed. Please check your connection.');
                }
            } else if (err.request) {
                setError('No response from server. Is the backend running?');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 p-8 glass-panel glass-card-hover">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gradient drop-shadow-sm pb-2">TaskPro</h1>
                    <h2 className="text-2xl font-bold text-black mt-2">Create Account</h2>
                    <p className="text-gray-800 text-sm mt-1">Join TaskPro today</p>
                </div>
                {error && <div className="bg-red-200/80 backdrop-blur text-red-900 font-medium p-3 rounded-md text-sm text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 glass-input sm:text-sm"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="email"
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 glass-input sm:text-sm mt-4"
                            placeholder="Email (Optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-4 py-3 glass-input sm:text-sm mt-4"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <InteractiveButton
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-white/40 text-sm font-bold rounded-lg text-black bg-white/40 hover:bg-white/50 backdrop-blur-md shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/70 focus:ring-offset-transparent"
                    >
                        Sign Up
                    </InteractiveButton>
                    <div className="text-sm text-center pt-2">
                        <Link to="/login" className="font-semibold text-gray-800 hover:text-black transition-colors">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

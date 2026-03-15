import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, CheckCircle, Circle, LogOut, Search, AlertCircle, Check } from 'lucide-react';
import InteractiveButton from '../components/InteractiveButton';

interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    due_date: string;
    status: 'Pending' | 'Completed';
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task>>({});
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const { logout, user } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Include backend filtering/sorting if possible, or do it on frontend
            // Requirements ask for Search/filter by title or priority on backend
            let url = 'tasks/?ordering=due_date';
            if (searchQuery) url += `&search=${searchQuery}`;
            if (priorityFilter !== 'All') url += `&priority=${priorityFilter}`;
            if (statusFilter !== 'All') url += `&status=${statusFilter}`;

            const data = await api.get(url);
            setTasks(data);
        } catch (error: any) {
            console.error("Error fetching tasks:", error);
            if (error.response?.status === 401) {
                // Should be handled by interceptor, but just in case
                console.log("Unauthorized, redirecting to login...");
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`tasks/${ id }/`);
            showNotification('Task deleted successfully!', 'success');
            setTasks(tasks.filter((t: Task) => t.id !== id));
        } catch (error: any) {
            showNotification(error.message || 'Failed to delete task.', 'error');
            console.error(error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentTask.id) {
                await api.put(`tasks/${ currentTask.id }/`, currentTask);
                showNotification('Task updated successfully!', 'success');
            } else {
                await api.post('tasks/', currentTask);
                showNotification('Task created successfully!', 'success');
            }
            setIsModalOpen(false);
            setCurrentTask({});
            fetchTasks();
        } catch (error: any) {
            showNotification(error.message || 'Failed to save task.', 'error');
            console.error(error);
        }
    };

    const toggleStatus = async (task: Task) => {
        try {
            const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
            await api.patch(`tasks/${ task.id }/`, { status: newStatus });
            showNotification(`Task marked as ${newStatus.toLowerCase()}!`, 'success');
            fetchTasks();
        } catch (error: any) {
            showNotification(error.message || 'Failed to update status.', 'error');
            console.error(error);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Fallback frontend filtering if needed (though we're doing it on backend now)
    const filteredTasks = tasks.filter((t: Task) => {
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        // Priority and Search are mostly handled by backend, but redundant check here doesn't hurt
        return matchesStatus;
    });

    const priorityColor = (p: string) => {
        switch (p) {
            case 'High': return 'text-red-900 bg-red-200/60 border border-red-500/30';
            case 'Medium': return 'text-yellow-900 bg-yellow-200/60 border border-yellow-500/30';
            case 'Low': return 'text-green-900 bg-green-200/60 border border-green-500/30';
            default: return 'text-gray-900 bg-gray-200/60 border border-gray-500/30';
        }
    };

    const formatDueDate = (dateString: string) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDueParts = () => {
        if (!currentTask.due_date) return { date: '', h12: '12', m: '00', ampm: 'PM' };
        const dt = new Date(currentTask.due_date);
        if (isNaN(dt.getTime())) return { date: '', h12: '12', m: '00', ampm: 'PM' };

        const date = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        const h24 = dt.getHours();
        const h12 = (h24 % 12 || 12).toString().padStart(2, '0');
        const m = dt.getMinutes().toString().padStart(2, '0');
        const ampm = h24 >= 12 ? 'PM' : 'AM';
        return { date, h12, m, ampm };
    };

    const dueParts = getDueParts();

    const updateDueParts = (updates: any) => {
        const p = { ...dueParts, ...updates };
        if (!p.date) {
            setCurrentTask({ ...currentTask, due_date: '' });
            return;
        }
        const d = new Date(p.date); // parsed at local midnight
        let h24 = parseInt(p.h12, 10);
        if (p.ampm === 'AM' && h24 === 12) h24 = 0;
        if (p.ampm === 'PM' && h24 < 12) h24 += 12;
        const finalDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h24, parseInt(p.m, 10));
        setCurrentTask({ ...currentTask, due_date: finalDate.toISOString() });
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <nav className="glass-panel mb-8 border border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-extrabold text-gradient drop-shadow-sm pb-1">TaskPro</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-black font-medium">Welcome, {user?.name || 'User'}</span>
                            <InteractiveButton onClick={logout} className="p-2 rounded-full hover:bg-white/40 text-black transition-colors">
                                <LogOut size={20} />
                            </InteractiveButton>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pb-12">
                {notification && (
                    <div className={`fixed top-20 right-4 z-[100] p-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
                        notification.type === 'success' 
                        ? 'bg-green-100/80 border-green-500/50 text-green-900' 
                        : 'bg-red-100/80 border-red-500/50 text-red-900'
                    }`}>
                        {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold">{notification.message}</span>
                    </div>
                )}

                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative flex-1 max-w-xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} shadow-sm />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-panel border border-white/20 focus:border-white/60 transition-all outline-none text-black font-semibold shadow-inner placeholder:text-gray-600/80"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' && fetchTasks()}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 glass-panel p-1.5 border border-white/20 rounded-xl">
                                    <span className="px-2 text-[10px] font-black text-gray-500 uppercase tracking-wider">Status</span>
                                    {['All', 'Pending', 'Completed'].map((f) => (
                                        <InteractiveButton
                                            key={f}
                                            onClick={() => { setStatusFilter(f as any); setTimeout(fetchTasks, 0); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${ statusFilter === f ? 'bg-white/60 text-black shadow-sm border border-white/60' : 'text-gray-600 hover:bg-white/30 hover:text-black' }`}
                                        >
                                            {f}
                                        </InteractiveButton>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5 glass-panel p-1.5 border border-white/20 rounded-xl">
                                    <span className="px-2 text-[10px] font-black text-gray-500 uppercase tracking-wider">Priority</span>
                                    {['All', 'Low', 'Medium', 'High'].map((p) => (
                                        <InteractiveButton
                                            key={p}
                                            onClick={() => { setPriorityFilter(p as any); setTimeout(fetchTasks, 0); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${ priorityFilter === p ? 'bg-white/60 text-black shadow-sm border border-white/60' : 'text-gray-600 hover:bg-white/30 hover:text-black' }`}
                                        >
                                            {p}
                                        </InteractiveButton>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <InteractiveButton
                            onClick={() => { setCurrentTask({}); setIsModalOpen(true); }}
                            className="flex items-center justify-center px-8 py-3.5 rounded-2xl shadow-xl border border-white/60 font-black text-black bg-white/40 hover:bg-white/60 backdrop-blur-md transition-all duration-300 active:scale-95"
                        >
                            <Plus size={22} className="mr-2" /> New Task
                        </InteractiveButton>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map(task => (
                        <div key={task.id} className="glass-panel glass-card-hover border border-white/20 flex flex-col justify-between overflow-hidden shadow-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h3 className={`text-xl font-extrabold text-black leading-tight ${ task.status === 'Completed' ? 'line-through opacity-40' : '' }`}>
                                        {task.title}
                                    </h3>
                                    <span className={`shrink-0 px-3 py-1 text-[10px] font-black rounded-lg backdrop-blur-md uppercase tracking-widest ${ priorityColor(task.priority) }`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${ task.status === 'Completed' ? 'text-gray-500 italic' : 'text-gray-700' }`}>
                                    {task.description}
                                </p>
                            </div>
                            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter mb-0.5">Deadline</span>
                                    <span className={`text-xs font-bold ${ task.status === 'Completed' ? 'text-gray-400' : 'text-black' }`}>
                                        {formatDueDate(task.due_date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <InteractiveButton 
                                        onClick={(e) => { e.stopPropagation(); toggleStatus(task); }} 
                                        className={`p-2.5 rounded-xl transition-all duration-300 ${ task.status === 'Completed' ? 'text-green-600 bg-green-500/10 border border-green-500/20' : 'text-gray-400 bg-white/10 border border-white/20 hover:text-green-600 hover:bg-green-500/10 hover:border-green-500/20' }`}
                                        title={task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                                    >
                                        {task.status === 'Completed' ? <CheckCircle size={22} strokeWidth={2.5} /> : <Circle size={22} strokeWidth={2.5} />}
                                    </InteractiveButton>
                                    <InteractiveButton 
                                        onClick={(e) => { e.stopPropagation(); setCurrentTask(task); setIsModalOpen(true); }} 
                                        className="p-2.5 rounded-xl text-blue-600 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300"
                                        title="Edit Task"
                                    >
                                        <Edit2 size={20} strokeWidth={2.5} />
                                    </InteractiveButton>
                                    <InteractiveButton 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }} 
                                        className="p-2.5 rounded-xl text-red-600 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
                                        title="Delete Task"
                                    >
                                        <Trash2 size={20} strokeWidth={2.5} />
                                    </InteractiveButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom glass-panel border border-white/30 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={handleSave}>
                                <div className="p-6 sm:p-8">
                                    <div className="sm:flex sm:items-start w-full">
                                        <div className="w-full">
                                            <h3 className="text-2xl font-extrabold text-black mb-6">
                                                {currentTask.id ? 'Edit Task' : 'New Task'}
                                            </h3>
                                            <div className="space-y-5">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full rounded-lg px-4 py-3 glass-input sm:text-sm"
                                                    placeholder="Task Title"
                                                    value={currentTask.title || ''}
                                                    onChange={e => setCurrentTask({ ...currentTask, title: e.target.value })}
                                                />
                                                <textarea
                                                    className="w-full rounded-lg px-4 py-3 glass-input sm:text-sm resize-none"
                                                    placeholder="Task Description"
                                                    rows={4}
                                                    value={currentTask.description || ''}
                                                    onChange={e => setCurrentTask({ ...currentTask, description: e.target.value })}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-800 mb-1">Priority</label>
                                                        <select
                                                            className="w-full rounded-lg px-4 py-3 glass-input sm:text-sm [&>option]:bg-white [&>option]:text-black"
                                                            value={currentTask.priority || 'Medium'}
                                                            onChange={e => setCurrentTask({ ...currentTask, priority: e.target.value as any })}
                                                        >
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-800 mb-1">Due Date & Time</label>
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="date"
                                                                className="w-full rounded-lg px-3 py-3 glass-input sm:text-sm"
                                                                value={dueParts.date}
                                                                onChange={(e) => updateDueParts({ date: e.target.value })}
                                                            />
                                                            <div className="flex gap-1 items-center">
                                                                <select
                                                                    className="w-[60px] rounded-lg px-2 py-3 glass-input sm:text-sm [&>option]:bg-white [&>option]:text-black"
                                                                    value={dueParts.h12}
                                                                    onChange={(e) => updateDueParts({ h12: e.target.value })}
                                                                >
                                                                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                                                </select>
                                                                <span className="font-bold text-gray-800">:</span>
                                                                <select
                                                                    className="w-[60px] rounded-lg px-2 py-3 glass-input sm:text-sm [&>option]:bg-white [&>option]:text-black"
                                                                    value={dueParts.m}
                                                                    onChange={(e) => updateDueParts({ m: e.target.value })}
                                                                >
                                                                    {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                                <select
                                                                    className="w-[65px] rounded-lg px-2 py-3 glass-input sm:text-sm [&>option]:bg-white [&>option]:text-black"
                                                                    value={dueParts.ampm}
                                                                    onChange={(e) => updateDueParts({ ampm: e.target.value })}
                                                                >
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-white/20 sm:flex sm:flex-row-reverse bg-black/5">
                                    <InteractiveButton type="submit" className="w-full inline-flex justify-center rounded-lg border border-white/60 shadow-lg px-6 py-2.5 font-bold text-black bg-white/40 hover:bg-white/60 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300">
                                        Save Task
                                    </InteractiveButton>
                                    <InteractiveButton type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-lg border border-white/40 shadow-sm px-6 py-2.5 font-semibold text-gray-800 bg-white/20 hover:bg-white/40 hover:text-black focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300">
                                        Cancel
                                    </InteractiveButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

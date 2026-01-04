'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Mail, Phone, MapPin, User } from 'lucide-react';

interface Customer {
    id: number;
    username: string;
    email: string;
    role: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8081/api/admin/users')
            .then(res => {
                setCustomers(res.data);
                setIsLoading(false);
            })
            .catch(err => setIsLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-serif text-[var(--color-dark-900)]">Customer Data</h1>
                <p className="text-gray-500 text-sm">View details of registered members</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3 w-full max-w-md">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="text-gray-500">Loading customers...</p>
                ) : filtered.map(customer => (
                    <div key={customer.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[var(--color-gold-500)] group-hover:text-white transition-colors">
                                <User size={24} />
                            </div>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">ID: {customer.id}</span>
                        </div>

                        <h3 className="font-medium text-lg text-[var(--color-dark-900)] mb-1">{customer.username}</h3>

                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Mail size={16} /> {customer.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <Phone size={16} /> <span className="italic text-gray-400">No phone data</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

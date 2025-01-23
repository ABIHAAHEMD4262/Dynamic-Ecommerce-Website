// src/app/checkout/page.tsx
"use client";

import React, { useState } from "react";
import { Loader2 } from 'lucide-react';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Your order has been placed successfully!");
        console.log("Order Details:", formData);
    };

    return (
        <div className="max-w-md mx-auto my-16 p-8 bg-gradient-to-r bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-black text-center mb-2">Checkout</h1>
            <p className="text-center text-sm text-yellow-300 font-semibold mb-2">🔥 Complete your order now! 🔥</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium txt-black">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-black">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-black">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirm Order
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage; // Ensure this line is present
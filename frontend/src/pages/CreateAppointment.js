import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CreateAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const FIXED_PRICE = 2000;
  const doctors = ['Dr. Nimal', 'Dr. Perera', 'Dr. Silva', 'Dr. Fernando'];

  const [form, setForm] = useState({
    pet: '',
    doctor: '',
    date: '',
    service: '',
    price: FIXED_PRICE,
  });

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!form.pet.trim()) return alert('❌ Pet name is required.') || false;
    if (!nameRegex.test(form.pet)) return alert('❌ No special characters in pet name.') || false;
    if (!form.doctor || !form.date || !form.service) return alert('❌ All fields are required.') || false;
    return true;
  };

  const generatePDF = (appointment) => {
    const doc = new jsPDF();
    doc.text('🐾 Appointment Confirmation', 20, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Details']],
      body: [
        ['Pet Name', appointment.pet],
        ['Doctor', appointment.doctor],
        ['Service', appointment.service],
        ['Date', new Date(appointment.date).toLocaleString()],
        ['Price', `Rs. ${appointment.price}`],
      ],
    });
    doc.save(`Appointment_${appointment.pet}.pdf`);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      await axios.post('/appointments', form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      generatePDF(form);
      alert('✅ Appointment created!');
      navigate('/appointments');
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      alert('❌ Failed to create appointment.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-rose-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">+ New Appointment</h2>

        <input
          className="w-full p-3 border rounded-xl mb-4"
          placeholder="🐶 Pet name"
          value={form.pet}
          onChange={(e) => setForm({ ...form, pet: e.target.value })}
        />

        <select
          className="w-full p-3 border rounded-xl mb-4"
          value={form.doctor}
          onChange={(e) => setForm({ ...form, doctor: e.target.value })}
        >
          <option value="">👨‍⚕️ Select Doctor</option>
          {doctors.map((doc, i) => <option key={i}>{doc}</option>)}
        </select>

        <input
          type="datetime-local"
          className="w-full p-3 border rounded-xl mb-4"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          className="w-full p-3 border rounded-xl mb-4"
          placeholder="💉 Service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        />

        <input
          type="number"
          className="w-full p-3 border rounded-xl mb-2 bg-gray-100 cursor-not-allowed"
          readOnly
          value={FIXED_PRICE}
        />
        <p className="text-gray-500 text-sm mb-4">💰 Appointment Cost: Rs. {FIXED_PRICE}</p>

        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
          onClick={handleSubmit}
        >
          Submit & Download PDF
        </button>
      </div>
    </div>
  );
}

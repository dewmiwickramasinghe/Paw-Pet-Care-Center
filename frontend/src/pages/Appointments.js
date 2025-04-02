import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Appointments.css'; // Custom styles

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const FIXED_PRICE = 2000;
  const doctors = ['Dr. Nimal', 'Dr. Perera', 'Dr. Silva', 'Dr. Fernando'];

  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    pet: '',
    doctor: '',
    date: '',
    service: '',
    price: FIXED_PRICE,
  });

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/appointments', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('❌ Fetch error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (user?.token) fetchAppointments();
  }, [user]);

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!form.pet.trim()) {
      alert('❌ Pet name is required.');
      return false;
    }

    if (!nameRegex.test(form.pet)) {
      alert('❌ Pet name cannot contain special characters like @, #, etc.');
      return false;
    }

    if (!form.doctor || !form.date || !form.service) {
      alert('❌ Please fill out all fields.');
      return false;
    }

    return true;
  };

  const generatePDF = (appointment) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
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
        ['Owner', user?.name || 'N/A'],
        ['Email', user?.email || 'N/A'],
      ],
    });

    doc.save(`Appointment_${appointment.pet}.pdf`);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        '/appointments',
        { ...form, price: FIXED_PRICE },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert('✅ Appointment created');
      generatePDF({ ...form, price: FIXED_PRICE });
      setForm({ pet: '', doctor: '', date: '', service: '', price: FIXED_PRICE });
      fetchAppointments();
    } catch (err) {
      console.error('❌ Submit error:', err.response?.data || err.message);
      alert('Failed to save appointment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchAppointments();
    } catch (err) {
      console.error('❌ Delete error:', err.response?.data || err.message);
      alert('Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter((app) =>
    `${app.pet} ${app.doctor} ${app.service}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-rose-50 to-indigo-100">
      <div className="flex-grow p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow">
          🐾 Appointments
        </h2>

        {/* Form */}
        {user?.role !== 'admin' && (
          <div className="form-box space-y-3 mb-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">+ Create Appointment</h3>

            <input
              placeholder="🐶 Pet name"
              value={form.pet}
              onChange={(e) => setForm({ ...form, pet: e.target.value })}
              className="p-3 border rounded-xl w-full"
            />

            <select
              value={form.doctor}
              onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              className="p-3 border rounded-xl w-full"
            >
              <option value="">👨‍⚕️ Select Doctor</option>
              {doctors.map((doc, index) => (
                <option key={index} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="p-3 border rounded-xl w-full"
            />

            <input
              placeholder="💉 Service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="p-3 border rounded-xl w-full"
            />

            <input
              type="number"
              value={FIXED_PRICE}
              readOnly
              className="p-3 border rounded-xl w-full bg-gray-100 cursor-not-allowed"
              placeholder="💰 Price"
            />

            <p className="text-sm text-gray-600 mt-1 mb-2">
              💰 <strong>Appointment Cost: Rs. {FIXED_PRICE}</strong>
            </p>

            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition transform hover:-translate-y-1"
            >
              Save Appointment & Download PDF
            </button>
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search by pet, doctor, or service"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-3 border border-gray-300 rounded-xl w-full shadow"
        />

        {/* Appointment Cards */}
        <ul className="space-y-5">
          {filteredAppointments.map((app) => (
            <li
              key={app._id}
              className="appointment-card p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div>
                <h4 className="text-xl font-semibold text-indigo-700">
                  🐕 {app.pet}{' '}
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(app.date).toLocaleString()}
                  </span>
                </h4>
                <p className="text-gray-700 mt-1">
                  Service: <strong>{app.service}</strong> <br />
                  Doctor: <span className="text-gray-800">{app.doctor}</span> <br />
                  💰 Price: <span className="text-green-700 font-semibold">Rs. {app.price}</span>
                </p>
                {user?.role === 'admin' && app.user && (
                  <div className="mt-2 text-sm text-gray-600">
                    👤 <strong>{app.user.name}</strong> — {app.user.email}
                    <span className="admin-badge ml-2">Pet Owner</span>
                  </div>
                )}
              </div>
              <div className="space-x-3 mt-4">
                <button
                  onClick={() => navigate(`/appointments/edit/${app._id}`)}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition shadow"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

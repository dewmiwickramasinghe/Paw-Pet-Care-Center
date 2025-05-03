import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Footer from '../components/Footer';
import '../styles/Appointments.css';

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const generatePDF = (appointment) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('🐾 Appointment Summary', 20, 20);
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

  const generateFullTablePDF = () => {
    if (filteredAppointments.length === 0) {
      alert('❌ No appointments to export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('📋 All Appointments Report', 20, 20);

    const tableBody = filteredAppointments.map((app) => [
      app.pet,
      app.doctor,
      app.service,
      new Date(app.date).toLocaleString(),
      `Rs. ${app.price}`,
      user?.role === 'admin' ? `${app.user?.name || 'N/A'}\n${app.user?.email || ''}` : '',
    ]);

    const tableHead = user?.role === 'admin'
      ? [['Pet', 'Doctor', 'Service', 'Date', 'Price', 'Owner']]
      : [['Pet', 'Doctor', 'Service', 'Date', 'Price']];

    autoTable(doc, {
      startY: 30,
      head: tableHead,
      body: tableBody,
      styles: { fontSize: 10 },
    });

    doc.save('All_Appointments_Report.pdf');
  };

  const filteredAppointments = appointments.filter((app) =>
    `${app.pet} ${app.doctor} ${app.service}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-rose-50 to-indigo-100">
      <div className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow">
          🐾 Appointments
        </h2>

        {/* New Appointment Button */}
        {user?.role !== 'admin' && (
          <div className="mb-6 text-right">
            <button
              onClick={() => navigate('/appointments/create')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition transform hover:-translate-y-1"
            >
              + New Appointment
            </button>
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search by pet, doctor, or service"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 p-3 border border-gray-300 rounded-xl w-full shadow"
        />

        {/* Download Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => {
              if (filteredAppointments.length === 0) {
                alert('❌ No matching appointment found.');
              } else if (filteredAppointments.length > 1) {
                alert('⚠️ Please refine your search to match only one appointment.');
              } else {
                generatePDF(filteredAppointments[0]);
              }
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            📄 Download Search Result PDF
          </button>

          <button
            onClick={generateFullTablePDF}
            className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
          >
            📥 Download Full Table PDF
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-xl text-sm">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold">
              <tr>
                <th className="p-4 text-left">Pet</th>
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Price</th>
                {user?.role === 'admin' && <th className="p-4 text-left">Owner</th>}
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{app.pet}</td>
                    <td className="p-4">{app.doctor}</td>
                    <td className="p-4">{app.service}</td>
                    <td className="p-4">{new Date(app.date).toLocaleString()}</td>
                    <td className="p-4 text-green-700 font-semibold">Rs. {app.price}</td>
                    {user?.role === 'admin' && (
                      <td className="p-4 text-sm text-gray-600">
                        <strong>{app.user?.name}</strong>
                        <br />
                        <span>{app.user?.email}</span>
                      </td>
                    )}
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => navigate(`/appointments/edit/${app._id}`)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => generatePDF(app)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === 'admin' ? 7 : 6}
                    className="text-center text-gray-500 p-6"
                  >
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}

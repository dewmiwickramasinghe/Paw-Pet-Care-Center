import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1976d2', '#43a047', '#d32f2f'];

const Budget = () => {
  const [budget, setBudget] = useState(10000); // default budget, can make this editable
  const [spent, setSpent] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then(res => {
        setOrders(res.data || []);
        const totalSpent = res.data.reduce((sum, order) => sum + (order.total || 0), 0);
        setSpent(totalSpent);
      });
  }, []);

  const remaining = Math.max(budget - spent, 0);

  const data = [
    { name: 'Earn', value: spent },
    { name: 'Remaining', value: remaining }
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 24 }}>Budget Dashboard</h2>
      <div style={{ marginBottom: 24 }}>
        <label>
          <b>Set Budget (LKR):</b>
          <input
            type="number"
            value={budget}
            min={0}
            style={{ marginLeft: 12, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
            onChange={e => setBudget(Number(e.target.value))}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 320, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3>Budget Summary</h3>
          <p><b>Budget:</b> LKR {budget.toLocaleString()}</p>
          <p><b>Earn:</b> LKR {spent.toLocaleString()}</p>
          <p><b>Remaining:</b> LKR {remaining.toLocaleString()}</p>
          <p><b>Number of Orders:</b> {orders.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Budget;

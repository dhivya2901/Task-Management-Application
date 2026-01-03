import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [title, setTitle] = useState('');

  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);

  const login = (e) => {
    e.preventDefault();
    setToken('logged-in');
    localStorage.setItem('token', 'logged-in');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title) return;
    setTasks([...tasks, { id: Date.now(), title, status: 'Todo' }]);
    setTitle('');
  };

  const toggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Todo' ? 'Done' : 'Todo' } : t));
  };

  const chartData = {
    labels: ['Done', 'Todo'],
    datasets: [{
      data: [tasks.filter(t => t.status === 'Done').length, tasks.filter(t => t.status === 'Todo').length],
      backgroundColor: ['#4BC0C0', '#FF6384'],
    }]
  };

  if (!token) return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <form onSubmit={login} style={{ display: 'inline-block', border: '1px solid #ccc', padding: '40px', borderRadius: '10px' }}>
        <h2>Assignment Login</h2>
        <input type="email" placeholder="Email" required style={{ display: 'block', margin: '10px auto', padding: '8px' }} />
        <input type="password" placeholder="Password" required style={{ display: 'block', margin: '10px auto', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4BC0C0', color: 'white', border: 'none' }}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', padding: '40px', fontFamily: 'Arial', gap: '50px' }}>
      <div style={{ flex: 1 }}>
        <h1>Task Dashboard</h1>
        <form onSubmit={addTask}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task name..." style={{ padding: '10px', width: '200px' }} />
          <button type="submit" style={{ padding: '10px', marginLeft: '5px' }}>Add Task</button>
        </form>
        <div style={{ marginTop: '20px' }}>
          {tasks.map(t => (
            <div key={t.id} style={{ borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{t.title} - <strong>{t.status}</strong></span>
              <button onClick={() => toggle(t.id)}>Change Status</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '350px' }}>
        <h2>Progress Graph</h2>
        {tasks.length > 0 ? <Pie data={chartData} /> : <p>Add a task to see the Pie Chart!</p>}
      </div>
    </div>
  );
}

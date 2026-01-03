import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// This fixes the "Blank Page" error by registering the chart parts
ChartJS.register(ArcElement, Tooltip, Legend);

export default function App() {
  // 1. STATE MANAGEMENT
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('my_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [token, setToken] = useState(localStorage.getItem('user_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  // 2. SAVE TASKS AUTOMATICALLY
  useEffect(() => {
    localStorage.setItem('my_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. LOGIN HANDLER (Shows Email/Password Labels)
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setToken('logged-in');
      localStorage.setItem('user_token', 'logged-in');
    }
  };

  // 4. CRUD FUNCTIONS (Add, Update, Delete)
  const addTask = (e) => {
    e.preventDefault();
    if (!title) return;
    const newTask = { id: Date.now(), title, status: 'Todo' };
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'Todo' ? 'Done' : 'Todo' } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // 5. CHART DATA
  const chartData = {
    labels: ['Done', 'Todo'],
    datasets: [{
      data: [
        tasks.filter(t => t.status === 'Done').length,
        tasks.filter(t => t.status === 'Todo').length
      ],
      backgroundColor: ['#4BC0C0', '#FF6384'],
      borderWidth: 1,
    }]
  };

  // --- VIEW 1: LOGIN SCREEN ---
  if (!token) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
        <form onSubmit={handleLogin} style={{ display: 'inline-block', border: '2px solid #eee', padding: '40px', borderRadius: '15px' }}>
          <h2>TASK APP Login</h2>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label><strong>Email Address:</strong></label><br/>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@example.com" required style={{ width: '250px', padding: '10px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label><strong>Password:</strong></label><br/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password" required style={{ width: '250px', padding: '10px', marginTop: '5px' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4BC0C0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login to Dashboard</button>
        </form>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div style={{ display: 'flex', padding: '40px', gap: '60px', fontFamily: 'Arial', maxWidth: '1000px', margin: 'auto' }}>
      
      {/* LEFT SIDE: TASK LIST */}
      <div style={{ flex: 1 }}>
        <h1>Task Manager</h1>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{ marginBottom: '20px' }}>Logout</button>
        
        <form onSubmit={addTask} style={{ marginBottom: '30px' }}>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="What needs to be done?" 
            style={{ padding: '12px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
          <button type="submit" style={{ padding: '12px 20px', marginLeft: '10px', backgroundColor: '#4BC0C0', color: 'white', border: 'none', borderRadius: '5px' }}>Add Task</button>
        </form>

        <div style={{ borderTop: '1px solid #eee' }}>
          {tasks.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <span style={{ fontSize: '18px', textDecoration: t.status === 'Done' ? 'line-through' : 'none' }}>{t.title}</span>
                <br /><small style={{ color: t.status === 'Done' ? 'green' : 'red' }}>{t.status}</small>
              </div>
              <div>
                <button onClick={() => toggleStatus(t.id)} style={{ marginRight: '10px' }}>Update</button>
                <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: PIE CHART */}
      <div style={{ width: '350px', textAlign: 'center' }}>
        <h2>Progress Graph</h2>
        <div style={{ height: '300px', marginTop: '20px' }}>
          {tasks.length > 0 ? (
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          ) : (
            <div style={{ padding: '50px', border: '2px dashed #ccc', color: '#999' }}>
              Add a task to see the Graph
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

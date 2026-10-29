import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [employees, setEmployees] = useState([])
  useEffect(() => {
  fetch('http://localhost:5000/api/employees')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load employees')
      }
      return response.json()
    })
    .then((data) => {
      setEmployees(data)
    })
    .catch((error) => {
      console.error('Error loading employees:', error)
    })
}, [])
  const [form, setForm] = useState({ name: '', role: '', department: '' })


async function addEmployee(e) {
  e.preventDefault()

  if (
    !form.name.trim() ||
    !form.role.trim() ||
    !form.department.trim()
  ) {
    return
  }

  try {
    const response = await fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        position: form.role,
        department: form.department,
        email: form.email || `${form.name.trim().toLowerCase().replace(/\s+/g, '.')}@staffsync.com`,
        status: 'Active',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add employee')
    }

    const newEmployee = await response.json()

    setEmployees((previousEmployees) => [
      ...previousEmployees,
      {
        ...newEmployee,
        role: newEmployee.position,
      },
    ])

    setForm({ name: '', role: '', department: '' })
    setShowForm(false)

    alert('Employee saved successfully!')
  } catch (error) {
    console.error('Error adding employee:', error)
    alert(`Could not save employee: ${error.message}`)
  }
}


  const filteredEmployees = employees.filter(employee =>
    `${employee.name} ${employee.role} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const menu = ['Dashboard', 'Employees', 'Attendance', 'Leave Requests', 'Announcements', 'Settings']

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">Staff<span>Sync</span></h2>
        <p className="menu-title">MAIN MENU</p>

        <nav>
          {menu.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
              className={page === item ? 'active' : ''}
              onClick={e => {
                e.preventDefault()
                setPage(item)
                setSearch('')
              }}
            >
              {item === 'Dashboard' ? '▦' :
                item === 'Employees' ? '♙' :
                item === 'Attendance' ? '◷' :
                item === 'Leave Requests' ? '▤' :
                item === 'Announcements' ? '♢' : '⚙'} {item}
            </a>
          ))}
        </nav>

        <div className="profile">
          <div className="avatar">HR</div>
          <div><strong>HR Admin</strong><p>Administrator</p></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome">STAFFSYNC HR PORTAL</p>
            <h2>{page === 'Dashboard' ? 'Welcome back, HR Administrator 👋' : page}</h2>
          </div>
          <div className="date">📅 HR Management System</div>
        </header>

        {page === 'Dashboard' && (
          <>
            <section className="hero">
              <div>
                <p className="hero-label">YOUR PEOPLE, ONE PLATFORM</p>
                <h1>Manage your people.<br />Empower your workplace.</h1>
                <p>Everything you need to manage your team, all in one place.</p>
                <button onClick={() => setPage('Employees')}>Explore Employees →</button>
              </div>
              <div className="hero-art">👥</div>
            </section>

            <section className="stats">
              <div className="stat-card"><div className="stat-icon purple">♙</div><p>Total Employees</p><h2>{employees.length}</h2><span>Team members</span></div>
              <div className="stat-card"><div className="stat-icon green">✓</div><p>Present Today</p><h2>3</h2><span>Sample attendance</span></div>
              <div className="stat-card"><div className="stat-icon orange">◷</div><p>Pending Leaves</p><h2>2</h2><span>Sample requests</span></div>
              <div className="stat-card"><div className="stat-icon blue">♧</div><p>Departments</p><h2>{new Set(employees.map(e => e.department)).size}</h2><span>Unique departments</span></div>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading"><div><h3>Recent Employees</h3><p>Your team members</p></div><button className="text-button" onClick={() => setPage('Employees')}>View all →</button></div>
                {employees.slice(-3).reverse().map(employee => (
                  <div className="employee-row" key={employee.id}>
                    <div className="person-avatar lavender">{employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div className="person-info"><strong>{employee.name}</strong><p>{employee.role}</p></div>
                    <span className="status active-status">{employee.status}</span>
                  </div>
                ))}
              </div>
              <div className="panel">
                <div className="panel-heading"><div><h3>Leave Requests</h3><p>Sample requests for demonstration</p></div></div>
                <div className="employee-row"><div className="person-avatar peach">NM</div><div className="person-info"><strong>Neha Mishra</strong><p>Casual Leave · 2 days</p></div><span className="status pending-status">Pending</span></div>
                <div className="employee-row"><div className="person-avatar lavender">AV</div><div className="person-info"><strong>Arjun Verma</strong><p>Sick Leave · 1 day</p></div><span className="status pending-status">Pending</span></div>
                <button className="review-button" onClick={() => setPage('Leave Requests')}>Review Requests →</button>
              </div>
            </section>
          </>
        )}

        {page === 'Employees' && (
          <section className="panel employee-page">
            <div className="panel-heading">
              <div><h3>Employee Directory</h3><p>Manage your company's employee records</p></div>
              <button className="primary-button" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Employee'}</button>
            </div>

            {showForm && (
              <form className="employee-form" onSubmit={addEmployee}>
                <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Job title" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
                <button className="primary-button" type="submit">Save Employee</button>
              </form>
            )}

            <input className="search-input" placeholder="🔍 Search by name, role or department..." value={search} onChange={e => setSearch(e.target.value)} />

            <div className="table-wrap">
              <table>
                <thead><tr><th>EMPLOYEE</th><th>JOB TITLE</th><th>DEPARTMENT</th><th>STATUS</th></tr></thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td><strong>{employee.name}</strong></td>
                      <td>{employee.role}</td>
                      <td>{employee.department}</td>
                      <td><span className="status active-status">{employee.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && <p className="empty-state">No employees found. Try another search.</p>}
            </div>
            <p className="table-footer">Showing {filteredEmployees.length} of {employees.length} employees · Demo data only</p>
          </section>
        )}

        {page === 'Attendance' && (
          <section className="panel">
            <div className="panel-heading"><div><h3>Attendance Overview</h3><p>Sample attendance records</p></div></div>
            {employees.map((employee, i) => <div className="employee-row" key={employee.id}><div className="person-avatar lavender">{employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div className="person-info"><strong>{employee.name}</strong><p>{i === 3 ? 'On leave' : '09:00 AM – Present'}</p></div><span className={`status ${i === 3 ? 'pending-status' : 'active-status'}`}>{i === 3 ? 'On Leave' : 'Present'}</span></div>)}
          </section>
        )}

        {page === 'Leave Requests' && (
          <section className="panel"><div className="panel-heading"><div><h3>Leave Requests</h3><p>Demonstration records</p></div></div>
            {['Neha Mishra', 'Arjun Verma'].map((name, i) => <div className="employee-row" key={name}><div className="person-avatar peach">{name.split(' ').map(n => n[0]).join('')}</div><div className="person-info"><strong>{name}</strong><p>{i === 0 ? 'Casual Leave · 2 days' : 'Sick Leave · 1 day'}</p></div><span className="status pending-status">Pending</span></div>)}
          </section>
        )}

        {page === 'Announcements' && <section className="panel"><h3>Announcements</h3><p className="section-description">Company news and updates will appear here.</p><div className="announcement-card"><strong>Welcome to StaffSync!</strong><p>This is your HR management portal demonstration.</p></div></section>}

        {page === 'Settings' && <section className="panel"><h3>Settings</h3><p className="section-description">StaffSync portal settings</p><div className="announcement-card"><strong>Administrator Profile</strong><p>Role: HR Administrator</p><p>Authentication and profile editing will be added with the backend.</p></div></section>}

        <footer>© 2026 StaffSync · HR Management Portal · Frontend Demo</footer>
      </main>
    </div>
  )
}

export default App
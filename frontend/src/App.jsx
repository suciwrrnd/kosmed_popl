import { useState } from 'react'
import './App.css'

import Dashboard from './components/Dashboard'
import Obat from './components/Obat'
import Makanan from './components/Makanan'
import Air from './components/Air'
import Reminder from './components/Reminder'
import Keluhan from './components/Keluhan'
import Tidur from './components/Tidur'
import Ringkasan from './components/Ringkasan'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginPanel, setIsLoginPanel] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogin = (e) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setTab={setActiveTab} />
      case 'obat': return <Obat />
      case 'makanan': return <Makanan />
      case 'air': return <Air />
      case 'reminder': return <Reminder />
      case 'keluhan': return <Keluhan />
      case 'tidur': return <Tidur />
      case 'ringkasan': return <Ringkasan />
      default: return <Dashboard setTab={setActiveTab} />
    }
  }

  const NavItem = ({ id, icon, label }) => (
    <li className="nav-item">
      <a className={`nav-link km-navlink ${activeTab === id ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab(id) }}>
        <i className={`fa-solid ${icon} me-1`}></i>{label}
      </a>
    </li>
  )

  if (isAuthenticated) {
    return (
      <div id="main-app">
        <nav className="navbar navbar-expand-lg km-navbar fixed-top">
          <div className="container-fluid px-4">
            <a className="navbar-brand km-brand" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}>
              <i className="fa-solid fa-heart-pulse me-2"></i>KosMed
            </a>
            <div className="collapse navbar-collapse d-flex justify-content-between">
              <ul className="navbar-nav mx-auto gap-1">
                <NavItem id="dashboard" icon="fa-gauge" label="Dashboard" />
                <NavItem id="obat" icon="fa-pills" label="Stok Obat" />
                <NavItem id="makanan" icon="fa-utensils" label="Makanan" />
                <NavItem id="air" icon="fa-droplet" label="Air Minum" />
                <NavItem id="reminder" icon="fa-bell" label="Reminder" />
                <NavItem id="keluhan" icon="fa-notes-medical" label="Keluhan" />
                <NavItem id="tidur" icon="fa-moon" label="Tidur" />
                <NavItem id="ringkasan" icon="fa-chart-bar" label="Ringkasan" />
              </ul>
              <div className="d-flex align-items-center gap-2 ms-2">
                <div className="navbar-avatar" style={{ background: 'rgba(255,255,255,0.2)', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>U</div>
                <span className="navbar-username" style={{ color: 'white' }}>User</span>
                <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout} title="Keluar">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="km-main-content" style={{ marginTop: '80px', padding: '20px' }}>
          {renderTab()}
        </div>
      </div>
    )
  }

  // Jika belum login, tampilkan Auth Panel
  return (
    <div id="auth-screen">
      <div className="auth-bg-decor"></div>
      <div className="auth-left">
        <div className="auth-brand-wrap animate-fade-in">
          <div className="auth-logo-circle mb-4">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <h1 className="auth-brand-title">KosMed</h1>
          <p className="auth-brand-sub">Health Tracker untuk Anak Kos</p>
          <div className="auth-features mt-4">
            <div className="auth-feature-item"><i className="fa-solid fa-pills"></i> Pantau stok obatmu</div>
            <div className="auth-feature-item"><i className="fa-solid fa-utensils"></i> Catat pola makan harian</div>
            <div className="auth-feature-item"><i className="fa-solid fa-droplet"></i> Tracker air minum</div>
            <div className="auth-feature-item"><i className="fa-solid fa-moon"></i> Monitor pola tidur</div>
            <div className="auth-feature-item"><i className="fa-solid fa-bell"></i> Reminder kesehatan</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        {/* LOGIN */}
        {isLoginPanel ? (
          <div id="panel-login" className="auth-panel animate-slide-up">
            <h2 className="auth-panel-title">Masuk</h2>
            <p className="auth-panel-sub">Selamat datang kembali!</p>
            <form onSubmit={handleLogin} noValidate>
              <div className="mb-3">
                <label className="km-label">Username</label>
                <div className="km-input-icon-wrap">
                  <i className="fa-solid fa-user km-input-icon"></i>
                  <input type="text" className="km-input km-input-icon-pad w-100" placeholder="Masukkan username" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="km-label">Password</label>
                <div className="km-input-icon-wrap">
                  <i className="fa-solid fa-lock km-input-icon"></i>
                  <input type="password" className="km-input km-input-icon-pad w-100" placeholder="Masukkan password" required />
                </div>
              </div>
              <button type="submit" className="btn-km-primary w-100 mb-3" style={{ padding: '12px', borderRadius: '10px', background: 'var(--maroon)', color: 'white', border: 'none' }}>
                <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>Masuk
              </button>
              <p className="text-center auth-switch-text">
                Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginPanel(false) }} className="auth-link">Daftar sekarang</a>
              </p>
            </form>
          </div>
        ) : (
          <div id="panel-register" className="auth-panel animate-slide-up">
            <h2 className="auth-panel-title">Daftar</h2>
            <p className="auth-panel-sub">Buat akun KosMed gratis.</p>
            <form onSubmit={handleRegister} noValidate>
              <div className="mb-3">
                <label className="km-label">Nama Lengkap</label>
                <div className="km-input-icon-wrap">
                  <i className="fa-solid fa-id-card km-input-icon"></i>
                  <input type="text" className="km-input km-input-icon-pad w-100" placeholder="Nama kamu" required />
                </div>
              </div>
              <div className="mb-3">
                <label className="km-label">Username</label>
                <div className="km-input-icon-wrap">
                  <i className="fa-solid fa-user km-input-icon"></i>
                  <input type="text" className="km-input km-input-icon-pad w-100" placeholder="Buat username unik" required />
                </div>
              </div>
              <div className="mb-3">
                <label className="km-label">Password</label>
                <div className="km-input-icon-wrap">
                  <i className="fa-solid fa-lock km-input-icon"></i>
                  <input type="password" className="km-input km-input-icon-pad w-100" placeholder="Min. 6 karakter" required />
                </div>
              </div>
              <button type="submit" className="btn-km-primary w-100 mb-3" style={{ padding: '12px', borderRadius: '10px', background: 'var(--maroon)', color: 'white', border: 'none' }}>
                <i className="fa-solid fa-user-plus me-2"></i>Buat Akun
              </button>
              <p className="text-center auth-switch-text">
                Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginPanel(true) }} className="auth-link">Masuk di sini</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

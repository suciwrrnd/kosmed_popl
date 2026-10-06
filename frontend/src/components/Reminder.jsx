import React, { useState } from 'react';
import DataService from '../services/DataService';

export default function Reminder() {
  const [list, setList] = useState(DataService.getReminder());
  const [form, setForm] = useState({ judul: '', waktu: '', kategori: 'obat' });

  const handleAdd = (e) => {
    e.preventDefault();
    DataService.addReminder(form);
    setList(DataService.getReminder());
    setForm({ judul: '', waktu: '', kategori: 'obat' });
  };

  const toggle = (id) => {
    DataService.toggleReminder(id);
    setList(DataService.getReminder());
  };

  const hapus = (id) => {
    DataService.deleteReminder(id);
    setList(DataService.getReminder());
  };

  const iconMap = {
    obat: 'fa-pills',
    air: 'fa-droplet',
    makan: 'fa-utensils',
    tidur: 'fa-moon',
    lainnya: 'fa-bell',
  };

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-bell me-2"></i>Reminder</h2>
        <p className="page-subtitle">Atur pengingat kesehatanmu</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-plus me-2"></i>Tambah Reminder</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="km-label">Judul Reminder</label>
                <input type="text" className="km-input w-100" placeholder="Misal: Minum Paracetamol" value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="km-label">Waktu</label>
                <input type="time" className="km-input w-100" value={form.waktu} onChange={e => setForm({ ...form, waktu: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="km-label">Kategori</label>
                <select className="km-input w-100" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                  <option value="obat">💊 Minum Obat</option>
                  <option value="air">💧 Minum Air</option>
                  <option value="makan">🍽️ Makan</option>
                  <option value="tidur">🌙 Tidur</option>
                  <option value="lainnya">🔔 Lainnya</option>
                </select>
              </div>
              <button type="submit" className="btn-km-primary w-100">Set Reminder</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3">Daftar Reminder</h5>
            {list.length === 0
              ? <p className="text-muted">Belum ada reminder.</p>
              : list.map(r => (
                <div key={r.id} className="d-flex align-items-center justify-content-between p-3 mb-2 rounded" style={{ background: r.aktif ? 'var(--ivory-mid)' : '#f5f5f5', border: '1px solid var(--border-color)', opacity: r.aktif ? 1 : 0.6 }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--maroon-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--maroon)' }}>
                      <i className={'fa-solid ' + (iconMap[r.kategori] || 'fa-bell')}></i>
                    </div>
                    <div>
                      <div className="fw-medium">{r.judul}</div>
                      <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{r.waktu}</div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className={'btn btn-sm ' + (r.aktif ? 'btn-outline-secondary' : 'btn-outline-success')}
                      onClick={() => toggle(r.id)}
                    >
                      {r.aktif ? 'Matikan' : 'Hidupkan'}
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => hapus(r.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

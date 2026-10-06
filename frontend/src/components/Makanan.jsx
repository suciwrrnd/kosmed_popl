import React, { useState } from 'react';
import DataService from '../services/DataService';

export default function Makanan() {
  const [makananList, setMakananList] = useState(DataService.getMakanan());
  const [form, setForm] = useState({ nama: '', waktu: 'pagi' });
  const [foodType, setFoodType] = useState(null);

  const handleInput = (val) => {
    setForm({ ...form, nama: val });
    const result = DataService.detectFood(val);
    setFoodType(result.type ? result : null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    DataService.addMakanan({ ...form, kategori: foodType ? foodType.type : 'cukup_sehat' });
    setMakananList(DataService.getMakanan());
    setForm({ nama: '', waktu: 'pagi' });
    setFoodType(null);
  };

  const getFoodAlert = () => {
    if (!foodType) return null;
    const map = {
      kurang_sehat: { cls: 'food-detect-unhealthy', icon: 'fa-triangle-exclamation', label: 'Kurang Sehat' },
      cukup_sehat: { cls: 'food-detect-moderate', icon: 'fa-circle-info', label: 'Cukup Sehat' },
      sehat: { cls: 'food-detect-healthy', icon: 'fa-circle-check', label: 'Sehat' },
    };
    const s = map[foodType.type];
    if (!s) return null;
    return (
      <div className={'food-detect-alert ' + s.cls + ' mt-2'}>
        <i className={'fa-solid ' + s.icon} style={{ flexShrink: 0, marginTop: '2px' }}></i>
        <span>Terdeteksi sebagai <strong>{s.label}</strong> <em style={{ opacity: .65 }}>("{foodType.matched}")</em></span>
      </div>
    );
  };

  const getBadge = (kategori) => {
    if (kategori === 'kurang_sehat') return <span className="km-badge-status status-danger">Kurang Sehat</span>;
    if (kategori === 'sehat') return <span className="km-badge-status status-safe">Sehat</span>;
    return <span className="km-badge-status status-warn">Cukup Sehat</span>;
  };

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-utensils me-2"></i>Tracker Makanan</h2>
        <p className="page-subtitle">Catat apa yang kamu makan hari ini</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-pen-to-square me-2"></i>Catat Makanan</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="km-label">Nama Makanan</label>
                <input
                  type="text"
                  className="km-input w-100"
                  placeholder="Misal: nasi ayam, indomie..."
                  value={form.nama}
                  onChange={e => handleInput(e.target.value)}
                  required
                  autoComplete="off"
                />
                {getFoodAlert()}
              </div>
              <div className="mb-4">
                <label className="km-label">Waktu Makan</label>
                <select className="km-input w-100" value={form.waktu} onChange={e => setForm({ ...form, waktu: e.target.value })} required>
                  <option value="pagi">🌅 Pagi</option>
                  <option value="siang">☀️ Siang</option>
                  <option value="malam">🌙 Malam</option>
                </select>
              </div>
              <button type="submit" className="btn-km-primary w-100"><i className="fa-solid fa-plus me-2"></i>Simpan</button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="km-card p-4 h-100">
            <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-clock-rotate-left me-2"></i>Riwayat Hari Ini</h5>
            {makananList.length === 0
              ? <p className="text-muted">Belum ada makanan yang dicatat.</p>
              : (
                <div className="table-responsive">
                  <table className="table km-table">
                    <thead>
                      <tr><th>Waktu</th><th>Makanan</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {makananList.map(m => (
                        <tr key={m.id}>
                          <td style={{ textTransform: 'capitalize' }}>{m.waktu}</td>
                          <td className="fw-medium">{m.nama}</td>
                          <td>{getBadge(m.kategori)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

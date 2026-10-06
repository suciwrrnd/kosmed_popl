import React, { useState } from 'react';
import DataService from '../services/DataService';

export default function Tidur() {
  const [list, setList] = useState(DataService.getTidur());
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jam_tidur: '',
    jam_bangun: '',
    catatan: '',
  });
  const [preview, setPreview] = useState(null);

  const hitungDurasi = (jt, jb) => {
    try {
      const [h1, m1] = jt.split(':').map(Number);
      const [h2, m2] = jb.split(':').map(Number);
      let t1 = h1 * 60 + m1;
      let t2 = h2 * 60 + m2;
      if (t2 < t1) t2 += 24 * 60;
      return Math.round((t2 - t1) / 60 * 10) / 10;
    } catch (e) { return null; }
  };

  const handleChange = (field, val) => {
    const nf = { ...form, [field]: val };
    setForm(nf);
    if (nf.jam_tidur && nf.jam_bangun) {
      setPreview(hitungDurasi(nf.jam_tidur, nf.jam_bangun));
    } else {
      setPreview(null);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    DataService.addTidur(form);
    setList(DataService.getTidur());
    setForm({ ...form, jam_tidur: '', jam_bangun: '', catatan: '' });
    setPreview(null);
  };

  const hapus = (id) => {
    DataService.deleteTidur(id);
    setList(DataService.getTidur());
  };

  // Statistik
  const recent = list.slice(0, 7);
  const avg = recent.length > 0 ? Math.round(recent.reduce((a, t) => a + (t.durasi || 0), 0) / recent.length * 10) / 10 : null;
  const maxT = recent.length > 0 ? Math.max(...recent.map(t => t.durasi || 0)) : null;
  const minT = recent.length > 0 ? Math.min(...recent.map(t => t.durasi || 0)) : null;

  const getStatusTidur = (d) => {
    if (d >= 7 && d <= 9) return { cls: 'tidur-card cukup', badge: 'tidur-status-badge status-tidur-cukup', label: 'Cukup' };
    if (d > 9)            return { cls: 'tidur-card berlebih', badge: 'tidur-status-badge status-tidur-berlebih', label: 'Berlebih' };
    return { cls: 'tidur-card kurang', badge: 'tidur-status-badge status-tidur-kurang', label: 'Kurang' };
  };

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-moon me-2"></i>Tracker Tidur</h2>
        <p className="page-subtitle">Pantau pola tidurmu agar tetap segar setiap hari</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          {/* Form Catat */}
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-pen-to-square me-2"></i>Catat Tidur</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="km-label">Tanggal</label>
                <input type="date" className="km-input" value={form.tanggal} onChange={e => handleChange('tanggal', e.target.value)} required />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="km-label">Jam Tidur</label>
                  <input type="time" className="km-input" value={form.jam_tidur} onChange={e => handleChange('jam_tidur', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="km-label">Jam Bangun</label>
                  <input type="time" className="km-input" value={form.jam_bangun} onChange={e => handleChange('jam_bangun', e.target.value)} required />
                </div>
              </div>

              {preview !== null && (
                <div className="tidur-preview mb-3">
                  <i className="fa-solid fa-moon me-2"></i>
                  Estimasi tidur: <strong>{preview} jam</strong>
                  {preview >= 7 ? ' 😊 Bagus!' : preview >= 5 ? ' 😐 Kurang ideal' : ' 😟 Terlalu sedikit'}
                </div>
              )}

              <div className="mb-4">
                <label className="km-label">Catatan (opsional)</label>
                <input type="text" className="km-input" placeholder="Misal: susah tidur, mimpi buruk..." value={form.catatan} onChange={e => handleChange('catatan', e.target.value)} />
              </div>

              <button type="submit" className="btn-km-primary w-100">
                <i className="fa-solid fa-floppy-disk me-2"></i>Simpan
              </button>
            </form>
          </div>

          {/* Statistik */}
          <div className="km-card p-4 mt-4">
            <h6 className="km-card-label mb-3">Statistik 7 Hari</h6>
            <div className="tidur-stat-row">
              <span className="tidur-stat-label">Rata-rata tidur</span>
              <span className="tidur-stat-val">{avg !== null ? avg + ' jam' : '—'}</span>
            </div>
            <div className="tidur-stat-row">
              <span className="tidur-stat-label">Terpanjang</span>
              <span className="tidur-stat-val">{maxT !== null ? maxT + ' jam' : '—'}</span>
            </div>
            <div className="tidur-stat-row">
              <span className="tidur-stat-label">Terpendek</span>
              <span className="tidur-stat-val">{minT !== null ? minT + ' jam' : '—'}</span>
            </div>
          </div>
        </div>

        {/* Riwayat */}
        <div className="col-lg-8">
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3">Riwayat Tidur</h5>
            {list.length === 0
              ? <div className="text-center py-5 text-muted"><i className="fa-solid fa-moon" style={{ fontSize: '2rem', opacity: .3 }}></i><p className="mt-2">Belum ada data tidur.</p></div>
              : list.map(t => {
                  const s = getStatusTidur(t.durasi);
                  return (
                    <div key={t.id} className={s.cls}>
                      <div>
                        <div className="tidur-durasi">{t.durasi} jam</div>
                        <div className="tidur-jam">{t.jam_tidur} → {t.jam_bangun}</div>
                      </div>
                      <div style={{ flex: 1, paddingLeft: '8px' }}>
                        <div style={{ fontSize: '.84rem', fontWeight: '500' }}>{t.tanggal}</div>
                        {t.catatan && <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{t.catatan}</div>}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={s.badge}>{s.label}</span>
                        <button className="btn-hapus-obat" onClick={() => hapus(t.id)}><i className="fa-solid fa-xmark"></i></button>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

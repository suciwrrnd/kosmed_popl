import React, { useState } from 'react';
import DataService from '../services/DataService';

const JENIS_OPTIONS = [
  { value: '', label: 'Pilih keluhan...' },
  { value: 'Pusing', label: '😵 Pusing' },
  { value: 'Sakit Perut', label: '🤢 Sakit Perut' },
  { value: 'Demam', label: '🤒 Demam' },
  { value: 'Batuk', label: '😮‍💨 Batuk' },
  { value: 'Pilek', label: '🤧 Pilek' },
  { value: 'Lemas', label: '😴 Lemas' },
  { value: 'Mual', label: '🥴 Mual' },
  { value: 'Sakit Kepala', label: '🤕 Sakit Kepala' },
  { value: 'Sakit Tenggorokan', label: '😩 Sakit Tenggorokan' },
  { value: 'Nyeri Otot', label: '💪 Nyeri Otot' },
  { value: 'Lainnya', label: '📝 Lainnya' },
];

export default function Keluhan() {
  const [list, setList] = useState(DataService.getKeluhan());
  const [form, setForm] = useState({
    jenis: '',
    lainnya: '',
    intensitas: 'ringan',
    tanggal: new Date().toISOString().split('T')[0],
    catatan: '',
  });
  const [filter, setFilter] = useState('semua');

  const handleAdd = (e) => {
    e.preventDefault();
    const keluhan = form.jenis === 'Lainnya' ? form.lainnya : form.jenis;
    if (!keluhan) return;
    DataService.addKeluhan({
      jenis: keluhan,
      intensitas: form.intensitas,
      tanggal: form.tanggal,
      catatan: form.catatan,
    });
    setList(DataService.getKeluhan());
    setForm({ jenis: '', lainnya: '', intensitas: 'ringan', tanggal: form.tanggal, catatan: '' });
  };

  const hapus = (id) => {
    DataService.deleteKeluhan(id);
    setList(DataService.getKeluhan());
  };

  const setIntensitas = (val) => setForm(f => ({ ...f, intensitas: val }));

  const filtered = filter === 'semua' ? list : list.filter(k => k.intensitas === filter);

  const intensitasClass = (val) => {
    if (val === form.intensitas) {
      if (val === 'ringan') return 'intensitas-btn active-ringan';
      if (val === 'sedang') return 'intensitas-btn active-sedang';
      if (val === 'berat') return 'intensitas-btn active-berat';
    }
    return 'intensitas-btn';
  };

  const badgeIntensitas = (i) => {
    const map = {
      ringan: 'badge-intensitas badge-ringan',
      sedang: 'badge-intensitas badge-sedang',
      berat:  'badge-intensitas badge-berat',
    };
    return map[i] || 'badge-intensitas';
  };

  const filterBtnClass = (f) => 'filter-btn' + (filter === f ? ' active' : '');

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-notes-medical me-2"></i>Catatan Keluhan Kesehatan</h2>
        <p className="page-subtitle">Catat keluhan ringan yang kamu rasakan</p>
      </div>

      <div className="row g-4">
        {/* FORM */}
        <div className="col-lg-4">
          <div className="km-card p-4">
            <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-pen-to-square me-2"></i>Catat Keluhan</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="km-label">Jenis Keluhan</label>
                <select
                  className="km-input"
                  value={form.jenis}
                  onChange={e => setForm(f => ({ ...f, jenis: e.target.value }))}
                  required
                >
                  {JENIS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {form.jenis === 'Lainnya' && (
                <div className="mb-3">
                  <label className="km-label">Sebutkan keluhan</label>
                  <input
                    type="text"
                    className="km-input"
                    placeholder="Tulis keluhanmu..."
                    value={form.lainnya}
                    onChange={e => setForm(f => ({ ...f, lainnya: e.target.value }))}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="km-label">Intensitas</label>
                <div className="intensitas-selector">
                  <button type="button" className={intensitasClass('ringan')} onClick={() => setIntensitas('ringan')}>🟢 Ringan</button>
                  <button type="button" className={intensitasClass('sedang')} onClick={() => setIntensitas('sedang')}>🟡 Sedang</button>
                  <button type="button" className={intensitasClass('berat')}  onClick={() => setIntensitas('berat')}>🔴 Berat</button>
                </div>
              </div>

              <div className="mb-3">
                <label className="km-label">Tanggal</label>
                <input type="date" className="km-input" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} required />
              </div>

              <div className="mb-4">
                <label className="km-label">Catatan Tambahan (opsional)</label>
                <textarea className="km-input" rows="3" placeholder="Tambahkan catatan..." value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}></textarea>
              </div>

              <button type="submit" className="btn-km-primary w-100">
                <i className="fa-solid fa-floppy-disk me-2"></i>Simpan
              </button>
            </form>
          </div>
        </div>

        {/* LIST */}
        <div className="col-lg-8">
          <div className="km-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold text-maroon mb-0"><i className="fa-solid fa-clock-rotate-left me-2"></i>Riwayat Keluhan</h5>
              <div className="d-flex gap-2">
                {['semua','ringan','sedang','berat'].map(f => (
                  <button key={f} className={filterBtnClass(f)} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0
              ? <div className="text-center py-5 text-muted"><i className="fa-solid fa-notes-medical" style={{ fontSize: '2rem', opacity: .3 }}></i><p className="mt-2">Tidak ada keluhan.</p></div>
              : filtered.map(k => (
                <div key={k.id} className={'keluhan-card ' + k.intensitas}>
                  <div style={{ flex: 1 }}>
                    <div className="keluhan-jenis">{k.jenis}</div>
                    {k.catatan && <div className="keluhan-catatan">{k.catatan}</div>}
                    <div className="keluhan-meta">{k.tanggal}</div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-2">
                    <span className={badgeIntensitas(k.intensitas)} style={{ textTransform: 'capitalize' }}>{k.intensitas}</span>
                    <button className="btn-hapus-obat" onClick={() => hapus(k.id)}><i className="fa-solid fa-xmark"></i></button>
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

import React, { useState } from 'react';
import DataService from '../services/DataService';

export default function Obat() {
  const [obatList, setObatList] = useState(DataService.getObat());
  const [form, setForm] = useState({ nama: '', kegunaan: '', stok: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    DataService.addObat({ ...form, stok: parseInt(form.stok) || 0 });
    setObatList(DataService.getObat());
    setForm({ nama: '', kegunaan: '', stok: '' });
  };

  const ubahStok = (id, change) => {
    DataService.updateStokObat(id, change);
    setObatList(DataService.getObat());
  };

  const hapus = (id) => {
    DataService.deleteObat(id);
    setObatList(DataService.getObat());
  };

  const getStatus = (stok) => {
    if (stok === 0) return { cls: 'status-danger', icon: 'fa-xmark', label: 'Habis!', cardCls: 'habis' };
    if (stok <= 1) return { cls: 'status-warn', icon: 'fa-exclamation', label: 'Kritis', cardCls: 'kritis' };
    return { cls: 'status-safe', icon: 'fa-check', label: 'Aman', cardCls: '' };
  };

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-pills me-2"></i>Stok Obat</h2>
        <p className="page-subtitle">Pantau ketersediaan obat-obatan di kosmu</p>
      </div>

      <div className="km-card p-4 mb-4">
        <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-plus me-2"></i>Tambah Obat</h5>
        <form onSubmit={handleAdd} className="row g-3">
          <div className="col-md-4">
            <label className="km-label">Nama Obat</label>
            <input type="text" className="km-input w-100" placeholder="Misal: Paracetamol" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required />
          </div>
          <div className="col-md-4">
            <label className="km-label">Kegunaan</label>
            <input type="text" className="km-input w-100" placeholder="Misal: Demam & pusing" value={form.kegunaan} onChange={e => setForm({ ...form, kegunaan: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <label className="km-label">Stok Awal</label>
            <input type="number" className="km-input w-100" placeholder="0" value={form.stok} onChange={e => setForm({ ...form, stok: e.target.value })} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn-km-primary w-100">Simpan</button>
          </div>
        </form>
      </div>

      <div className="row g-4">
        {obatList.length === 0 && (
          <div className="col-12">
            <div className="km-card text-center py-5">
              <i className="fa-solid fa-pills" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', opacity: '.3' }}></i>
              <p className="mt-3 text-muted mb-1">Belum ada data obat.</p>
            </div>
          </div>
        )}

        {obatList.map(o => {
          const s = getStatus(parseInt(o.stok));
          return (
            <div key={o.id} className="col-md-6 col-lg-4">
              <div className={'obat-card ' + s.cardCls} style={{ position: 'relative', background: 'white', borderRadius: '16px', padding: '20px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
                <div className="d-flex position-absolute top-0 end-0 m-2 gap-1">
                  <button className="btn-hapus-obat" onClick={() => hapus(o.id)} title="Hapus">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div className="obat-nama">{o.nama}</div>
                <div className="obat-guna"><i className="fa-solid fa-stethoscope me-1"></i>{o.kegunaan}</div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <div>
                    <div style={{ fontSize: '.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Stok</div>
                    <div className="obat-stok-number">{o.stok}</div>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <button className="btn-stok" onClick={() => ubahStok(o.id, 1)}>+</button>
                    <button className="btn-stok" onClick={() => ubahStok(o.id, -1)} disabled={parseInt(o.stok) === 0}>−</button>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={'km-badge-status ' + s.cls} style={{ fontSize: '.75rem', padding: '.18rem .7rem' }}>
                    <i className={'fa-solid ' + s.icon + ' me-1'}></i>{s.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

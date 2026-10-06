import React from 'react';
import DataService from '../services/DataService';

export default function Dashboard({ setTab }) {
  const air = DataService.getAir();
  const makanan = DataService.getMakanan();
  const obat = DataService.getObat();
  const tidur = DataService.getTidur();
  const reminder = DataService.getReminder();

  const airProgress = Math.min((air.jumlah / air.target) * 100, 100);
  const mSehat = makanan.filter(m => m.kategori === 'sehat' || m.kategori === 'cukup_sehat').length;
  const mBuruk = makanan.filter(m => m.kategori === 'kurang_sehat').length;
  const stokAman = obat.every(o => parseInt(o.stok) > 1);
  const obatKritis = obat.filter(o => parseInt(o.stok) <= 1);
  const tidurTerakhir = tidur.length > 0 ? tidur[tidur.length - 1] : null;

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-gauge me-2"></i>Dashboard</h2>
        <p className="page-subtitle">Ringkasan kondisi kesehatanmu hari ini</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="km-card h-100 text-center">
            <div className="km-card-icon-wrap bg-blue-soft mb-3"><i className="fa-solid fa-droplet text-blue"></i></div>
            <h6 className="km-card-label">Air Minum Hari Ini</h6>
            <div className="km-stat-big">
              <span>{air.jumlah}</span><span className="km-stat-sep">/</span><span>{air.target}</span>
            </div>
            <div className="km-stat-unit">gelas</div>
            <div className="km-progress-wrap mt-3">
              <div className="km-progress">
                <div className="km-progress-bar bg-blue" style={{ width: airProgress + '%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="km-card h-100 text-center">
            <div className="km-card-icon-wrap bg-green-soft mb-3"><i className="fa-solid fa-bowl-food text-green"></i></div>
            <h6 className="km-card-label">Pola Makan</h6>
            <div className="row mt-3">
              <div className="col-6">
                <div className="km-stat-mini text-green">{mSehat}</div>
                <div className="km-stat-mini-label">Sehat</div>
              </div>
              <div className="col-6">
                <div className="km-stat-mini text-maroon">{mBuruk}</div>
                <div className="km-stat-mini-label">Kurang</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="km-card h-100 text-center">
            <div className="km-card-icon-wrap bg-purple-soft mb-3"><i className="fa-solid fa-moon text-purple"></i></div>
            <h6 className="km-card-label">Tidur Terakhir</h6>
            <div className="km-stat-big" style={{ fontSize: '2rem' }}>
              {tidurTerakhir ? tidurTerakhir.durasi + 'j' : '—'}
            </div>
            <div className="km-stat-unit">
              {tidurTerakhir ? 'Bangun jam ' + tidurTerakhir.jam_bangun : 'Belum ada data'}
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="km-card h-100 text-center">
            <div className="km-card-icon-wrap bg-red-soft mb-3"><i className="fa-solid fa-kit-medical text-maroon"></i></div>
            <h6 className="km-card-label">Status Stok Obat</h6>
            <div className="mt-3">
              {obat.length === 0
                ? <div className="km-badge-status status-safe"><i className="fa-solid fa-check me-1"></i>Aman</div>
                : stokAman
                  ? <div className="km-badge-status status-safe"><i className="fa-solid fa-check me-1"></i>Aman</div>
                  : <div className="km-badge-status status-warn"><i className="fa-solid fa-exclamation me-1"></i>{obatKritis.length} Kritis</div>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="km-card p-4">
            <h6 className="km-card-label mb-3"><i className="fa-solid fa-bell me-1"></i>Reminder Hari Ini</h6>
            {reminder.length === 0
              ? <p className="text-muted" style={{ fontSize: '.88rem' }}>Belum ada reminder.</p>
              : reminder.map(r => (
                  <div key={r.id} className="d-flex justify-content-between mb-2">
                    <span>{r.judul}</span>
                    <strong>{r.waktu}</strong>
                  </div>
                ))
            }
            <a href="#" onClick={e => { e.preventDefault(); setTab('reminder'); }} className="dash-link mt-2 d-inline-block">
              Lihat semua →
            </a>
          </div>
        </div>

        <div className="col-md-6">
          <div className="km-card p-4">
            <h5 className="fw-semibold mb-3 text-maroon"><i className="fa-solid fa-bolt me-2"></i>Aksi Cepat</h5>
            <div className="row g-2">
              <div className="col-6">
                <button className="km-quick-btn w-100 py-3" onClick={() => setTab('obat')}>
                  <i className="fa-solid fa-pills mb-1 d-block fs-5"></i>
                  <span style={{ fontSize: '.82rem' }}>Stok Obat</span>
                </button>
              </div>
              <div className="col-6">
                <button className="km-quick-btn w-100 py-3" onClick={() => setTab('makanan')}>
                  <i className="fa-solid fa-utensils mb-1 d-block fs-5"></i>
                  <span style={{ fontSize: '.82rem' }}>Catat Makan</span>
                </button>
              </div>
              <div className="col-6">
                <button className="km-quick-btn km-quick-btn-primary w-100 py-3" onClick={() => { DataService.tambahAir(); setTab('dashboard'); }}>
                  <i className="fa-solid fa-plus mb-1 d-block fs-5"></i>
                  <span style={{ fontSize: '.82rem' }}>+1 Gelas Air</span>
                </button>
              </div>
              <div className="col-6">
                <button className="km-quick-btn w-100 py-3" onClick={() => setTab('ringkasan')}>
                  <i className="fa-solid fa-chart-bar mb-1 d-block fs-5"></i>
                  <span style={{ fontSize: '.82rem' }}>Ringkasan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import DataService from '../services/DataService';

export default function Air() {
  const [air, setAir] = useState(() => DataService.getAir());
  const [targetInput, setTargetInput] = useState(DataService.getAir().target);

  const tambah = () => {
    const updated = DataService.tambahAir();
    setAir({ ...updated });
  };

  const simpanTarget = () => {
    const updated = DataService.setTargetAir(targetInput);
    setAir({ ...updated });
  };

  const pct = Math.min((air.jumlah / air.target) * 100, 100);
  const fillHeight = pct;

  // Render gelas icon array
  const gelasIcons = Array.from({ length: air.target }, (_, i) => (
    <span
      key={i}
      className={'gelas-icon ' + (i < air.jumlah ? 'filled' : 'unfilled')}
      title={'Gelas ' + (i + 1)}
    >
      <i className="fa-solid fa-glass-water"></i>
    </span>
  ));

  const getStatusText = () => {
    if (air.jumlah >= air.target) return { text: '🎉 Target harian tercapai! Keren!', cls: 'air-status-text achieved' };
    const sisa = air.target - air.jumlah;
    return { text: `Ayo minum lagi! Masih kurang ${sisa} gelas.`, cls: 'air-status-text' };
  };

  const status = getStatusText();

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4 text-center">
        <h2 className="page-title"><i className="fa-solid fa-droplet me-2"></i>Tracker Air Minum</h2>
        <p className="page-subtitle">Jaga kecukupan cairan tubuhmu setiap hari</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="km-card p-5 text-center">

            {/* Water Glass Visual */}
            <div className="water-glass-wrap mx-auto mb-4">
              <div className="water-glass">
                <div
                  className="water-fill"
                  style={{ height: fillHeight + '%' }}
                ></div>
                <div className="water-glass-text">
                  <span>{air.jumlah}</span>/<span>{air.target}</span>
                  <div className="water-glass-sub">gelas</div>
                </div>
              </div>
            </div>

            {/* Ikon gelas */}
            <div className="gelas-icons-wrap mb-4">
              {gelasIcons}
            </div>

            <p className={status.cls}>{status.text}</p>

            <button
              className="btn-km-primary btn-lg-custom w-100 mb-4"
              onClick={tambah}
            >
              <i className="fa-solid fa-plus me-2"></i>+ 1 Gelas
            </button>

            {/* Target Setting */}
            <div className="km-card p-3 bg-ivory-soft">
              <label className="km-label mb-2">Target Harian (Gelas)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="km-input text-center"
                  value={targetInput}
                  min="1"
                  max="20"
                  onChange={e => setTargetInput(e.target.value)}
                />
                <button className="btn-km-outline" onClick={simpanTarget}>Simpan</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

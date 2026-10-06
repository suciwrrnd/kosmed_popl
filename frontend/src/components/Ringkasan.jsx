import React from 'react';
import DataService from '../services/DataService';

export default function Ringkasan() {
  const air = DataService.getAir();
  const makanan = DataService.getMakanan();
  const obat = DataService.getObat();
  const tidur = DataService.getTidur();
  const keluhan = DataService.getKeluhan();

  const mSehat = makanan.filter(m => m.kategori === 'sehat').length;
  const mCukup = makanan.filter(m => m.kategori === 'cukup_sehat').length;
  const mKurang = makanan.filter(m => m.kategori === 'kurang_sehat').length;

  const rataRataTidur = tidur.length > 0
    ? Math.round(tidur.reduce((acc, t) => acc + (t.durasi || 0), 0) / tidur.length * 10) / 10
    : 0;

  const airPct = Math.min(Math.round((air.jumlah / air.target) * 100), 100);

  const hitungSkor = () => {
    let skor = 70;
    if (air.jumlah >= air.target) skor += 10;
    if (rataRataTidur >= 7) skor += 10;
    if (mSehat > mKurang) skor += 10;
    return Math.min(skor, 100);
  };
  const skor = hitungSkor();
  const skorCls = skor >= 85 ? 'text-success' : skor >= 60 ? 'text-warning' : 'text-danger';

  return (
    <div className="tab-view animate-slide-up">
      <div className="page-header mb-4">
        <h2 className="page-title"><i className="fa-solid fa-chart-bar me-2"></i>Ringkasan Kesehatan</h2>
        <p className="page-subtitle">Rekap kondisi kesehatanmu minggu ini</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="km-card p-4 text-center">
            <h6 className="km-card-label mb-3">Skor Kesehatan</h6>
            <div style={{ fontSize: '4rem', fontWeight: '800' }} className={skorCls}>{skor}</div>
            <div className="km-stat-unit">/ 100</div>
            <div className="km-progress-wrap mt-3">
              <div className="km-progress">
                <div className="km-progress-bar" style={{ width: skor + '%', background: skor >= 85 ? 'var(--color-green)' : skor >= 60 ? '#e6a817' : 'var(--maroon)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row g-3 h-100">
            <div className="col-6">
              <div className="km-card p-3 h-100">
                <h6 className="km-card-label"><i className="fa-solid fa-droplet me-1 text-blue"></i>Air Minum</h6>
                <div className="km-stat-big">{air.jumlah}<span className="km-stat-sep">/</span>{air.target}</div>
                <div className="km-stat-unit">gelas — {airPct}%</div>
              </div>
            </div>
            <div className="col-6">
              <div className="km-card p-3 h-100">
                <h6 className="km-card-label"><i className="fa-solid fa-moon me-1 text-purple"></i>Rata-rata Tidur</h6>
                <div className="km-stat-big">{rataRataTidur}</div>
                <div className="km-stat-unit">jam / malam</div>
              </div>
            </div>
            <div className="col-6">
              <div className="km-card p-3 h-100">
                <h6 className="km-card-label"><i className="fa-solid fa-utensils me-1 text-green"></i>Pola Makan</h6>
                <div style={{ fontSize: '.85rem', marginTop: '8px' }}>
                  <div className="d-flex justify-content-between"><span>✅ Sehat</span><strong>{mSehat}x</strong></div>
                  <div className="d-flex justify-content-between"><span>⚠️ Cukup</span><strong>{mCukup}x</strong></div>
                  <div className="d-flex justify-content-between"><span>❌ Kurang</span><strong>{mKurang}x</strong></div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="km-card p-3 h-100">
                <h6 className="km-card-label"><i className="fa-solid fa-notes-medical me-1 text-maroon"></i>Keluhan</h6>
                <div className="km-stat-big">{keluhan.length}</div>
                <div className="km-stat-unit">catatan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="km-card p-4">
        <h5 className="fw-semibold text-maroon mb-3"><i className="fa-solid fa-lightbulb me-2"></i>Rekomendasi</h5>
        <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
          {air.jumlah < air.target && <li>Tambah konsumsi air minum, masih kurang <strong>{air.target - air.jumlah} gelas</strong> lagi.</li>}
          {rataRataTidur < 7 && rataRataTidur > 0 && <li>Tingkatkan durasi tidurmu, rata-rata masih <strong>{rataRataTidur} jam</strong> (disarankan 7-8 jam).</li>}
          {mKurang > mSehat && <li>Kurangi makanan tidak sehat, pilih lebih banyak sayuran dan buah-buahan.</li>}
          {obat.some(o => parseInt(o.stok) <= 1) && <li>Segera beli stok obat yang hampir habis!</li>}
          {air.jumlah >= air.target && rataRataTidur >= 7 && mSehat >= mKurang && <li className="text-success">Pertahankan! Pola hidupmu sudah sangat baik hari ini. 🎉</li>}
        </ul>
      </div>
    </div>
  );
}

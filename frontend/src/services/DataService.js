// ============================================================
// DataService - OOP Class untuk manajemen data lokal KosMed
// Design Pattern: Singleton + Service Layer
// ============================================================

const FOOD_DB = {
  kurang_sehat: {
    keywords: [
      'mie instan','mie goreng','mie rebus','mie ayam','indomie','supermi','sarimi','pop mie',
      'sedaap','ramen instan','cup noodle','nissin','gorengan','tahu goreng','tempe goreng',
      'pisang goreng','bakwan','cireng','cimol','batagor','siomay goreng','risol goreng',
      'burger','pizza','hot dog','kentang goreng','french fries','nugget','sosis','kfc',
      'mcdonald','mcdo','jollibee','fried chicken','keripik','chips','chiki','pringles',
      'cheetos','chitato','soda','softdrink','coca cola','pepsi','fanta','sprite','boba',
      'teh manis','es teh manis','donat','donut','cake','kue manis','permen','coklat batang',
      'snickers','kitkat','kornet','sarden kaleng','bacon','ham'
    ]
  },
  cukup_sehat: {
    keywords: [
      'nasi putih','nasi goreng','ayam goreng','soto','bakso','gado-gado','kwetiau','bihun',
      'lontong','ketupat','martabak','siomay','pempek','nasi uduk','nasi kuning','nasi padang',
      'rendang','gulai'
    ]
  },
  sehat: {
    keywords: [
      'salad','sayur','sayuran','bayam','brokoli','wortel','kangkung','sawi','tomat','timun',
      'kacang panjang','buncis','buah','apel','pisang','jeruk','mangga','anggur','melon',
      'semangka','pepaya','jambu','nanas','stroberi','alpukat','ikan bakar','ikan rebus',
      'ikan kukus','ayam rebus','ayam kukus','ayam panggang','dada ayam','telur rebus',
      'telur kukus','tahu kukus','tempe kukus','tempe bakar','tahu rebus','nasi merah',
      'oatmeal','granola','roti gandum','quinoa','jus buah','smoothie','yogurt',
      'susu rendah lemak','teh hijau','sup ayam','sup sayur','bubur ayam','pecel','urap'
    ]
  }
};

class DataService {
  constructor() {
    this.storageKey = 'kosmed_data';
    this._initData();
  }

  // ── Private: inisialisasi storage ──────────────────────
  _initData() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        obat: [],
        makanan: [],
        air: { jumlah: 0, target: 8 },
        reminder: [],
        keluhan: [],
        tidur: []
      }));
    }
  }

  _getData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  _saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  _genId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // ── Food Detection ─────────────────────────────────────
  detectFood(name) {
    const n = name.toLowerCase();
    for (const kw of FOOD_DB.kurang_sehat.keywords) if (n.includes(kw)) return { type: 'kurang_sehat', matched: kw };
    for (const kw of FOOD_DB.cukup_sehat.keywords)  if (n.includes(kw)) return { type: 'cukup_sehat', matched: kw };
    for (const kw of FOOD_DB.sehat.keywords)         if (n.includes(kw)) return { type: 'sehat', matched: kw };
    return { type: null, matched: '' };
  }

  // ── OBAT ───────────────────────────────────────────────
  getObat() { return this._getData().obat; }

  addObat(obat) {
    const data = this._getData();
    data.obat.push({ id: this._genId(), ...obat, stok: parseInt(obat.stok) || 0 });
    this._saveData(data);
  }

  updateStokObat(id, change) {
    const data = this._getData();
    const item = data.obat.find(o => o.id === id);
    if (item) {
      item.stok = Math.max(0, item.stok + change);
      this._saveData(data);
    }
  }

  deleteObat(id) {
    const data = this._getData();
    data.obat = data.obat.filter(o => o.id !== id);
    this._saveData(data);
  }

  // ── MAKANAN ────────────────────────────────────────────
  getMakanan() { return this._getData().makanan; }

  addMakanan(makanan) {
    const data = this._getData();
    data.makanan.push({
      id: this._genId(),
      tanggal: new Date().toLocaleDateString('id-ID'),
      ...makanan
    });
    this._saveData(data);
  }

  deleteMakanan(id) {
    const data = this._getData();
    data.makanan = data.makanan.filter(m => m.id !== id);
    this._saveData(data);
  }

  // ── AIR ────────────────────────────────────────────────
  getAir() { return this._getData().air; }

  tambahAir() {
    const data = this._getData();
    data.air.jumlah += 1;
    this._saveData(data);
    return data.air;
  }

  setTargetAir(target) {
    const data = this._getData();
    data.air.target = Math.max(1, parseInt(target) || 8);
    this._saveData(data);
    return data.air;
  }

  // ── REMINDER ───────────────────────────────────────────
  getReminder() { return this._getData().reminder; }

  addReminder(reminder) {
    const data = this._getData();
    data.reminder.push({ id: this._genId(), aktif: false, ...reminder });
    this._saveData(data);
  }

  toggleReminder(id) {
    const data = this._getData();
    const item = data.reminder.find(r => r.id === id);
    if (item) { item.aktif = !item.aktif; this._saveData(data); }
  }

  deleteReminder(id) {
    const data = this._getData();
    data.reminder = data.reminder.filter(r => r.id !== id);
    this._saveData(data);
  }

  // ── KELUHAN ────────────────────────────────────────────
  getKeluhan() { return this._getData().keluhan; }

  addKeluhan(keluhan) {
    const data = this._getData();
    data.keluhan.unshift({ id: this._genId(), ...keluhan });
    this._saveData(data);
  }

  deleteKeluhan(id) {
    const data = this._getData();
    data.keluhan = data.keluhan.filter(k => k.id !== id);
    this._saveData(data);
  }

  // ── TIDUR ──────────────────────────────────────────────
  getTidur() { return this._getData().tidur; }

  addTidur(tidur) {
    const data = this._getData();
    const durasi = this._hitungDurasiTidur(tidur.jam_tidur, tidur.jam_bangun);
    data.tidur.unshift({ id: this._genId(), durasi, ...tidur });
    this._saveData(data);
  }

  deleteTidur(id) {
    const data = this._getData();
    data.tidur = data.tidur.filter(t => t.id !== id);
    this._saveData(data);
  }

  _hitungDurasiTidur(jamTidur, jamBangun) {
    try {
      const [h1, m1] = jamTidur.split(':').map(Number);
      const [h2, m2] = jamBangun.split(':').map(Number);
      let t1 = h1 * 60 + m1;
      let t2 = h2 * 60 + m2;
      if (t2 < t1) t2 += 24 * 60; // melewati tengah malam
      return Math.round((t2 - t1) / 60 * 10) / 10;
    } catch (e) {
      return 0;
    }
  }

  // ── Statistik Helper ───────────────────────────────────
  getStatsRingkasan() {
    const air = this.getAir();
    const makanan = this.getMakanan();
    const obat = this.getObat();
    const tidur = this.getTidur();
    const keluhan = this.getKeluhan();

    const rataRataTidur = tidur.length > 0
      ? Math.round(tidur.slice(0, 7).reduce((a, t) => a + (t.durasi || 0), 0) / Math.min(tidur.length, 7) * 10) / 10
      : 0;

    const mSehat  = makanan.filter(m => m.kategori === 'sehat').length;
    const mCukup  = makanan.filter(m => m.kategori === 'cukup_sehat').length;
    const mKurang = makanan.filter(m => m.kategori === 'kurang_sehat').length;

    let skor = 60;
    if (air.jumlah >= air.target) skor += 15;
    else if (air.jumlah >= air.target / 2) skor += 7;
    if (rataRataTidur >= 7) skor += 15;
    else if (rataRataTidur >= 5) skor += 7;
    if (mSehat > 0 && mSehat >= mKurang) skor += 10;

    return {
      air, obat, makanan, tidur, keluhan,
      rataRataTidur, mSehat, mCukup, mKurang,
      skor: Math.min(100, skor)
    };
  }
}

// Singleton instance
export default new DataService();

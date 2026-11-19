-- Migrasi 2026-11-02: jurulatih.pakej_id mengikut ERD laporan (jurulatih bertugas bagi satu pakej sukan).
-- Selamat: hanya menambah lajur, indeks dan foreign key. Tiada data dipadam.
-- Jika pakej dipadam, pakej_id jurulatih menjadi NULL (rekod jurulatih kekal).
ALTER TABLE jurulatih
  ADD COLUMN pakej_id INT(11) NULL DEFAULT NULL AFTER kepakaran,
  ADD INDEX idx_jurulatih_pakej (pakej_id),
  ADD CONSTRAINT jurulatih_ibfk_pakej FOREIGN KEY (pakej_id) REFERENCES pakej_sukan (id)
      ON UPDATE CASCADE ON DELETE SET NULL;

# AthleteTrack — arahan projek

## Sebelum push
- Uji dahulu sebelum push: semak sintaks (`php -l` bagi setiap fail PHP yang diubah) dan cuba aliran yang terlibat dalam pelayar (XAMPP).
- Jangan push jika ujian gagal; nyatakan apa yang belum diuji.

## Rahsia dan data peribadi
- Jangan commit `.env`, `db.php`, `config-emel.php` atau mana-mana fail yang mengandungi kata laluan, App Password atau API key. Kemas kini fail `.example` sahaja (tanpa nilai sebenar).
- Jangan commit data peribadi atlet: `sql/data_*.sql`, dump pangkalan data penuh, atau kandungan `uploads/`.
- Semak `git status` dan `git diff --cached` sebelum setiap commit.

## E-mel
- `config-emel.php` mempunyai mod ujian (`'hanya_ke'`). Kekalkan semasa ujian supaya e-mel tidak dihantar kepada ibu bapa atau atlet sebenar.

## Gaya
- Teks antara muka dan mesej ralat dalam Bahasa Melayu; ikut ayat carta alir (cth. "Gagal kemaskini maklumat").
- Jangan ubah susunan fungsi atau aliran carta alir tanpa persetujuan.
- Tanya dahulu sebelum mengubah struktur pangkalan data; buat sandaran sebelum perubahan.

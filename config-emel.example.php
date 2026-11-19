<?php
// Salin fail ini kepada config-emel.php dan isi tetapan e-mel sebenar.
// config-emel.php TIDAK di-commit ke Git (lihat .gitignore).
// Gmail: hidupkan 2-Step Verification, kemudian cipta App Password (16 aksara).
// Selagi 'pengguna' kosong, sistem tidak menghantar e-mel.
return [
    'hos'         => 'smtp.gmail.com',
    'port'        => 465,          // 465 = SSL, 587 = STARTTLS
    'keselamatan' => 'ssl',        // 'ssl', 'tls' atau '' (tanpa penyulitan, untuk ujian sahaja)
    'pengguna'    => '',           // contoh: kelab@gmail.com
    'kata_laluan' => '',           // App Password Gmail (bukan kata laluan biasa)
    'nama_pengirim' => 'Kelab Olahraga Shah Alam',
    // MOD UJIAN: e-mel hanya dihantar ke alamat di bawah; alamat lain disekat.
    // Buang baris ini apabila sistem sedia untuk menghantar e-mel sebenar.
    'hanya_ke'    => ['alamat-ujian@contoh.com'],
];

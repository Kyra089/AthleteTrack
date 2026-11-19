# AthleteTrack

Sistem Pengurusan Kelab Olahraga Shah Alam. AthleteTrack menguruskan pendaftaran atlet, pembayaran yuran, kehadiran latihan dan prestasi atlet, dengan dua peranan pengguna: **Admin** dan **Atlet**.

## Ciri utama

- **Atlet:** daftar akaun dan pilih pakej sukan, terima invois, muat naik bukti pembayaran, semak sejarah pembayaran, kehadiran dan prestasi.
- **Admin:** urus atlet, pakej sukan dan jurulatih; sahkan bukti pembayaran; tanda kehadiran; rekod prestasi 4 acara; jana laporan kehadiran dan graf prestasi (PDF).
- **E-mel automatik:** invois bulanan, peringatan yuran setiap 5 haribulan, pengesahan/penolakan bayaran, lupa kata laluan.

## Tech stack

| Bahagian | Teknologi |
|---|---|
| Antara muka | HTML, CSS, JavaScript (satu halaman, `index.php`) |
| Pelayan | PHP 8 (API JSON dalam `api/`) |
| Pangkalan data | MySQL / MariaDB |
| E-mel | SMTP terus melalui PHP (tiada pustaka luar) |

Tiada Composer atau npm diperlukan.

## Struktur folder

```
api/                 API PHP (JSON)
database/            Struktur pangkalan data (athletetrack_db.sql)
fonts/               Fon tempatan (Barlow, Saira Condensed)
sql/                 Skrip migrasi pangkalan data
uploads/bukti/       Bukti pembayaran (tidak di-commit)
uploads/poster/      Poster pakej yang dimuat naik (tidak di-commit)
db.example.php       Templat sambungan pangkalan data
config-emel.example.php  Templat tetapan e-mel
index.php            Antara muka sistem
```

## Cara setup

### 1. Keperluan

- PHP 8.x dengan sambungan `pdo_mysql` dan `openssl`
- MySQL 5.7+ atau MariaDB 10.4+
- Apache (dengan `AllowOverride All` supaya `.htaccess` dalam `uploads/` berfungsi)

Contoh di Ubuntu:

```bash
sudo apt update
sudo apt install apache2 mariadb-server php libapache2-mod-php php-mysql
```

### 2. Dapatkan kod

```bash
git clone <URL-REPO> /var/www/fyp
cd /var/www/fyp
```

### 3. Import pangkalan data

```bash
sudo mysql -e "CREATE DATABASE athletetrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
sudo mysql -e "CREATE USER 'athletetrack'@'localhost' IDENTIFIED BY 'KATA_LALUAN_KUAT';"
sudo mysql -e "GRANT ALL PRIVILEGES ON athletetrack_db.* TO 'athletetrack'@'localhost';"
mysql -u athletetrack -p athletetrack_db < database/athletetrack_db.sql
```

Fail ini mengandungi struktur jadual dan 6 pakej sukan sahaja, tanpa data atlet.

### 4. Isi konfigurasi

```bash
cp db.example.php db.php
cp config-emel.example.php config-emel.php
```

- `db.php`: isi `$user` dan `$pass` pangkalan data.
- `config-emel.php`: isi akaun Gmail dan App Password. Kekalkan baris `'hanya_ke'` semasa ujian supaya e-mel hanya dihantar ke alamat ujian.

Kedua-dua fail ini **tidak di-commit** ke Git.

### 5. Cipta akaun admin pertama

Jana hash kata laluan, kemudian masukkan admin:

```bash
php -r 'echo password_hash("KataLaluanAdmin", PASSWORD_DEFAULT), PHP_EOL;'
```

```sql
INSERT INTO admin (nama, no_kp, tarikh_lahir, email, telefon, kata_laluan)
VALUES ('NAMA ADMIN', '900101-01-0001', '1990-01-01', 'admin@contoh.com', '012-0000000', '<HASH_DI_ATAS>');
```

### 6. Kebenaran folder muat naik

```bash
sudo chown -R www-data:www-data /var/www/fyp/uploads
```

Buka `http://<alamat-pelayan>/` (atau laluan yang ditetapkan dalam Apache) untuk mula menggunakan sistem.

## Deploy automatik

Setiap `push` ke cabang `main` menjalankan `.github/workflows/deploy.yml`:

1. Semak sintaks semua fail PHP (`php -l`).
2. SSH ke VPS dan jalankan `git pull` dalam `/var/www/fyp`.

Tetapkan secrets berikut dalam **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Isi |
|---|---|
| `VPS_HOST` | Alamat IP atau domain VPS |
| `VPS_USER` | Nama pengguna SSH |
| `VPS_SSH_KEY` | Kunci peribadi SSH (private key) |

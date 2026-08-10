// ========================================
// API DAFTAR TAMU
// ========================================

const GUEST_API =
  "https://script.google.com/macros/s/AKfycbxsoD7mXaD84o6aE6Cd5c4SHA3wXoTXFDmaB1-_KG9e8C72tb7yTjl1HiNELhV196vHOA/exec";

const API_URL = GUEST_API;

// ========================================
// TOKEN ADMIN
// ========================================

const ADMIN_TOKEN = sessionStorage.getItem("adminToken");

// ========================================
// CEK LOGIN AWAL
// ========================================

if (!ADMIN_TOKEN) {
  window.location.replace("admin-login.html");
}

// ========================================
// DATA TAMU
// ========================================

let semuaGuests = [];

let semuaRSVP = [];

let semuaUcapan = [];

// ========================================
// CEK RESPONSE AUTH
// ========================================

function cekAuth(result) {
  if (result && result.result === "unauthorized") {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");

    alert("Sesi login telah berakhir. Silakan login kembali.");

    window.location.replace("admin-login.html");

    return false;
  }

  return true;
}

// ========================================
// API GET
// ========================================

async function apiGet(action) {
  if (!ADMIN_TOKEN) {
    window.location.replace("admin-login.html");
    return null;
  }

  const url =
    GUEST_API +
    "?action=" +
    encodeURIComponent(action) +
    "&token=" +
    encodeURIComponent(ADMIN_TOKEN);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("HTTP Error " + response.status);
  }

  const result = await response.json();

  if (!cekAuth(result)) {
    return null;
  }

  return result;
}

// ========================================
// API POST
// ========================================

async function apiPost(data) {
  if (!ADMIN_TOKEN) {
    window.location.replace("admin-login.html");
    return null;
  }

  const response = await fetch(GUEST_API, {
    method: "POST",

    body: JSON.stringify({
      ...data,
      token: ADMIN_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error("HTTP Error " + response.status);
  }

  const result = await response.json();

  if (!cekAuth(result)) {
    return null;
  }

  return result;
}

// ========================================
// AMBIL DAFTAR TAMU
// ========================================

async function loadGuests() {
  try {
    const result = await apiGet("getGuests");

    if (result === null) {
      return;
    }

    // ========================================
    // SIMPAN DATA
    // ========================================

    semuaGuests = Array.isArray(result) ? result : [];

    // ========================================
    // TAMPILKAN DATA
    // ========================================

    tampilkanGuests(semuaGuests);

    // ========================================
    // UPDATE STATISTIK
    // ========================================

    updateStatistik(semuaGuests);
    updateStatistikDashboard();
  } catch (error) {
    console.error("Gagal mengambil daftar tamu:", error);

    const tbody = document.getElementById("guest-list");

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td
            colspan="5"
            class="text-center py-8 text-red-500"
          >
            Gagal mengambil data tamu.
          </td>
        </tr>
      `;
    }
  }
}

// ========================================
// TAMPILKAN DAFTAR TAMU
// ========================================

function tampilkanGuests(guests) {
  const tbody = document.getElementById("guest-list");

  if (!tbody) {
    console.error("Element #guest-list tidak ditemukan.");
    return;
  }

  tbody.innerHTML = "";

  // ========================================
  // TIDAK ADA TAMU
  // ========================================

  if (!guests || guests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center py-8 text-gray-500"
        >
          Tidak ada tamu ditemukan.
        </td>
      </tr>
    `;

    return;
  }

  // ========================================
  // TAMPILKAN TAMU
  // ========================================

  guests.forEach(function (guest, index) {
    const status = guest.status || "Belum Dikirim";

    let statusClass = "bg-gray-100 text-gray-600";

    if (status === "Sudah Dikirim") {
      statusClass = "bg-green-100 text-green-700";
    }

    tbody.innerHTML += `
      <tr class="border-b hover:bg-gray-50">

        <!-- NO -->

        <td class="px-4 py-4 text-sm">
          ${guest.no || index + 1}
        </td>

        <!-- NAMA -->

        <td class="px-4 py-4">
          <div class="font-semibold text-gray-800">
            ${escapeHTML(guest.nama)}
          </div>
        </td>

        <!-- LINK -->

        <td class="px-4 py-4">

          <div class="flex items-center gap-2">

            <button
              onclick="copyLink('${escapeAttribute(guest.link)}')"
              class="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs"
            >
              📋 Copy
            </button>

            <a
              href="${escapeAttribute(guest.link)}"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline text-xs"
            >
              Lihat
            </a>

          </div>

        </td>

        <!-- STATUS -->

        <td class="px-4 py-4">

          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}"
          >
            ${escapeHTML(status)}
          </span>

        </td>

        <!-- AKSI -->

        <td class="px-4 py-4">

          <div class="flex flex-wrap gap-2">

            <!-- EDIT -->

            <button
              onclick="editGuest(
                ${guest.row},
                '${escapeAttribute(guest.nama)}',
                '${escapeAttribute(guest.nomor)}'
              )"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
            >
              ✏️ Edit
            </button>

            <!-- WHATSAPP -->

            <button
              onclick="sendWhatsApp(
                '${escapeAttribute(guest.nama)}',
                '${escapeAttribute(guest.nomor)}',
                '${escapeAttribute(guest.link)}',
                ${guest.row}
              )"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
            >
              💬 WhatsApp
            </button>

            <!-- HAPUS -->

            <button
              onclick="deleteGuest(
                ${guest.row},
                '${escapeAttribute(guest.nama)}'
              )"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
            >
              🗑️ Hapus
            </button>

          </div>

        </td>

      </tr>
    `;
  });
}

// ========================================
// STATISTIK TAMU
// ========================================

function updateStatistik(guests) {
  const total = guests.length;

  const sudahDikirim = guests.filter(function (guest) {
    return guest.status === "Sudah Dikirim";
  }).length;

  const belumDikirim = total - sudahDikirim;

  // ========================================
  // SESUAI DENGAN ID DI ADMIN.HTML
  // ========================================

  const totalElement = document.getElementById("total-tamu");

  const sudahElement = document.getElementById("sudah-dikirim");

  const belumElement = document.getElementById("belum-dikirim");

  if (totalElement) {
    totalElement.textContent = total;
  }

  if (sudahElement) {
    sudahElement.textContent = sudahDikirim;
  }

  if (belumElement) {
    belumElement.textContent = belumDikirim;
  }
}

// ========================================
// PENCARIAN TAMU
// ========================================

function cariTamu() {
  const input = document.getElementById("searchTamu");

  if (!input) {
    return;
  }

  const keyword = input.value.trim().toLowerCase();

  const hasil = semuaGuests.filter(function (guest) {
    return String(guest.nama || "")
      .toLowerCase()
      .includes(keyword);
  });

  tampilkanGuests(hasil);
}

// ========================================
// COPY LINK
// ========================================

async function copyLink(link) {
  try {
    await navigator.clipboard.writeText(link);

    alert("Link undangan berhasil disalin!");
  } catch (error) {
    console.error(error);

    alert("Gagal menyalin link.");
  }
}

// ========================================
// WHATSAPP
// ========================================

async function sendWhatsApp(nama, nomorWA, link, row) {
  // ========================================
  // CEK NOMOR
  // ========================================

  if (!nomorWA) {
    alert("Nomor WhatsApp tamu belum tersedia.");

    return;
  }

  // ========================================
  // PESAN
  // ========================================

  const pesan = `Assalamu'alaikum ${nama},

Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dalam acara pernikahan kami.

Silakan membuka undangan melalui link berikut:

${link}

Merupakan suatu kehormatan bagi kami apabila Anda dapat hadir.

Terima kasih 🙏`;

  // ========================================
  // LINK WHATSAPP
  // ========================================

  const whatsappURL =
    "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(pesan);

  // ========================================
  // BUKA WHATSAPP
  // ========================================

  window.open(whatsappURL, "_blank");

  // ========================================
  // UPDATE STATUS
  // ========================================

  try {
    const result = await apiPost({
      type: "updateStatus",
      row: row,
    });

    if (result === null) {
      return;
    }

    if (result.result === "success") {
      console.log("Status berhasil diubah menjadi Sudah Dikirim.");

      setTimeout(function () {
        loadGuests();
      }, 500);
    } else {
      console.error("Gagal update status:", result);
    }
  } catch (error) {
    console.error("Error update status:", error);
  }
}

// ========================================
// TAMBAH TAMU
// ========================================

async function tambahTamu() {
  const inputNama = document.getElementById("namaTamu");

  const inputWA = document.getElementById("nomorWA");

  if (!inputNama || !inputWA) {
    console.error("Input nama atau nomor WhatsApp tidak ditemukan.");

    return;
  }

  const nama = inputNama.value.trim();

  const nomorWA = inputWA.value.trim();

  // ========================================
  // VALIDASI NAMA
  // ========================================

  if (!nama) {
    alert("Masukkan nama tamu terlebih dahulu.");

    inputNama.focus();

    return;
  }

  // ========================================
  // VALIDASI NOMOR
  // ========================================

  if (!nomorWA) {
    alert("Masukkan nomor WhatsApp terlebih dahulu.");

    inputWA.focus();

    return;
  }

  // ========================================
  // VALIDASI ANGKA
  // ========================================

  if (!/^[0-9]+$/.test(nomorWA)) {
    alert(
      "Nomor WhatsApp hanya boleh berisi angka.\n\n" +
        "Contoh:\n628525263452719"
    );

    inputWA.focus();

    return;
  }

  // ========================================
  // KIRIM KE APPS SCRIPT
  // ========================================

  try {
    const result = await apiPost({
      type: "addGuest",
      nama: nama,
      nomorWA: nomorWA,
    });

    if (result === null) {
      return;
    }

    console.log("Response Apps Script:", result);

    // ========================================
    // BERHASIL
    // ========================================

    if (result.result === "success") {
      alert("Tamu berhasil ditambahkan!");

      inputNama.value = "";
      inputWA.value = "";

      await loadGuests();
    }

    // ========================================
    // GAGAL
    // ========================================
    else {
      alert(result.message || "Gagal menambahkan tamu.");
    }
  } catch (error) {
    console.error("Error tambah tamu:", error);

    alert("Terjadi kesalahan saat menambahkan tamu.");
  }
}

// ========================================
// EDIT TAMU
// ========================================

async function editGuest(row, namaLama, nomorLama) {
  // ========================================
  // NAMA BARU
  // ========================================

  const namaBaru = prompt("Masukkan nama tamu:", namaLama);

  if (namaBaru === null) {
    return;
  }

  const nama = namaBaru.trim();

  if (!nama) {
    alert("Nama tamu tidak boleh kosong.");

    return;
  }

  // ========================================
  // NOMOR BARU
  // ========================================

  const nomorBaru = prompt("Masukkan nomor WhatsApp:", nomorLama);

  if (nomorBaru === null) {
    return;
  }

  const nomorWA = nomorBaru.trim();

  if (!nomorWA) {
    alert("Nomor WhatsApp tidak boleh kosong.");

    return;
  }

  // ========================================
  // VALIDASI NOMOR
  // ========================================

  if (!/^[0-9]+$/.test(nomorWA)) {
    alert(
      "Nomor WhatsApp hanya boleh berisi angka.\n\n" +
        "Contoh:\n628525263452719"
    );

    return;
  }

  // ========================================
  // KONFIRMASI
  // ========================================

  const yakin = confirm(
    "Simpan perubahan?\n\n" + "Nama: " + nama + "\n" + "WhatsApp: " + nomorWA
  );

  if (!yakin) {
    return;
  }

  // ========================================
  // UPDATE
  // ========================================

  try {
    const result = await apiPost({
      type: "updateGuest",
      row: row,
      nama: nama,
      nomorWA: nomorWA,
    });

    if (result === null) {
      return;
    }

    console.log("Response update tamu:", result);

    if (result.result === "success") {
      alert("Data tamu berhasil diperbarui!");

      await loadGuests();
    } else {
      alert(result.message || "Gagal memperbarui data tamu.");
    }
  } catch (error) {
    console.error("Error edit tamu:", error);

    alert("Terjadi kesalahan saat memperbarui tamu.");
  }
}

// ========================================
// HAPUS TAMU
// ========================================

async function deleteGuest(row, nama) {
  const yakin = confirm(
    "Apakah Anda yakin ingin menghapus tamu ini?\n\n" +
      "Nama: " +
      nama +
      "\n\n" +
      "Data yang dihapus tidak dapat dikembalikan."
  );

  if (!yakin) {
    return;
  }

  try {
    const result = await apiPost({
      type: "deleteGuest",
      row: row,
    });

    if (result === null) {
      return;
    }

    console.log("Response hapus tamu:", result);

    if (result.result === "success") {
      alert("Tamu berhasil dihapus.");

      await loadGuests();
    } else {
      alert(result.message || "Gagal menghapus tamu.");
    }
  } catch (error) {
    console.error("Error hapus tamu:", error);

    alert("Terjadi kesalahan saat menghapus tamu.");
  }
}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================
// ESCAPE ATTRIBUTE
// ========================================

function escapeAttribute(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

// ========================================
// EVENT HALAMAN
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // LOAD DATA
  // ========================================

  loadGuests();
  loadRSVP();
  loadUcapan();

  const btnLogout = document.getElementById("btnLogout");

  if (btnLogout) {
    btnLogout.addEventListener("click", logoutAdmin);
  }

  // ========================================
  // TOMBOL TAMBAH
  // ========================================

  const tombolTambah = document.getElementById("btnTambahTamu");

  if (tombolTambah) {
    tombolTambah.addEventListener("click", tambahTamu);
  } else {
    console.error("Tombol #btnTambahTamu tidak ditemukan.");
  }

  // ========================================
  // SEARCH
  // ========================================

  const searchInput = document.getElementById("searchTamu");

  if (searchInput) {
    searchInput.addEventListener("input", cariTamu);
  }
});

// ========================================
// LOGOUT
// ========================================

async function logoutAdmin() {
  const yakin = confirm("Apakah Anda yakin ingin logout?");

  if (!yakin) {
    return;
  }

  try {
    await apiPost({
      type: "logoutAdmin",
    });
  } catch (error) {
    console.error("Error logout:", error);
  }

  // ========================================
  // HAPUS SESSION
  // ========================================

  sessionStorage.removeItem("adminToken");

  sessionStorage.removeItem("adminUsername");

  // ========================================
  // KEMBALI LOGIN
  // ========================================

  window.location.replace("admin-login.html");
}
// ========================================
// LOAD DATA RSVP
// ========================================

async function loadRSVP() {
  try {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      console.log("Token admin tidak ditemukan.");

      return;
    }

    const response = await fetch(
      `${API_URL}?action=getRSVP&token=${encodeURIComponent(token)}`
    );

    const result = await response.json();

    console.log("Data RSVP:", result);

    if (result.result !== "success") {
      console.error("Gagal mengambil data RSVP:", result.message);

      return;
    }

    // ========================================
    // SIMPAN DATA RSVP
    // ========================================

    semuaRSVP = Array.isArray(result.data) ? result.data : [];

    // ========================================
    // TAMPILKAN RSVP
    // ========================================

    tampilkanRSVP(semuaRSVP);

    // ========================================
    // UPDATE DASHBOARD
    // ========================================

    updateStatistikDashboard();
  } catch (error) {
    console.error("Error load RSVP:", error);
  }
}

// ========================================
// LOAD DATA UCAPAN
// ========================================

async function loadUcapan() {
  try {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      console.log("Token admin tidak ditemukan.");

      return;
    }

    const response = await fetch(
      `${GUEST_API}?action=getUcapan&token=${encodeURIComponent(token)}`
    );

    const result = await response.json();

    console.log("Data Ucapan:", result);

    if (result.result !== "success") {
      console.error("Gagal mengambil data ucapan:", result.message);

      return;
    }

    // ========================================
    // SIMPAN DATA UCAPAN
    // ========================================

    semuaUcapan = Array.isArray(result.data) ? result.data : [];

    // ========================================
    // TAMPILKAN UCAPAN
    // ========================================

    tampilkanUcapan(semuaUcapan);

    // ========================================
    // UPDATE DASHBOARD
    // ========================================

    updateStatistikDashboard();
  } catch (error) {
    console.error("Error load Ucapan:", error);
  }
}

// ========================================
// STATISTIK DASHBOARD
// ========================================

function updateStatistikDashboard() {
  // ========================================
  // TOTAL TAMU
  // ========================================

  const totalTamu = semuaGuests.length;

  // ========================================
  // SUDAH DIKIRIM
  // ========================================

  const sudahDikirim = semuaGuests.filter(function (guest) {
    return guest.status === "Sudah Dikirim";
  }).length;

  // ========================================
  // BELUM DIKIRIM
  // ========================================

  const belumDikirim = totalTamu - sudahDikirim;

  // ========================================
  // TOTAL RSVP
  // ========================================

  const totalRSVP = semuaRSVP.length;

  // ========================================
  // TOTAL HADIR
  // ========================================

  let totalHadir = 0;

  // ========================================
  // TOTAL TIDAK HADIR
  // ========================================

  let totalTidakHadir = 0;

  semuaRSVP.forEach(function (item) {
    const status = String(item.kehadiran || "")
      .trim()
      .toLowerCase();

    const jumlah = Number(item.jumlah) || 0;

    if (status === "hadir") {
      totalHadir += jumlah;
    }

    if (status === "tidak hadir") {
      totalTidakHadir += jumlah;
    }
  });

  // ========================================
  // TOTAL UCAPAN
  // ========================================

  const totalUcapan = semuaUcapan.length;

  // ========================================
  // ELEMENT HTML
  // ========================================

  const totalTamuElement = document.getElementById("total-tamu");

  const sudahDikirimElement = document.getElementById("sudah-dikirim");

  const belumDikirimElement = document.getElementById("belum-dikirim");

  const totalRSVPElement = document.getElementById("total-rsvp");

  const totalHadirElement = document.getElementById("total-hadir");

  const totalTidakHadirElement = document.getElementById("total-tidak-hadir");

  const totalUcapanElement = document.getElementById("total-ucapan");

  // ========================================
  // TAMPILKAN
  // ========================================

  if (totalTamuElement) {
    totalTamuElement.textContent = totalTamu;
  }

  if (sudahDikirimElement) {
    sudahDikirimElement.textContent = sudahDikirim;
  }

  if (belumDikirimElement) {
    belumDikirimElement.textContent = belumDikirim;
  }

  if (totalRSVPElement) {
    totalRSVPElement.textContent = totalRSVP;
  }

  if (totalHadirElement) {
    totalHadirElement.textContent = totalHadir + " orang";
  }

  if (totalTidakHadirElement) {
    totalTidakHadirElement.textContent = totalTidakHadir + " orang";
  }

  if (totalUcapanElement) {
    totalUcapanElement.textContent = totalUcapan;
  }
}

// ========================================
// TAMPILKAN RSVP
// ========================================

function tampilkanRSVP(data) {
  const container = document.getElementById("rsvpList");

  if (!container) {
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
          <div class="text-center text-gray-400 py-8">
              Belum ada data RSVP.
          </div>
      `;

    return;
  }

  container.innerHTML = data
    .map(function (item, index) {
      return `
              <div class="border-b border-gray-100 py-4">

                  <div class="flex justify-between items-start gap-3">

                      <div>

                          <div class="font-semibold text-gray-800">
                              ${escapeHTML(item.nama)}
                          </div>

                          <div class="text-sm text-gray-500 mt-1">
                              ${escapeHTML(item.kehadiran)}
                          </div>

                      </div>

                      <div class="text-sm font-semibold text-gray-600">
                          ${item.jumlah} orang
                      </div>

                  </div>

                  <div class="text-xs text-gray-400 mt-2">
                      ${formatTanggal(item.waktu)}
                  </div>

              </div>
          `;
    })
    .join("");
}

// ========================================
// TAMPILKAN UCAPAN
// ========================================

function tampilkanUcapan(data) {
  const container = document.getElementById("ucapanList");

  if (!container) {
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
          <div class="text-center text-gray-400 py-8">
              Belum ada ucapan.
          </div>
      `;

    return;
  }

  container.innerHTML = data
    .map(function (item) {
      return `
              <div class="border-b border-gray-100 py-4">

                  <div class="font-semibold text-gray-800">
                      ${escapeHTML(item.nama)}
                  </div>

                  <div class="text-sm text-gray-600 mt-2 leading-relaxed">
                      ${escapeHTML(item.ucapan)}
                  </div>

                  <div class="text-xs text-gray-400 mt-2">
                      ${formatTanggal(item.waktu)}
                  </div>

              </div>
          `;
    })
    .join("");
}

// ========================================
// FORMAT TANGGAL
// ========================================

function formatTanggal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

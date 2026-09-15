// ==========================================
// AOS ANIMATION
// ==========================================
AOS.init({
  duration: 1000,
  once: false,
  mirror: false,
  easing: "ease-out-cubic",
  offset: 0,
});

// ==========================================
// OPEN INVITATION
// ==========================================
function openInvitation() {
  const cover = document.getElementById("intro-cover");

  if (!cover) return;

  // ==============================
  // 1. Putar musik
  // ==============================
  const bgMusic = document.getElementById("bg-music");

  if (bgMusic) {
    bgMusic.play().catch((error) => {
      console.log("Audio playback prevented:", error);
    });
  }

  // ==============================
  // 2. Persiapkan animasi cover
  // ==============================
  cover.style.transition =
    "transform 2s cubic-bezier(0.77, 0, 0.18, 1), opacity 1.5s ease";

  // Sedikit zoom sebelum keluar
  cover.style.transform = "scale(1.05) translateY(-100%)";

  // Fade out
  cover.style.opacity = "0";

  // ==============================
  // 3. Aktifkan scroll halaman
  // ==============================
  document.body.classList.remove("overflow-hidden");
  document.body.classList.add("overflow-x-hidden");

  // ==============================
  // 4. Hilangkan cover
  // ==============================
  setTimeout(() => {
    cover.style.display = "none";

    // Refresh AOS setelah cover benar-benar hilang
    if (typeof AOS !== "undefined") {
      AOS.refreshHard();

      setTimeout(() => {
        AOS.refreshHard();
      }, 300);
    }

    // Scroll indicator
    const scrollIndicator = document.getElementById("scroll-indicator");

    if (scrollIndicator) {
      scrollIndicator.classList.remove("opacity-0");
    }
  }, 2200);
}

// ==========================================
// MUSIC CONTROL
// ==========================================
function toggleMusic() {
  const bgMusic = document.getElementById("bg-music");

  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play().catch((error) => {
      console.log("Music gagal diputar:", error);
    });
  } else {
    bgMusic.pause();
  }
}

/* =========================================================
   AYAT MUNCUL SATU PER SATU
   CEPAT + HALUS
   MENGGUNAKAN TAILWIND CSS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const quote = document.getElementById("quote-text");
  const source = document.getElementById("quote-source");

  if (!quote || !source) return;

  // Simpan teks asli
  const text = quote.textContent.trim();

  // Pecah menjadi kata
  const words = text.split(/\s+/);

  // Kosongkan paragraf
  quote.innerHTML = "";

  // =====================================================
  // BUAT SETIAP KATA MENJADI SPAN
  // =====================================================

  words.forEach((word, index) => {
    const span = document.createElement("span");

    span.textContent = word;

    span.className = `
        inline-block
        opacity-0
        translate-x-3
        blur-[1px]
        transition-all
        duration-300
        ease-out
      `;

    quote.appendChild(span);

    // Tambahkan spasi
    if (index < words.length - 1) {
      quote.appendChild(document.createTextNode(" "));
    }
  });

  // Ambil semua kata
  const wordElements = quote.querySelectorAll("span");

  // =====================================================
  // MULAI ANIMASI SAAT SECTION TERLIHAT
  // =====================================================

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // =================================================
        // KATA MUNCUL CEPAT SATU PER SATU
        // =================================================

        wordElements.forEach((word, index) => {
          setTimeout(() => {
            word.classList.remove("opacity-0", "translate-x-3", "blur-[1px]");

            word.classList.add("opacity-100", "translate-x-0", "blur-0");
          }, 300 + index * 55);
        });

        // =================================================
        // SETELAH SEMUA KATA SELESAI
        // MUNCULKAN QS. AR-RUM
        // =================================================

        const totalTime = 300 + wordElements.length * 55 + 500;

        setTimeout(() => {
          source.classList.remove("opacity-0", "translate-y-2");

          source.classList.add("opacity-100", "translate-y-0");
        }, totalTime);

        // Jalankan hanya satu kali
        observer.disconnect();
      });
    },

    {
      threshold: 0.3,
    }
  );

  observer.observe(quote);
});

// Script to handle Modal Interactions
function openGiftModal() {
  const modal = document.getElementById("gift-modal");
  const content = document.getElementById("gift-modal-content");

  // Allow display block first
  modal.classList.remove("invisible");

  // Small delay for CSS animation to trigger properly
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    content.classList.remove("scale-95");
  }, 10);

  // Prevent body scroll (optional)
  document.body.style.overflow = "hidden";
}

function closeGiftModal() {
  const modal = document.getElementById("gift-modal");
  const content = document.getElementById("gift-modal-content");

  // Start fading out
  modal.classList.add("opacity-0");
  content.classList.add("scale-95");

  // Wait for transition to finish then hide via invisible
  setTimeout(() => {
    modal.classList.add("invisible");
  }, 300);

  // Restore body scroll
  document.body.style.overflow = "";
}

// Countdown Timer Logic
document.addEventListener("DOMContentLoaded", function () {
  const countdownContainer = document.getElementById("countdown-container");
  if (!countdownContainer) return;

  // Get Target Date from custom data attribute
  let targetDateStr = countdownContainer.getAttribute("data-target-date");
  if (!targetDateStr) return;

  // Pastikan zona waktu secara default mengacu pada Waktu Indonesia Barat (WIB / UTC+7)
  // Jika format input string belum menyebutkan timezone standar (Z atau +/- offset), suntik secara otomatis.
  if (
    !targetDateStr.includes("+") &&
    !targetDateStr.includes("-") &&
    !targetDateStr.includes("Z")
  ) {
    targetDateStr += "+07:00";
  }

  const targetDate = new Date(targetDateStr).getTime();

  // Get Elements
  const elDays = document.getElementById("countdown-days");
  const elHours = document.getElementById("countdown-hours");
  const elMinutes = document.getElementById("countdown-minutes");
  const elSeconds = document.getElementById("countdown-seconds");

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  // Update the counter every 1 second
  const countdownTarget = setInterval(function () {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Time calculations
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result
      elDays.innerText = days;
      elHours.innerText = hours;
      elMinutes.innerText = minutes;
      elSeconds.innerText = seconds;
    } else {
      // If the countdown is finished
      clearInterval(countdownTarget);
      elDays.innerText = "0";
      elHours.innerText = "0";
      elMinutes.innerText = "0";
      elSeconds.innerText = "0";
    }
  }, 1000);
});

// ==========================================
// RSVP
// ==========================================

let rsvpSending = false;

async function submitRSVP(event) {
  event.preventDefault();

  // Cegah klik / submit berkali-kali
  if (rsvpSending) return;

  const form = document.getElementById("form-rsvp");

  const nama = document.getElementById("rsvp-nama").value.trim();
  const kehadiran = document.getElementById("rsvp-kehadiran").value;
  const jumlah = document.getElementById("rsvp-jumlah").value;

  // Validasi
  if (!nama || !kehadiran || !jumlah) {
    alert("Mohon lengkapi data RSVP terlebih dahulu.");
    return;
  }

  // ==========================================
  // KONFIRMASI
  // ==========================================

  const yakin = confirm(
    `Konfirmasi RSVP\n\n` +
      `Nama: ${nama}\n` +
      `Kehadiran: ${kehadiran}\n` +
      `Jumlah tamu: ${jumlah}\n\n` +
      `Apakah data ini sudah benar?`
  );

  // Jika klik Cancel
  if (!yakin) {
    return;
  }

  // ==========================================
  // KUNCI TOMBOL
  // ==========================================

  rsvpSending = true;

  const button = form.querySelector('button[type="submit"]');

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.innerText;
    button.innerText = "⏳ Mengirim...";
    button.classList.add("opacity-60", "cursor-not-allowed");
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzeFVt6Grkreix9TXYZbKUNdH1moWUN5KG9pgNO340HZara0gPseJVM6Ax7QD7Cq9T9qw/exec",
      {
        method: "POST",
        body: JSON.stringify({
          nama,
          kehadiran,
          jumlah,
        }),
      }
    );

    const result = await response.json();

    if (result.result === "success") {
      alert("✅ RSVP berhasil dikirim!");

      form.reset();
    } else {
      alert("❌ Gagal mengirim RSVP.");
    }
  } catch (err) {
    console.error("RSVP Error:", err);
    alert("❌ Terjadi kesalahan saat mengirim RSVP.");
  } finally {
    // Buka kembali tombol jika gagal
    rsvpSending = false;

    if (button) {
      button.disabled = false;
      button.innerText = button.dataset.originalText || "Kirim Reservasi";
      button.classList.remove("opacity-60", "cursor-not-allowed");
    }
  }
}
// ==========================================
// WISHES / UCAPAN
// ==========================================

let wishSending = false;

async function submitWish(event) {
  event.preventDefault();

  // Cegah klik berkali-kali
  if (wishSending) return;

  const form = document.getElementById("form-wishes");

  const nama = document.getElementById("wish-nama").value.trim();
  const ucapan = document.getElementById("wish-ucapan").value.trim();

  // ==========================================
  // VALIDASI
  // ==========================================

  if (!nama || !ucapan) {
    alert("Mohon isi nama dan ucapan terlebih dahulu.");
    return;
  }

  // ==========================================
  // KONFIRMASI
  // ==========================================

  const yakin = confirm(
    `Konfirmasi Ucapan\n\n` +
      `Nama: ${nama}\n\n` +
      `Ucapan:\n"${ucapan}"\n\n` +
      `Apakah Anda yakin ingin mengirim ucapan ini?`
  );

  // Jika klik Cancel
  if (!yakin) {
    return;
  }

  // ==========================================
  // KUNCI TOMBOL
  // ==========================================

  wishSending = true;

  const button = form.querySelector('button[type="submit"]');

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.innerText;
    button.innerText = "⏳ Mengirim...";
    button.classList.add("opacity-60", "cursor-not-allowed");
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzQzQU-dy79qsnbY0OUTMghVv9xmBKbQyx-LU1Zu6Srhkv21pCpTRHioTREPiK3x2la/exec",
      {
        method: "POST",
        body: JSON.stringify({
          type: "wish",
          nama: nama,
          ucapan: ucapan,
        }),
      }
    );

    const result = await response.json();

    if (result.result === "success") {
      alert("💌 Ucapan berhasil dikirim!");

      // Kosongkan form
      form.reset();

      // Ambil data terbaru
      await fetchWishes();
    } else {
      alert("❌ Gagal mengirim ucapan.");
    }
  } catch (err) {
    console.error("Wish Error:", err);
    alert("❌ Terjadi kesalahan saat mengirim ucapan.");
  } finally {
    // Buka kembali tombol
    wishSending = false;

    if (button) {
      button.disabled = false;
      button.innerText = button.dataset.originalText || "Kirim Ucapan";
      button.classList.remove("opacity-60", "cursor-not-allowed");
    }
  }
}
// Fungsi Ambil & Tampilkan Data Ucapan
// Ambil data ucapan dari Google Sheets
async function fetchWishes() {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbzQzQU-dy79qsnbY0OUTMghVv9xmBKbQyx-LU1Zu6Srhkv21pCpTRHioTREPiK3x2la/exec?action=getWishes"
  );

  const data = await response.json();

  const container = document.getElementById("wishes-container");

  container.innerHTML = "";

  document.getElementById("wishes-count").innerHTML = data.length + " Comments";

  data.reverse().forEach((item) => {
    const tanggal = new Date(item.waktu);

    const waktu = tanggal.toLocaleString("id-ID");

    const huruf = item.nama.charAt(0).toUpperCase();

    container.innerHTML += `
    <div class="py-5 border-b border-[#DDD2C5] flex gap-3">

        <!-- Avatar -->
        <div class="w-9 h-9 rounded-full bg-[#8E8271] text-white flex justify-center items-center font-bold shrink-0">
            ${huruf}
        </div>

        <!-- Comment Content -->
        <div class="flex-1">

            <!-- Nama -->
            <h4 class="font-bold text-[#302821]">
                ${item.nama}
            </h4>

            <!-- Waktu -->
            <small class="text-[#8E8271]">
                ${waktu}
            </small>

            <!-- Ucapan -->
            <p class="mt-2 text-[#4A4A4A]">
                ${item.ucapan}
            </p>

        </div>

    </div>
`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Tangkap parameter dari URL untuk Nama Tamu
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to");

  if (guestParam) {
    const decodedName = guestParam.replace(/\+/g, " "); // Decode special chars (if any) and replace plus with space

    const elIntro = document.getElementById("guest-name-intro");
    if (elIntro) elIntro.innerText = decodedName;

    const elHero = document.getElementById("guest-name-hero");
    if (elHero) elHero.innerText = decodedName;
  }

  // 2. Logic Form RSVP & Wishes
  const formRSVP = document.getElementById("form-rsvp");
  if (formRSVP) formRSVP.addEventListener("submit", submitRSVP);

  const formWishes = document.getElementById("form-wishes");
  if (formWishes) formWishes.addEventListener("submit", submitWish);

  fetchWishes();
});

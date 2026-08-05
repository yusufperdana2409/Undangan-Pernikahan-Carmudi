// AOS Initialization
AOS.init({
  duration: 1000,
  once: false,
  mirror: true,
});

// Script to Handle Opening Invitation
function openInvitation() {
  const cover = document.getElementById("intro-cover");
  if (!cover) return;

  // Putar musik latar terlebih dahulu
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.play().catch((e) => console.error("Audio playback prevented:", e));
  }

  // Jeda 2 detik sebelum memicu animasi slide up
  setTimeout(() => {
    // Execute slide up animation securely by manipulating inline styles
    cover.style.transform = "translateY(-100%)";

    // Allow page scroll again
    document.body.classList.remove("overflow-hidden");
    document.body.classList.add("overflow-x-hidden");

    // Hide element from DOM permanently after animation completes
    setTimeout(() => {
      cover.style.display = "none";

      // Refresh AOS to trigger animations securely on the home section content
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, 3000);
  }, 1000); // Jeda 1.5 detik (sesuaikan antara 1000ms - 5000ms jika perlu)
}

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

// Fungsi Kirim Data RSVP
// =========================
async function submitRSVP(event) {
  event.preventDefault();

  const nama = document.getElementById("rsvp-nama").value;
  const kehadiran = document.getElementById("rsvp-kehadiran").value;
  const jumlah = document.getElementById("rsvp-jumlah").value;

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
      alert("RSVP berhasil dikirim!");
      document.getElementById("form-rsvp").reset();
    } else {
      alert("Gagal mengirim RSVP.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan.");
  }
}
// Fungsi Kirim Data Ucapan
// Fungsi Kirim Data Ucapan ke Google Sheets
async function submitWish(event) {
  event.preventDefault();

  const nama = document.getElementById("wish-nama").value;
  const ucapan = document.getElementById("wish-ucapan").value;

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
      alert("Ucapan berhasil dikirim!");
      document.getElementById("form-wishes").reset();

      fetchWishes();
    } else {
      alert("Gagal mengirim ucapan.");
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan.");
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
        <div class="py-5 border-b border-gray-100 flex gap-3">

            <div class="w-9 h-9 rounded-full bg-[#8E8271] text-white flex justify-center items-center font-bold">
                ${huruf}
            </div>

            <div class="flex-1">

                <h4 class="font-bold">${item.nama}</h4>

                <small class="text-gray-500">${waktu}</small>

                <p class="mt-2 text-gray-700">${item.ucapan}</p>

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

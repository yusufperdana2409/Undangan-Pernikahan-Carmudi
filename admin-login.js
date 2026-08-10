// ========================================
// API ADMIN
// ========================================

const ADMIN_API =
  "https://script.google.com/macros/s/AKfycbxsoD7mXaD84o6aE6Cd5c4SHA3wXoTXFDmaB1-_KG9e8C72tb7yTjl1HiNELhV196vHOA/exec";

// ========================================
// FORM LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // ========================================
    // AMBIL INPUT
    // ========================================

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value;

    const error = document.getElementById("loginError");

    // ========================================
    // VALIDASI
    // ========================================

    if (!username || !password) {
      error.textContent = "Username dan password wajib diisi.";

      error.classList.remove("hidden");

      return;
    }

    // ========================================
    // TAMPILKAN LOADING
    // ========================================

    const button = loginForm.querySelector("button");

    button.disabled = true;

    button.textContent = "⏳ Memeriksa...";

    error.classList.add("hidden");

    // ========================================
    // KIRIM KE APPS SCRIPT
    // ========================================

    try {
      const response = await fetch(ADMIN_API, {
        method: "POST",

        body: JSON.stringify({
          type: "loginAdmin",

          username: username,

          password: password,
        }),
      });

      const result = await response.json();

      console.log("Response login:", result);

      // ========================================
      // LOGIN BERHASIL
      // ========================================

      if (result.result === "success") {
        sessionStorage.setItem("adminLogin", "true");

        window.location.href = "admin.html";

        return;
      }

      // ========================================
      // LOGIN GAGAL
      // ========================================

      error.textContent = result.message || "Username atau password salah.";

      error.classList.remove("hidden");

      document.getElementById("password").value = "";

      document.getElementById("password").focus();
    } catch (errorCatch) {
      console.error("Error login:", errorCatch);

      error.textContent = "Tidak dapat terhubung ke server.";

      error.classList.remove("hidden");
    } finally {
      button.disabled = false;

      button.textContent = "🔐 Login";
    }
  });
}

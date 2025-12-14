// js/login.js
import { supabase } from "./supabaseClient.js";

async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Please enter both email and password");
    console.log("Missing email or password", { email, password });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Login response:", data, error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Something went wrong");
  }
}

window.loginUser = loginUser;

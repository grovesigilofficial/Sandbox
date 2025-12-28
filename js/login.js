// js/login.js
import { supabase } from "./supabaseClient.js";

async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // redirect AFTER successful login
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Login failed");
  }
}

window.loginUser = loginUser;

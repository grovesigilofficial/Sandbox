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

    // If Supabase returns an error
    if (error) {
      // If user exists but hasn't confirmed email yet
      if (error.message.includes("email not confirmed")) {
        alert("Please check your email to confirm your account before logging in.");
        return;
      }
      // Any other error
      throw error;
    }

    // If login successful
    alert(`Login successful! Welcome back, ${data.user.user_metadata?.full_name || "User"}!`);
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("Login error:", err);
    // Friendly message for all failed attempts
    alert("Login failed. If you just signed up, please check your email to confirm your account.");
  }
}

window.loginUser = loginUser;

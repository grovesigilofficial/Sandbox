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
    // Sign in with email/password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Fetch the full profile for dashboard display
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    alert(
      `Login successful! Welcome back, ${profileData.full_name || profileData.username || "user"} ✅`
    );

    // Redirect to dashboard after login
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    alert(
      err.message || "Login failed. Make sure your email is confirmed."
    );
  }
}

window.loginUser = loginUser;

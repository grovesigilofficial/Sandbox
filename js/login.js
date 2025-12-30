import { supabase } from "./supabaseClient.js";

export async function loginUser() {
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

    // Fetch user profile
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", data.user.id)
      .single();
    if (profileError) throw profileError;

    if (!data.user.confirmed_at) {
      alert("Check your email to confirm your account before logging in.");
      return;
    }

    alert(`Welcome back ${profiles.full_name || "User"}!`);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message || "Login failed");
  }
}

window.loginUser = loginUser;

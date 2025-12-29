// js/dashboard.js
import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const joinedEl = document.getElementById("joined");

  try {
    // Check if user is logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (!session) {
      // No session: redirect to login
      window.location.href = "login.html";
      return;
    }

    const userId = session.user.id;

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Populate dashboard
    usernameEl.textContent = profile.username || "Unknown";
    emailEl.textContent = profile.email || session.user.email || "Unknown";
    joinedEl.textContent = profile.created_at 
      ? new Date(profile.created_at).toLocaleDateString() 
      : "Unknown";

  } catch (err) {
    console.error("Dashboard error:", err);
    alert(err.message || "Error loading dashboard");
  }

  // Log out button
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else window.location.href = "login.html";
  });
});

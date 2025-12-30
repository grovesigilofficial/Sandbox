// js/dashboard.js
import { supabase } from "./supabaseClient.js";

async function loadDashboard() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("username").textContent = user.user_metadata?.full_name || "Unknown";
  document.getElementById("email").textContent = user.email;
  document.getElementById("joined").textContent = "Joined: " + new Date(user.created_at).toLocaleDateString();
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

window.logout = logout;
loadDashboard();

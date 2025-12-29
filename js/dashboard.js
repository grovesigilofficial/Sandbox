// /js/dashboard.js
import { supabase } from "./supabaseClient.js";

async function loadDashboard() {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const user = session.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", user.id)
    .single();

  document.getElementById("username").textContent =
    profile?.username || "User";

  document.getElementById("email").textContent = user.email;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

window.logout = logout;
loadDashboard();

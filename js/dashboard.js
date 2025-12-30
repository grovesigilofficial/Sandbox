// js/dashboard.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

async function loadDashboard() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    console.error("Error loading profile:", error);
    return;
  }

  document.getElementById("username").textContent =
    profile.username || profile.full_name || "Unknown";
  document.getElementById("email").textContent = profile.email;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

async function deleteProfile() {
  if (!confirm("Are you sure you want to delete your profile?")) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.auth.signOut();
  window.location.href = "index.html";
}

window.logout = logout;
window.deleteProfile = deleteProfile;

loadDashboard();

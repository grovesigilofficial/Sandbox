// js/dashboard.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// Load user profile safely
async function loadDashboard() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No user or auth error:", userError);
    window.location.href = "index.html";
    return;
  }

  // Use maybeSingle() to prevent coercion errors
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error loading profile:", profileError);
    return;
  }

  if (!profile) {
    console.warn("No profile found, creating a blank one.");
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username || "",
      full_name: user.user_metadata?.full_name || "",
    });
    return loadDashboard(); // reload
  }

  document.getElementById("username").textContent =
    profile.username || profile.full_name || "Unknown";
  document.getElementById("email").textContent = profile.email;
}

// Logout function
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Delete profile function
async function deleteProfile() {
  const confirmed = confirm(
    "Are you sure you want to delete your profile? This action cannot be undone."
  );
  if (!confirmed) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("No user logged in");

  await supabase.from("profiles").delete().eq("id", user.id);
  await supabase.auth.admin.deleteUser(user.id);

  alert("Profile deleted successfully");
  window.location.href = "index.html";
}

window.logout = logout;
window.deleteProfile = deleteProfile;

loadDashboard();

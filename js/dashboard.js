import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);

// Load user profile on dashboard
async function loadDashboard() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error loading profile:", error);
    return;
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

  // Delete profile row
  const { error: deleteProfileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);
  if (deleteProfileError) return alert(deleteProfileError.message);

  // Delete auth user
  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteAuthError) return alert(deleteAuthError.message);

  alert("Profile deleted successfully");
  window.location.href = "index.html";
}

// Expose functions globally
window.logout = logout;
window.deleteProfile = deleteProfile;

// Run on load
loadDashboard();

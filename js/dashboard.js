import { supabase } from "./supabaseClient.js";

// Check session and load user info
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  const userId = session.user.id;

  // Fetch profile info
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return;
  }

  document.getElementById("username").textContent = profile.username || "Unknown";
  document.getElementById("email").textContent = profile.email || "No Email";
  document.getElementById("joined").textContent = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "Unknown";
}

window.checkSession = checkSession;

// Log out
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }
  window.location.href = "index.html";
}

window.logout = logout;

// Delete profile
async function deleteProfile() {
  const confirmDelete = confirm(
    "Are you sure you want to delete your profile? This action is irreversible."
  );
  if (!confirmDelete) return;

  const { data: session } = await supabase.auth.getSession();
  if (!session) return alert("No active session found.");

  const userId = session.user.id;

  // Delete from profiles table
  const { error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (deleteError) {
    alert("Failed to delete profile: " + deleteError.message);
    return;
  }

  // Delete the auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    alert("Failed to delete authentication: " + authError.message);
    return;
  }

  alert("Your profile has been deleted successfully.");
  window.location.href = "index.html";
}

window.deleteProfile = deleteProfile;

// Run on page load
checkSession();

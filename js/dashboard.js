import { supabase } from "./supabaseClient.js";

// Load user profile on dashboard
async function loadDashboard() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error getting user:", userError);
    return;
  }

  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, full_name, email")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error loading profile:", profileError);
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

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return alert("No user logged in");

  const { error: deleteProfileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);
  if (deleteProfileError) return alert(deleteProfileError.message);

  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteAuthError) return alert(deleteAuthError.message);

  alert("Profile deleted successfully");
  window.location.href = "index.html";
}

// Expose globally
window.logout = logout;
window.deleteProfile = deleteProfile;

loadDashboard();

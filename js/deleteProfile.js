import { supabase } from "./supabaseClient.js";

export async function deleteProfile() {
  const user = supabase.auth.user();
  if (!user) {
    alert("Not logged in");
    return;
  }

  const confirmation = confirm("Are you sure you want to delete your profile? This action cannot be undone.");
  if (!confirmation) return;

  try {
    // Delete from profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);
    if (profileError) throw profileError;

    // Delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) throw authError;

    alert("Profile deleted successfully. You can sign up again now.");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Failed to delete profile: " + err.message);
  }
}

window.deleteProfile = deleteProfile;

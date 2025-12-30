import { supabase } from "./supabaseClient.js";

export async function deleteProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Not logged in");

  const confirmed = confirm("Are you sure you want to delete your profile? This cannot be undone.");
  if (!confirmed) return;

  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);
    if (profileError) throw profileError;

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

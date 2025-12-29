import { supabase } from "./supabaseClient.js";

async function loadProfile() {
  const user = supabase.auth.getUser();
  const { data: { user: currentUser } } = await user;

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return;
  }

  document.getElementById("username").innerText = data.username;
  document.getElementById("fullName").innerText = data.full_name;
  document.getElementById("email").innerText = data.email;
  document.getElementById("dob").innerText = data.dob;
  document.getElementById("joined").innerText = `Joined: ${new Date(data.created_at).toDateString()}`;
}

function logout() {
  supabase.auth.signOut().then(() => window.location.href = "index.html");
}

loadProfile();
window.logout = logout;

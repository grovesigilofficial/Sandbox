import { supabase } from "./supabaseClient.js";

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const createdEl = document.getElementById("created");
const logoutBtn = document.getElementById("logout");

async function loadDashboard() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = session.user.email;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, created_at")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error(error);
    usernameEl.textContent = "Profile error";
    return;
  }

  usernameEl.textContent = profile.username;
  createdEl.textContent = new Date(profile.created_at).toLocaleDateString();
}

logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  window.location.href = "index.html";
};

loadDashboard();

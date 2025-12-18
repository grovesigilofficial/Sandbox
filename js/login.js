import { supabase } from "./supabaseClient.js";

async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    alert("Missing email or password");
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    alert("Login successful");
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

window.loginUser = loginUser;


// js/auth.js
import { supabase } from "./supabaseClient.js";

export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName) {
    alert("Missing fields");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      username,
      full_name: fullName,
      dob: dob || null,
    });
  }

  alert("Account created. Check email.");
}

window.signupUser = signupUser;

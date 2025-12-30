import { supabase } from "./supabaseClient.js";

export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName || !dob) {
    alert("All fields are required");
    return;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      username,
      full_name: fullName,
      dob,
    });
    if (profileError) throw profileError;

    alert("Account created! Check your email to confirm your account.");
    document.getElementById("signup-container").reset?.();
  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed. Please try again.");
  }
}

window.signupUser = signupUser;

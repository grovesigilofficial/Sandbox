// js/auth.js
import { supabase } from "./supabaseClient.js";

/* =====================
   SIGNUP HANDLER
===================== */
async function signupUser() {
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
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp(
      { email, password },
      { options: { emailRedirectTo: window.location.origin + "/login.html" } }
    );

    if (authError) {
      // Show a friendly message even if Supabase rejects, for users who may have tried before
      alert("Check your email — if your account already exists, you should have received a confirmation email!");
      console.error("Signup error (non-blocking):", authError);
      return;
    }

    // Insert profile in "profiles" table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      username,
      full_name: fullName,
      dob,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      // still continue, the auth account exists and email sent
    }

    // Show friendly success
    alert("Account created! Check the email you used to sign up.");
    window.location.href = "login.html";

  } catch (err) {
    console.error("Signup unexpected error:", err);
    alert("Something went wrong. Please try again.");
  }
}

window.signupUser = signupUser;

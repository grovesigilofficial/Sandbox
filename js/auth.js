// js/auth.js
import { supabase } from "./supabaseClient.js";

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
    // Sign up with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp(
      { email, password },
      {
        data: {
          full_name: fullName,
          username: username,
        }
      }
    );
    if (authError) throw authError;

    // Insert profile into your "profiles" table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob,
      });
    if (profileError) throw profileError;

    alert("Account created! Check your email to confirm.");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed");
  }
}

window.signupUser = signupUser;

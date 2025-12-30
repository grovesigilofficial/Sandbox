import { supabase } from "./supabaseClient.js";

export async function signupUser() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value.trim();
  const fullName = document.getElementById("full-name")?.value.trim();
  const dob = document.getElementById("dob")?.value;

  if (!email || !password || !username || !fullName || !dob) {
    alert("All fields are required.");
    return;
  }

  try {
    // 1️⃣ Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      throw new Error("Auth signup failed: " + authError.message);
    }

    if (!authData.user || !authData.user.id) {
      throw new Error("Failed to create user account.");
    }

    // 2️⃣ Insert profile row using auth.uid
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob
      });

    if (profileError) {
      throw new Error("Profile creation failed: " + profileError.message);
    }

    // ✅ Success
    alert("Your account was created successfully! Check your email to confirm your account.");

    // Reset form if present
    const form = document.getElementById("signup-container");
    if (form?.reset) form.reset();

  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Signup failed. Please try again.");
  }
}

window.signupUser = signupUser;

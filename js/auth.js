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
    console.log("Missing field(s):", { email, password, username, fullName, dob });
    return;
  }

  try {
    // Debug: check table before insert
    const { data: tableData, error: tableErr } = await supabase.from("profiles").select("*");
    console.log("Current profiles table:", tableData, tableErr);

    // Check email/username conflicts
    const { data: emailExists } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    console.log("Email exists:", emailExists);

    const { data: usernameExists } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    console.log("Username exists:", usernameExists);

    if (emailExists) { alert("Email already in use"); return; }
    if (usernameExists) { alert("Username already taken"); return; }

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    console.log("Auth response:", authData, authError);
    if (authError) throw authError;

    // Insert profile
    const { error: profileError, data: profileData } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email,
        username,
        full_name: fullName,
        dob,
      });
    console.log("Profile insert response:", profileData, profileError);
    if (profileError) throw profileError;

    alert("Account created successfully!");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message || "Something went wrong");
  }
}

window.signupUser = signupUser;

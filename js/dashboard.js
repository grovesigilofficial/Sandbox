// js/dashboard.js
import { supabase } from "./supabaseClient.js";

// Get current user session and show profile info
async function loadDashboard() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    window.location.href = "index.html"; // redirect to login if not logged in
    return;
  }

  const userId = session.user.id;

  try {
    // Fetch profile info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, full_name, email, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (profileError) throw profileError;

    document.getElementById("username").textContent = profile.full_name || profile.username;
    document.getElementById("email").textContent = profile.email;
    document.getElementById("joined").textContent = new Date(profile.created_at).toLocaleDateString();

    // Fetch posts/newsfeed of followed users
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        created_at,
        profiles(full_name, username)
      `)
      .in("user_id", supabase.from("follows").select("followed_id").eq("follower_id", userId));
    
    if (postsError) throw postsError;

    const feedContainer = document.getElementById("feed");
    feedContainer.innerHTML = posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(
        post => `
        <div class="post">
          <h3>${post.profiles.full_name || post.profiles.username}</h3>
          <p>${post.content}</p>
          <small>${new Date(post.created_at).toLocaleString()}</small>
        </div>
      `
      ).join("");

  } catch (err) {
    console.error("Dashboard load error:", err);
    alert(err.message || "Failed to load dashboard.");
  }
}

// Logout function
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    alert("Logout failed.");
    return;
  }
  window.location.href = "index.html";
}

window.logout = logout;
window.loadDashboard = loadDashboard;

// Load dashboard on page load
document.addEventListener("DOMContentLoaded", loadDashboard);

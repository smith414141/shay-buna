import { db, auth, collection, getDocs, query } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "creators"));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.uid === user.uid) {
        // Update name
        const welcomeEl = document.querySelector(".dashboard-header h2");
        if (welcomeEl)
          welcomeEl.textContent = `Welcome back, ${data.fullName} 👋`;

        // Update username in sidebar
        const sidebarHandle = document.querySelector(".sidebar-profile span");
        if (sidebarHandle) sidebarHandle.textContent = `@${data.username}`;

        // Update page link
        const linkEl = document.getElementById("pageLink");
        if (linkEl)
          linkEl.textContent = `shay-buna.netlify.app/creator.html?u=${data.username}`;

        // Status banner
        const subheader = document.querySelector(".dashboard-header p");
        if (subheader) {
          if (data.status === "pending") {
            subheader.textContent = "⏳ Your account is pending admin approval";
            subheader.style.color = "#c0622a";
            subheader.style.fontWeight = "600";
          } else {
            subheader.textContent = "Here's how your page is doing";
            subheader.style.color = "#888";
          }
        }
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
  }
});

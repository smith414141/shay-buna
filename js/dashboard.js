import { db, auth, collection, getDocs, query, orderBy } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Load creator data
  try {
    const creatorsRef = collection(db, "creators");
    const q = query(creatorsRef);
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === user.uid) {
        // Update dashboard with real data
        const welcomeEl = document.querySelector(".dashboard-header h2");
        if (welcomeEl)
          welcomeEl.textContent = `Welcome back, ${data.fullName} 👋`;

        const linkEl = document.getElementById("pageLink");
        if (linkEl) linkEl.textContent = `shaybuna.com/${data.username}`;

        // Show pending status if not approved
        if (data.status === "pending") {
          const header = document.querySelector(".dashboard-header p");
          if (header) {
            header.textContent = "⏳ Your account is pending approval";
            header.style.color = "#c0622a";
          }
        }
      }
    });

    // Load transactions
    const txRef = collection(db, "transactions");
    const txQuery = query(txRef, orderBy("createdAt", "desc"));
    const txSnapshot = await getDocs(txQuery);

    let totalEarned = 0;
    let supporterCount = 0;
    const tbody = document.querySelector(".supporters-table tbody");
    if (tbody) tbody.innerHTML = "";

    txSnapshot.forEach((doc) => {
      const tx = doc.data();
      if (tx.creatorUid === user.uid) {
        totalEarned += tx.amount;
        supporterCount++;

        if (tbody) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${tx.supporterName || "Anonymous"}</td>
            <td>${tx.tier || "☕ Buna"}</td>
            <td class="amount-col">${tx.amount} ETB</td>
            <td>${tx.message || "—"}</td>
            <td>${new Date(tx.createdAt).toLocaleDateString()}</td>
          `;
          tbody.appendChild(row);
        }
      }
    });

    // Update stats
    const statCards = document.querySelectorAll(".dash-stat-card h3");
    if (statCards[0])
      statCards[0].textContent = `ETB ${totalEarned.toLocaleString()}`;
    if (statCards[1]) statCards[1].textContent = supporterCount;
  } catch (err) {
    console.error("Dashboard error:", err);
  }
});

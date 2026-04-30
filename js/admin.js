import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

async function loadCreators() {
  const snapshot = await getDocs(collection(db, "creators"));

  const pendingTbody = document.querySelector("#pendingTable tbody");
  const allTbody = document.querySelector("#allTable tbody");

  if (pendingTbody) pendingTbody.innerHTML = "";
  if (allTbody) allTbody.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    // All creators table
    if (allTbody) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.fullName}</td>
        <td>@${data.username}</td>
        <td>${data.email}</td>
        <td>${data.createdAt?.split("T")[0] || "—"}</td>
        <td><span class="status-${data.status}">${data.status}</span></td>
        <td>
          ${
            data.status === "pending"
              ? `<button class="approve-btn" onclick="approveCreator('${id}')">✅ Approve</button>
               <button class="reject-btn" onclick="rejectCreator('${id}')">❌ Reject</button>`
              : "—"
          }
        </td>
      `;
      allTbody.appendChild(row);
    }

    // Pending only
    if (pendingTbody && data.status === "pending") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.fullName}</td>
        <td>@${data.username}</td>
        <td>${data.email}</td>
        <td>${data.createdAt?.split("T")[0] || "—"}</td>
        <td>
          <button class="approve-btn" onclick="approveCreator('${id}')">✅ Approve</button>
          <button class="reject-btn" onclick="rejectCreator('${id}')">❌ Reject</button>
        </td>
      `;
      pendingTbody.appendChild(row);
    }
  });
}

window.approveCreator = async (id) => {
  await updateDoc(doc(db, "creators", id), { status: "approved" });
  alert("Creator approved! ✅");
  loadCreators();
};

window.rejectCreator = async (id) => {
  await deleteDoc(doc(db, "creators", id));
  alert("Creator rejected and removed.");
  loadCreators();
};

loadCreators();

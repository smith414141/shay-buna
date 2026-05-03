import { db, auth, collection, addDoc } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// This runs when Chapa redirects back to creator page after payment
const urlParams = new URLSearchParams(window.location.search);
const txRef = urlParams.get("trx_ref") || urlParams.get("tx_ref");
const status = urlParams.get("status");

if (txRef && status === "success") {
  // Get pending transaction from localStorage
  const pending = JSON.parse(localStorage.getItem("pending_tx") || "{}");

  if (pending.tx_ref) {
    // Save to Firebase
    addDoc(collection(db, "transactions"), {
      tx_ref: txRef,
      amount: pending.amount,
      creatorUid: pending.creatorUid,
      supporterName: pending.supporterName || "Anonymous",
      message: pending.message || "",
      tier: pending.tier || "☕ Buna",
      status: "completed",
      createdAt: new Date().toISOString(),
    }).then(() => {
      localStorage.removeItem("pending_tx");
      console.log("Transaction saved to Firebase");
    });
  }
}

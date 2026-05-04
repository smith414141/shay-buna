import { db, collection, addDoc } from "./firebase.js";

// Check URL parameters when page loads
const urlParams = new URLSearchParams(window.location.search);
const txRef = urlParams.get("trx_ref") || urlParams.get("tx_ref");
const status = urlParams.get("status");

// Debug — show what params we're getting
console.log("URL params:", window.location.search);
console.log("txRef:", txRef);
console.log("status:", status);

if (txRef && status === "success") {
  const pending = JSON.parse(localStorage.getItem("pending_tx") || "{}");

  if (pending.amount) {
    addDoc(collection(db, "transactions"), {
      tx_ref: txRef,
      amount: pending.amount,
      creatorUid: pending.creatorUid || "unknown",
      supporterName: pending.supporterName || "Anonymous",
      message: pending.message || "",
      tier: pending.tier || "☕ Buna",
      status: "completed",
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        localStorage.removeItem("pending_tx");
        console.log("Transaction saved!");
      })
      .catch((err) => console.error("Save error:", err));
  }
}

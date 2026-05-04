import { db, collection, addDoc } from "./firebase.js";

async function verifyAndSavePayment() {
  const pending = JSON.parse(localStorage.getItem("pending_tx") || "{}");

  if (!pending.tx_ref) return;

  try {
    const response = await fetch(`/api/verify?tx_ref=${pending.tx_ref}`);
    const data = await response.json();

    if (data.status === "success") {
      await addDoc(collection(db, "transactions"), {
        tx_ref: pending.tx_ref,
        amount: pending.amount,
        creatorUid: pending.creatorUid || "unknown",
        supporterName: pending.supporterName || "Anonymous",
        message: pending.message || "",
        tier: pending.tier || "☕ Buna",
        status: "completed",
        createdAt: new Date().toISOString(),
      });
      localStorage.removeItem("pending_tx");
      console.log("Transaction saved!");
    }
  } catch (err) {
    console.error("Verify error:", err);
  }
}

verifyAndSavePayment();

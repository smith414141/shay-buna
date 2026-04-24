// TIER SELECTION
const tierBtns = document.querySelectorAll(".tier-btn");
const customAmount = document.getElementById("customAmount");
const customInput = document.getElementById("customInput");
const totalDisplay = document.getElementById("totalDisplay");
const payAmount = document.getElementById("payAmount");
const qtyDisplay = document.getElementById("qtyDisplay");

let selectedAmount = 100;
let quantity = 1;

function updateTotal() {
  let amount =
    selectedAmount === "custom"
      ? parseInt(customInput?.value) || 0
      : selectedAmount;
  let total = amount * quantity;
  totalDisplay.textContent = total + " ETB";
  payAmount.textContent = total + " ETB";
}

tierBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tierBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount =
      btn.dataset.amount === "custom" ? "custom" : parseInt(btn.dataset.amount);

    if (btn.dataset.amount === "custom") {
      customAmount.style.display = "block";
    } else {
      customAmount.style.display = "none";
    }
    updateTotal();
  });
});

customInput?.addEventListener("input", updateTotal);

// QUANTITY
document.getElementById("qtyMinus")?.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    qtyDisplay.textContent = quantity;
    updateTotal();
  }
});

document.getElementById("qtyPlus")?.addEventListener("click", () => {
  if (quantity < 10) {
    quantity++;
    qtyDisplay.textContent = quantity;
    updateTotal();
  }
});
// SIGNUP STEPS
function goToStep(step) {
  document
    .querySelectorAll(".form-step")
    .forEach((s) => (s.style.display = "none"));
  document
    .querySelectorAll(".step-dot")
    .forEach((d) => d.classList.remove("active"));

  document.getElementById("step" + step).style.display = "block";
  document.getElementById("dot" + step).classList.add("active");
}

// USERNAME PREVIEW
const usernameInput = document.getElementById("username");
const usernamePreview = document.getElementById("usernamePreview");
if (usernameInput) {
  usernameInput.addEventListener("input", () => {
    usernamePreview.textContent = usernameInput.value || "yourname";
  });
}

// SIGNUP SUBMIT
function handleSignup() {
  alert(
    "Page created! Welcome to Shay Buna ☕\n\nNext step: connect your Chapa account to go live."
  );
}
// COPY LINK
function copyLink() {
  const link = document.getElementById("pageLink")?.textContent;
  if (link) {
    navigator.clipboard.writeText(link);
    alert("Link copied! ☕");
  }
}
// LOGIN
function handleLogin() {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  window.location.href = "dashboard.html";
}
// ADMIN APPROVE/REJECT
function approveCreator(btn) {
  const row = btn.closest("tr");
  row.style.opacity = "0.5";
  btn.textContent = "✅ Approved";
  btn.disabled = true;
  row.nextElementSibling?.remove();
}

function rejectCreator(btn) {
  const row = btn.closest("tr");
  row.remove();
}

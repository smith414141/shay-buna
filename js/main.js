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
async function handleSignup() {
  const fullName = document.getElementById("fullName")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value;

  if (!fullName || !email || !password || !username) {
    alert("Please fill in all fields.");
    return;
  }

  const btn = document.querySelector("#step3 .btn-pay");
  btn.textContent = "Creating your page...";
  btn.disabled = true;

  try {
    // Create auth account
    const { auth, db, collection, addDoc, createUserWithEmailAndPassword } =
      await import("./firebase.js");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Save creator profile to Firestore
    await addDoc(collection(db, "creators"), {
      uid,
      fullName,
      email,
      username,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    alert(
      "Page created! Welcome to Shay Buna ☕\n\nYour account is pending approval."
    );
    window.location.href = "login.html";
  } catch (err) {
    alert("Error: " + err.message);
    btn.textContent = "🎉 Create My Page";
    btn.disabled = false;
  }
}
// CHAPA PAYMENT
document.getElementById("payBtn")?.addEventListener("click", async () => {
  const name = document.getElementById("supporterName")?.value || "Anonymous";
  const phone = document.getElementById("supporterPhone")?.value;
  const message = document.getElementById("supporterMessage")?.value || "";

  if (!phone) {
    alert("Please enter your Telebirr or CBEBirr number");
    return;
  }

  const amount =
    selectedAmount === "custom"
      ? parseInt(customInput?.value) || 0
      : selectedAmount * quantity;

  if (amount < 10) {
    alert("Minimum amount is 10 ETB");
    return;
  }

  const btn = document.getElementById("payBtn");
  btn.textContent = "Processing...";
  btn.disabled = true;

  try {
    const response = await fetch("/.netlify/functions/pay", {
      method: "POST",

      body: JSON.stringify({
        amount: amount.toString(),
        currency: "ETB",
        email: "supporter@shaybuna.com",
        first_name: name.split(" ")[0] || "Fan",
        last_name: name.split(" ")[1] || "",
        phone_number: phone,
        tx_ref: "shaybuna-" + Date.now(),
        callback_url: "https://shay-buna.netlify.app/creator.html",
        return_url: "https://shay-buna.netlify.app/creator.html",
        customization: {
          title: "Shay Buna",
          description: message || "Supporting a creator on Shay Buna",
        },
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      window.location.href = data.data.checkout_url;
    } else {
      alert("Payment failed: " + JSON.stringify(data));
      btn.textContent = "☕ Send Coffee · " + amount + " ETB";
      btn.disabled = false;
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    btn.textContent = "☕ Send Coffee · " + amount + " ETB";
    btn.disabled = false;
  }
});
// COPY LINK
function copyLink() {
  const link = document.getElementById("pageLink")?.textContent;
  if (link) {
    navigator.clipboard.writeText(link);
    alert("Link copied! ☕");
  }
}
// LOGIN
async function handleLogin() {
  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const btn = document.querySelector(".btn-pay");
  btn.textContent = "Logging in...";
  btn.disabled = true;

  try {
    const { auth, signInWithEmailAndPassword } = await import("./firebase.js");
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Login failed: " + err.message);
    btn.textContent = "Login to Dashboard";
    btn.disabled = false;
  }
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
// EXPLORE FILTER
let currentFilter = "all";

function setFilter(category, btn) {
  currentFilter = category;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  filterCreators();
}

function filterCreators() {
  const search =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const cards = document.querySelectorAll(".explore-card");
  cards.forEach((card) => {
    const name = card.dataset.name || "";
    const category = card.dataset.category || "";
    const matchSearch = name.includes(search);
    const matchFilter = currentFilter === "all" || category === currentFilter;
    card.style.display = matchSearch && matchFilter ? "flex" : "none";
  });
}
// LANGUAGE SWITCHER
const translations = {
  en: {
    // NAVBAR
    "Creator Login": "Creator Login",
    "Join as Creator →": "Join as Creator →",
    // HERO
    "Buy your favorite": "Buy your favorite",
    creator: "creator",
    "a coffee": "a coffee",
    "Shay Buna lets fans support their favorite Ethiopian content creators with micro-payments in ETB — as simple as buying them a coffee.":
      "Shay Buna lets fans support their favorite Ethiopian content creators with micro-payments in ETB — as simple as buying them a coffee.",
    "Start Your Page →": "Start Your Page →",
    "♡ Support a Creator": "♡ Support a Creator",
    // STATS
    "Active Creators": "Active Creators",
    "Sent to Creators": "Sent to Creators",
    Supporters: "Supporters",
    "Local Payments": "Local Payments",
    // HOW IT WORKS
    "How it works": "How it works",
    "Create your page": "Create your page",
    "Share your link": "Share your link",
    "Get supported": "Get supported",
  },
  am: {
    "Creator Login": "ፈጣሪ መግቢያ",
    "Join as Creator →": "እንደ ፈጣሪ ይቀላቀሉ →",
    "Buy your favorite": "ለሚወዱት",
    creator: "ፈጣሪ",
    "a coffee": "ቡና ይግዙ",
    "Shay Buna lets fans support their favorite Ethiopian content creators with micro-payments in ETB — as simple as buying them a coffee.":
      "ሸይ ቡና አድናቂዎች በETB ጥቃቅን ክፍያዎች የሚወዷቸውን የኢትዮጵያ ፈጣሪዎች እንዲደግፉ ያስችላቸዋል።",
    "Start Your Page →": "ገጽዎን ይጀምሩ →",
    "♡ Support a Creator": "♡ ፈጣሪን ይደግፉ",
    "Active Creators": "ንቁ ፈጣሪዎች",
    "Sent to Creators": "ለፈጣሪዎች የተላከ",
    Supporters: "ደጋፊዎች",
    "Local Payments": "የአካባቢ ክፍያዎች",
    "How it works": "እንዴት እንደሚሰራ",
    "Create your page": "ገጽዎን ይፍጠሩ",
    "Share your link": "ሊንክዎን ያጋሩ",
    "Get supported": "ድጋፍ ያግኙ",
  },
  or: {
    "Creator Login": "Seensa Uumaa",
    "Join as Creator →": "Uumaa ta'i →",
    "Buy your favorite": "Kan jaallattu",
    creator: "uumaa",
    "a coffee": "bunaa bitu",
    "Shay Buna lets fans support their favorite Ethiopian content creators with micro-payments in ETB — as simple as buying them a coffee.":
      "Shay Buna deggartoota uumaawwan Itoophiyaa jaallataman ETB'n deeggaruu ni dandeessisa.",
    "Start Your Page →": "Fuula Kee Eegali →",
    "♡ Support a Creator": "♡ Uumaa Deeggaruu",
    "Active Creators": "Uumaawwan Socho'oo",
    "Sent to Creators": "Uumaawwaniif Ergame",
    Supporters: "Deeggartoota",
    "Local Payments": "Kaffaltii Naannoo",
    "How it works": "Akkamitti akka hojjetu",
    "Create your page": "Fuula kee uumi",
    "Share your link": "Hidhaa kee qoodi",
    "Get supported": "Deeggarsa argadhu",
  },
};

function setLang(lang) {
  // Update active button
  document
    .querySelectorAll(".lang-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.lang-btn[onclick="setLang('${lang}')"]`)
    ?.classList.add("active");

  // Save to localStorage
  localStorage.setItem("shaybuna_lang", lang);

  // Update all elements with data attributes
  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text && el.children.length === 0) el.textContent = text;
  });
}

// Load saved language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("shaybuna_lang") || "en";
  setLang(savedLang);
});

// ================================================================
// APPLICATION STATE
// ================================================================
let currentUser = null;      // logged in user object
let currentRole = null;      // 'donor' | 'hospital' | 'bloodbank' | 'admin'
let currentDashboardTab = null;
let pendingRequestForMatch = null; // request currently being matched in UI

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const COMPATIBILITY = {
  "O-":  ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+":  ["O+", "A+", "B+", "AB+"],
  "A-":  ["A-", "A+", "AB-", "AB+"],
  "A+":  ["A+", "AB+"],
  "B-":  ["B-", "B+", "AB-", "AB+"],
  "B+":  ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};

// ================================================================
// DEMO DATA
// ================================================================
function buildDemoData() {
  const users = [
    { id: "USR-001", name: "Rahul Sharma",  email: "donor@bloodbridge.demo",     password: "password123", role: "donor",     status: "active", joined: "2026-01-12" },
    { id: "USR-002", name: "CityCare Hospital", email: "hospital@bloodbridge.demo", password: "password123", role: "hospital", status: "active", joined: "2026-01-15" },
    { id: "USR-003", name: "RedCare Blood Bank", email: "bloodbank@bloodbridge.demo", password: "password123", role: "bloodbank", status: "active", joined: "2026-01-15" },
    { id: "USR-004", name: "System Admin", email: "admin@bloodbridge.demo", password: "password123", role: "admin", status: "active", joined: "2026-01-01" },
    { id: "USR-005", name: "Ananya Iyer", email: "ananya@bloodbridge.demo", password: "password123", role: "donor", status: "active", joined: "2026-02-02" },
    { id: "USR-006", name: "Vikram Patil", email: "vikram@bloodbridge.demo", password: "password123", role: "donor", status: "active", joined: "2026-02-10" },
    { id: "USR-007", name: "Sneha Kulkarni", email: "sneha@bloodbridge.demo", password: "password123", role: "donor", status: "active", joined: "2026-02-18" },
    { id: "USR-008", name: "Imran Shaikh", email: "imran@bloodbridge.demo", password: "password123", role: "donor", status: "active", joined: "2026-03-01" },
    { id: "USR-009", name: "Lifeline Medical Center", email: "lifeline@bloodbridge.demo", password: "password123", role: "hospital", status: "active", joined: "2026-01-20" },
    { id: "USR-010", name: "Hope General Hospital", email: "hope@bloodbridge.demo", password: "password123", role: "hospital", status: "active", joined: "2026-01-22" },
    { id: "USR-011", name: "LifeDrop Blood Center", email: "lifedrop@bloodbridge.demo", password: "password123", role: "bloodbank", status: "active", joined: "2026-01-18" },
    { id: "USR-012", name: "Hope Blood Bank", email: "hopebank@bloodbridge.demo", password: "password123", role: "bloodbank", status: "active", joined: "2026-01-25" }
  ];

  const donors = [
    { id: "DON-001", userId: "USR-001", name: "Rahul Sharma", email: "donor@bloodbridge.demo", phone: "9876500001", bloodGroup: "O+", age: 28, gender: "Male", city: "Panvel", address: "Sector 12, Panvel", lastDonation: "2026-06-10", available: true, donationCount: 4 },
    { id: "DON-002", userId: "USR-005", name: "Ananya Iyer", email: "ananya@bloodbridge.demo", phone: "9876500002", bloodGroup: "A+", age: 24, gender: "Female", city: "Navi Mumbai", address: "Vashi, Navi Mumbai", lastDonation: "2026-05-02", available: true, donationCount: 2 },
    { id: "DON-003", userId: "USR-006", name: "Vikram Patil", email: "vikram@bloodbridge.demo", phone: "9876500003", bloodGroup: "B-", age: 33, gender: "Male", city: "Thane", address: "Ghodbunder Road, Thane", lastDonation: "2026-03-20", available: false, donationCount: 6 },
    { id: "DON-004", userId: "USR-007", name: "Sneha Kulkarni", email: "sneha@bloodbridge.demo", phone: "9876500004", bloodGroup: "AB+", age: 27, gender: "Female", city: "Mumbai", address: "Andheri, Mumbai", lastDonation: "2026-07-01", available: true, donationCount: 1 },
    { id: "DON-005", userId: "USR-008", name: "Imran Shaikh", email: "imran@bloodbridge.demo", phone: "9876500005", bloodGroup: "O-", age: 30, gender: "Male", city: "Panvel", address: "Kalamboli, Panvel", lastDonation: "2026-04-15", available: true, donationCount: 8 }
  ];

  const hospitals = [
    { id: "HOS-001", userId: "USR-002", name: "CityCare Hospital", license: "MH-HOS-1001", city: "Panvel", phone: "022-4000001" },
    { id: "HOS-002", userId: "USR-009", name: "Lifeline Medical Center", license: "MH-HOS-1002", city: "Navi Mumbai", phone: "022-4000002" },
    { id: "HOS-003", userId: "USR-010", name: "Hope General Hospital", license: "MH-HOS-1003", city: "Thane", phone: "022-4000003" }
  ];

  const bloodBanks = [
    { id: "BB-001", userId: "USR-003", name: "RedCare Blood Bank", registrationId: "MH-BB-2001", city: "Panvel", phone: "022-5000001" },
    { id: "BB-002", userId: "USR-011", name: "LifeDrop Blood Center", registrationId: "MH-BB-2002", city: "Navi Mumbai", phone: "022-5000002" },
    { id: "BB-003", userId: "USR-012", name: "Hope Blood Bank", registrationId: "MH-BB-2003", city: "Mumbai", phone: "022-5000003" }
  ];

  const inventory = [
    { id: "INV-001", bloodBankId: "BB-001", bloodGroup: "A+", available: 12, reserved: 2, lastUpdated: todayISO() },
    { id: "INV-002", bloodBankId: "BB-001", bloodGroup: "O+", available: 20, reserved: 4, lastUpdated: todayISO() },
    { id: "INV-003", bloodBankId: "BB-001", bloodGroup: "B+", available: 3, reserved: 0, lastUpdated: todayISO() },
    { id: "INV-004", bloodBankId: "BB-002", bloodGroup: "O-", available: 5, reserved: 1, lastUpdated: todayISO() },
    { id: "INV-005", bloodBankId: "BB-002", bloodGroup: "AB+", available: 0, reserved: 0, lastUpdated: todayISO() },
    { id: "INV-006", bloodBankId: "BB-002", bloodGroup: "A-", available: 7, reserved: 1, lastUpdated: todayISO() },
    { id: "INV-007", bloodBankId: "BB-003", bloodGroup: "B-", available: 4, reserved: 0, lastUpdated: todayISO() },
    { id: "INV-008", bloodBankId: "BB-003", bloodGroup: "AB-", available: 2, reserved: 0, lastUpdated: todayISO() }
  ];

  const requests = [
    { id: "REQ-1001", hospitalId: "HOS-001", patientName: "Patient A", bloodGroup: "O+", units: 2, location: "Panvel", requiredBy: "2026-09-28", urgency: "Critical", notes: "Emergency surgery", status: "Matching", createdAt: daysAgoISO(2) },
    { id: "REQ-1002", hospitalId: "HOS-002", patientName: "Patient B", bloodGroup: "B+", units: 1, location: "Navi Mumbai", requiredBy: "2026-09-30", urgency: "High", notes: "", status: "Pending", createdAt: daysAgoISO(1) },
    { id: "REQ-1003", hospitalId: "HOS-001", patientName: "Patient C", bloodGroup: "AB-", units: 3, location: "Panvel", requiredBy: "2026-10-02", urgency: "Normal", notes: "Scheduled procedure", status: "Match Requested", createdAt: daysAgoISO(4) },
    { id: "REQ-1004", hospitalId: "HOS-003", patientName: "Patient D", bloodGroup: "O-", units: 2, location: "Thane", requiredBy: "2026-09-27", urgency: "Critical", notes: "Trauma case", status: "Accepted", createdAt: daysAgoISO(5) },
    { id: "REQ-1005", hospitalId: "HOS-002", patientName: "Patient E", bloodGroup: "A+", units: 1, location: "Navi Mumbai", requiredBy: "2026-09-20", urgency: "Normal", notes: "", status: "Completed", createdAt: daysAgoISO(10) }
  ];

  const matches = [];

  const notifications = [
    { id: "NOT-1001", userId: "USR-002", title: "Request Created", message: "Your blood request REQ-1001 has been created.", type: "info", read: false, timestamp: daysAgoISO(2) },
    { id: "NOT-1002", userId: "USR-002", title: "Potential Match Found", message: "A potential blood match has been found for REQ-1001.", type: "success", read: false, timestamp: daysAgoISO(2) },
    { id: "NOT-1003", userId: "USR-003", title: "Low Stock Alert", message: "Inventory for B+ is running low.", type: "warning", read: false, timestamp: daysAgoISO(1) },
    { id: "NOT-1004", userId: "USR-002", title: "Blood Bank Responded", message: "Blood Bank RedCare has responded to your request REQ-1003.", type: "info", read: true, timestamp: daysAgoISO(3) },
    { id: "NOT-1005", userId: "USR-004", title: "System Update", message: "5 new users registered this week.", type: "info", read: true, timestamp: daysAgoISO(6) }
  ];

  return { users, donors, hospitals, bloodBanks, inventory, requests, matches, notifications };
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function daysAgoISO(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
function nowTimestamp() { return new Date().toISOString(); }

// ================================================================
// LOCAL STORAGE
// ================================================================
const STORAGE_KEYS = ["users", "donors", "hospitals", "bloodBanks", "inventory", "requests", "matches", "notifications", "currentUserId", "theme"];
const STORAGE_PREFIX = "bloodbridge_";

let DB = { users: [], donors: [], hospitals: [], bloodBanks: [], inventory: [], requests: [], matches: [], notifications: [] };

function saveDB() {
  try {
    Object.keys(DB).forEach(key => {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(DB[key]));
    });
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

function loadDB() {
  try {
    const hasData = localStorage.getItem(STORAGE_PREFIX + "users");
    if (!hasData) {
      DB = buildDemoData();
      saveDB();
      return;
    }
    Object.keys(DB).forEach(key => {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      DB[key] = raw ? JSON.parse(raw) : [];
    });
  } catch (e) {
    console.error("Storage load failed, resetting to demo data", e);
    DB = buildDemoData();
    saveDB();
  }
}

function resetDemoData() {
  DB = buildDemoData();
  saveDB();
  localStorage.removeItem(STORAGE_PREFIX + "currentUserId");
}

function nextId(prefix, list) {
  const nums = list
    .map(item => parseInt(String(item.id).split("-")[1], 10))
    .filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : (prefix === "REQ" || prefix === "MAT" || prefix === "NOT" ? 1000 : 0);
  return `${prefix}-${String(max + 1).padStart(prefix.length > 3 ? 4 : 3, "0")}`;
}

// ================================================================
// AUTHENTICATION
// ================================================================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const role = document.getElementById("loginRole").value;

  if (!email || !password || !role) {
    showToast("Please fill in all fields.", "warning");
    return;
  }

  const user = DB.users.find(u => u.email.toLowerCase() === email && u.role === role);

  if (!user) {
    showToast("No account found for that email and role.", "danger");
    return;
  }
  if (user.password !== password) {
    showToast("Incorrect password.", "danger");
    return;
  }
  if (user.status === "suspended") {
    showToast("This account has been suspended. Contact the administrator.", "danger");
    return;
  }

  loginAs(user);
}

function loginAs(user) {
  currentUser = user;
  currentRole = user.role;
  localStorage.setItem(STORAGE_PREFIX + "currentUserId", user.id);
  showToast(`Welcome back, ${user.name.split(" ")[0]}.`, "success");
  openDashboard(user.role);
}

function tryRestoreSession() {
  const savedId = localStorage.getItem(STORAGE_PREFIX + "currentUserId");
  if (!savedId) return false;
  const user = DB.users.find(u => u.id === savedId);
  if (!user) return false;
  currentUser = user;
  currentRole = user.role;
  openDashboard(user.role);
  return true;
}

function handleLogout() {
  currentUser = null;
  currentRole = null;
  localStorage.removeItem(STORAGE_PREFIX + "currentUserId");
  document.getElementById("appShell").classList.add("hidden");
  showView("landingView");
  showToast("You have been logged out.", "info");
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;

  if (!name || !validateEmail(email) || !phone || password.length < 6 || !role) {
    showToast("Please complete all required fields correctly.", "warning");
    return;
  }
  if (DB.users.some(u => u.email.toLowerCase() === email)) {
    showToast("An account with this email already exists.", "danger");
    return;
  }

  const newUser = {
    id: nextId("USR", DB.users),
    name, email, password, role,
    status: "active",
    joined: todayISO()
  };
  DB.users.push(newUser);

  if (role === "donor") {
    const bg = document.getElementById("regBloodGroup").value;
    const age = document.getElementById("regAge").value;
    const gender = document.getElementById("regGender").value;
    const city = document.getElementById("regDonorCity").value.trim();
    if (!bg) { showToast("Please select a blood group.", "warning"); DB.users.pop(); return; }
    DB.donors.push({
      id: nextId("DON", DB.donors), userId: newUser.id, name, email, phone,
      bloodGroup: bg, age: Number(age) || null, gender, city,
      address: "", lastDonation: "", available: true, donationCount: 0
    });
  } else if (role === "hospital") {
    const hospName = document.getElementById("regHospitalName").value.trim();
    const license = document.getElementById("regHospitalLicense").value.trim();
    const city = document.getElementById("regHospitalCity").value.trim();
    if (!hospName) { showToast("Hospital name cannot be empty.", "warning"); DB.users.pop(); return; }
    DB.hospitals.push({ id: nextId("HOS", DB.hospitals), userId: newUser.id, name: hospName, license, city, phone });
  } else if (role === "bloodbank") {
    const bankName = document.getElementById("regBankName").value.trim();
    const regId = document.getElementById("regBankReg").value.trim();
    const city = document.getElementById("regBankCity").value.trim();
    if (!bankName) { showToast("Blood bank name cannot be empty.", "warning"); DB.users.pop(); return; }
    DB.bloodBanks.push({ id: nextId("BB", DB.bloodBanks), userId: newUser.id, name: bankName, registrationId: regId, city, phone });
  }

  saveDB();
  closeModal("registerModal");
  showToast("Registration successful. Please login.", "success");
  document.getElementById("registerForm").reset();
  document.querySelectorAll(".role-fields").forEach(el => el.classList.add("hidden"));
  showView("loginView");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ================================================================
// NAVIGATION
// ================================================================
const SIDEBAR_CONFIG = {
  donor: [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "profile", label: "My Profile", icon: "🧑" },
    { key: "availability", label: "Availability", icon: "🩸" },
    { key: "requests", label: "Blood Requests", icon: "📋" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "settings", label: "Settings", icon: "⚙️" }
  ],
  hospital: [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "createRequest", label: "Create Request", icon: "➕" },
    { key: "myRequests", label: "My Requests", icon: "📋" },
    { key: "searchBlood", label: "Search Blood", icon: "🔍" },
    { key: "matches", label: "Matches", icon: "🤝" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "profile", label: "Profile", icon: "🧑" }
  ],
  bloodbank: [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "inventory", label: "Inventory", icon: "🧪" },
    { key: "requests", label: "Blood Requests", icon: "📋" },
    { key: "matches", label: "Matches", icon: "🤝" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "profile", label: "Profile", icon: "🧑" }
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "hospitals", label: "Hospitals", icon: "🏥" },
    { key: "bloodBanks", label: "Blood Banks", icon: "🧪" },
    { key: "donors", label: "Donors", icon: "🧑" },
    { key: "requests", label: "Requests", icon: "📋" },
    { key: "settings", label: "Settings", icon: "⚙️" }
  ]
};

function openDashboard(role) {
  showView(null); // hide landing/login
  document.getElementById("appShell").classList.remove("hidden");
  document.getElementById("sidebarAvatar").textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById("sidebarUserName").textContent = currentUser.name;
  document.getElementById("sidebarUserRole").textContent = roleLabel(role);
  renderSidebarNav(role);
  navigateTab("dashboard");
}

function roleLabel(role) {
  return { donor: "Donor", hospital: "Hospital", bloodbank: "Blood Bank", admin: "Admin" }[role] || role;
}

function renderSidebarNav(role) {
  const nav = document.getElementById("sidebarNav");
  nav.innerHTML = "";
  SIDEBAR_CONFIG[role].forEach(item => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`;
    btn.dataset.tab = item.key;
    btn.addEventListener("click", () => navigateTab(item.key));
    nav.appendChild(btn);
  });
}

function navigateTab(tabKey) {
  currentDashboardTab = tabKey;
  document.querySelectorAll("#sidebarNav button").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tabKey);
  });
  closeSidebarMobile();

  const renderers = {
    donor: {
      dashboard: renderDonorDashboard, profile: renderDonorProfile, availability: renderDonorAvailability,
      requests: renderDonorRequests, notifications: renderNotificationsPage, settings: renderSettingsPage
    },
    hospital: {
      dashboard: renderHospitalDashboard, createRequest: renderCreateRequestForm, myRequests: renderHospitalRequests,
      searchBlood: renderSearchBlood, matches: renderHospitalMatches, notifications: renderNotificationsPage, profile: renderHospitalProfile
    },
    bloodbank: {
      dashboard: renderBloodBankDashboard, inventory: renderInventoryPage, requests: renderBloodBankRequests,
      matches: renderBloodBankMatches, notifications: renderNotificationsPage, profile: renderBloodBankProfile
    },
    admin: {
      dashboard: renderAdminDashboard, users: renderAdminUsers, hospitals: renderAdminHospitals,
      bloodBanks: renderAdminBloodBanks, donors: renderAdminDonors, requests: renderAdminRequests, settings: renderSettingsPage
    }
  };

  const fn = renderers[currentRole] && renderers[currentRole][tabKey];
  const content = document.getElementById("appContent");
  content.innerHTML = `<div class="skeleton" style="height:120px;margin-bottom:16px;"></div>`;
  setTimeout(() => {
    if (fn) fn();
    else content.innerHTML = emptyState("🚧", "This section is not available.");
    updateNotifDot();
  }, 150);
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  if (viewId) document.getElementById(viewId).classList.remove("hidden");
}

function setPageHeader(title, desc) {
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageDesc").textContent = desc || "";
}

function closeSidebarMobile() {
  document.getElementById("sidebar").classList.remove("open");
}

// ================================================================
// UI HELPERS
// ================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function emptyState(icon, message) {
  return `<div class="empty-state"><div class="icon">${icon}</div><p>${escapeHtml(message)}</p></div>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function badgeForStatus(status) {
  const map = {
    Pending: "warning", Matching: "warning", "Match Requested": "primary",
    Accepted: "success", Completed: "success", Rejected: "danger", Cancelled: "neutral",
    Available: "success", "Low Stock": "warning", "Out of Stock": "danger",
    Critical: "danger", High: "warning", Normal: "neutral",
    active: "success", suspended: "danger"
  };
  const cls = map[status] || "neutral";
  return `<span class="badge badge-${cls}">${escapeHtml(status)}</span>`;
}

function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }

function openGenericModal(title, bodyHtml) {
  document.getElementById("genericModalTitle").textContent = title;
  document.getElementById("genericModalBody").innerHTML = bodyHtml;
  openModal("genericModal");
}

function confirmAction(message, onConfirm) {
  openGenericModal("Please Confirm", `
    <p>${escapeHtml(message)}</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px;">
      <button class="btn btn-outline" id="confirmCancelBtn">Cancel</button>
      <button class="btn btn-danger" id="confirmOkBtn">Confirm</button>
    </div>
  `);
  document.getElementById("confirmCancelBtn").onclick = () => closeModal("genericModal");
  document.getElementById("confirmOkBtn").onclick = () => { closeModal("genericModal"); onConfirm(); };
}

function statusTimelineHtml(currentStatus) {
  const steps = ["Pending", "Matching", "Match Requested", "Accepted", "Completed"];
  if (currentStatus === "Rejected" || currentStatus === "Cancelled") {
    return `<div class="status-timeline"><div class="timeline-step current">${currentStatus}</div></div>`;
  }
  const idx = steps.indexOf(currentStatus);
  return `<div class="status-timeline">${steps.map((s, i) => {
    let cls = "";
    if (i < idx) cls = "done";
    else if (i === idx) cls = "current";
    return `<div class="timeline-step ${cls}">${s}</div>`;
  }).join("")}</div>`;
}

// ================================================================
// MATCHING ENGINE
// ================================================================
function findPotentialMatches(bloodGroup, location) {
  const compatibleGroups = COMPATIBILITY[bloodGroup] ? Object.keys(COMPATIBILITY).filter(bg => COMPATIBILITY[bg].includes(bloodGroup)) : [];
  // compatibleGroups = donor groups that CAN give to bloodGroup
  const results = [];

  // 1. Inventory matches
  DB.inventory.forEach(inv => {
    if (inv.available <= 0) return;
    const isExact = inv.bloodGroup === bloodGroup;
    const isCompatible = compatibleGroups.includes(inv.bloodGroup);
    if (isExact || isCompatible) {
      const bank = DB.bloodBanks.find(b => b.id === inv.bloodBankId);
      if (!bank) return;
      results.push({
        source: "Blood Bank",
        sourceName: bank.name,
        city: bank.city,
        bloodGroup: inv.bloodGroup,
        availableUnits: inv.available,
        compatibility: isExact ? "Exact" : "Compatible",
        sameLocation: location && bank.city && bank.city.toLowerCase() === location.toLowerCase()
      });
    }
  });

  // 2. Donor matches
  DB.donors.forEach(d => {
    if (!d.available) return;
    const isExact = d.bloodGroup === bloodGroup;
    const isCompatible = compatibleGroups.includes(d.bloodGroup);
    if (isExact || isCompatible) {
      results.push({
        source: "Donor",
        sourceName: d.name,
        city: d.city,
        bloodGroup: d.bloodGroup,
        availableUnits: 1,
        compatibility: isExact ? "Exact" : "Compatible",
        sameLocation: location && d.city && d.city.toLowerCase() === location.toLowerCase()
      });
    }
  });

  // Sort: exact first, then compatible; same location first
  results.sort((a, b) => {
    if (a.compatibility !== b.compatibility) return a.compatibility === "Exact" ? -1 : 1;
    if (a.sameLocation !== b.sameLocation) return a.sameLocation ? -1 : 1;
    return b.availableUnits - a.availableUnits;
  });

  return results;
}

function runMatchingForRequest(request) {
  const results = findPotentialMatches(request.bloodGroup, request.location);
  if (request.status === "Pending") {
    request.status = results.length ? "Matching" : "Pending";
  }
  saveDB();
  return results;
}

// ================================================================
// NOTIFICATIONS
// ================================================================
function createNotification(userId, title, message, type = "info") {
  const notif = {
    id: nextId("NOT", DB.notifications),
    userId, title, message, type,
    read: false,
    timestamp: nowTimestamp()
  };
  DB.notifications.push(notif);
  saveDB();
  return notif;
}

function updateNotifDot() {
  if (!currentUser) return;
  const hasUnread = DB.notifications.some(n => n.userId === currentUser.id && !n.read);
  const dot = document.getElementById("notifDot");
  dot.classList.toggle("hidden", !hasUnread);
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function renderNotificationsPage() {
  setPageHeader("Notifications", "Stay updated on requests, matches and inventory.");
  const myNotifs = DB.notifications.filter(n => n.userId === currentUser.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  let html = `<div class="panel">
    <div class="panel-header">
      <h3>All Notifications</h3>
      <button class="btn btn-outline btn-sm" id="markAllReadBtn">Mark all as read</button>
    </div>`;

  if (!myNotifs.length) {
    html += emptyState("🔔", "No notifications yet.");
  } else {
    html += myNotifs.map(n => `
      <div class="notif-item ${n.read ? "" : "unread"}">
        <div class="notif-dot-icon" style="${n.read ? "background:var(--border)" : ""}"></div>
        <div class="notif-body">
          <div class="notif-title">${escapeHtml(n.title)}</div>
          <div class="notif-message">${escapeHtml(n.message)}</div>
          <div class="notif-time">${timeAgo(n.timestamp)}</div>
          <div class="notif-actions">
            ${n.read ? "" : `<button data-mark-read="${n.id}">Mark as read</button>`}
            <button data-delete-notif="${n.id}">Delete</button>
          </div>
        </div>
      </div>
    `).join("");
  }
  html += `</div>`;
  document.getElementById("appContent").innerHTML = html;

  document.getElementById("markAllReadBtn").onclick = () => {
    DB.notifications.forEach(n => { if (n.userId === currentUser.id) n.read = true; });
    saveDB(); showToast("All notifications marked as read.", "success"); renderNotificationsPage(); updateNotifDot();
  };
  document.querySelectorAll("[data-mark-read]").forEach(btn => {
    btn.onclick = () => {
      const n = DB.notifications.find(x => x.id === btn.dataset.markRead);
      if (n) { n.read = true; saveDB(); renderNotificationsPage(); updateNotifDot(); }
    };
  });
  document.querySelectorAll("[data-delete-notif]").forEach(btn => {
    btn.onclick = () => {
      DB.notifications = DB.notifications.filter(x => x.id !== btn.dataset.deleteNotif);
      saveDB(); showToast("Notification deleted.", "info"); renderNotificationsPage(); updateNotifDot();
    };
  });
}

function openNotifPanel() {
  navigateTab("notifications");
}

// ================================================================
// DONOR FUNCTIONS
// ================================================================
function getDonorForCurrentUser() {
  return DB.donors.find(d => d.userId === currentUser.id);
}

function renderDonorDashboard() {
  const donor = getDonorForCurrentUser();
  setPageHeader(`Welcome, ${currentUser.name.split(" ")[0]}`, "Here's your donor summary.");
  if (!donor) {
    document.getElementById("appContent").innerHTML = emptyState("🧑", "Donor profile not found.");
    return;
  }
  const nearbyRequests = DB.requests.filter(r => COMPATIBILITY[donor.bloodGroup] && COMPATIBILITY[donor.bloodGroup].includes(r.bloodGroup) && !["Completed", "Cancelled", "Rejected"].includes(r.status));
  const profileFields = [donor.phone, donor.age, donor.gender, donor.city, donor.address, donor.lastDonation];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  document.getElementById("appContent").innerHTML = `
    <div class="stat-grid">
      <div class="stat-card accent-primary"><div class="label">Donation Count</div><div class="value">${donor.donationCount}</div></div>
      <div class="stat-card ${donor.available ? "accent-success" : ""}"><div class="label">Current Availability</div><div class="value">${donor.available ? "Available" : "Unavailable"}</div></div>
      <div class="stat-card accent-warning"><div class="label">Nearby Requests</div><div class="value">${nearbyRequests.length}</div></div>
      <div class="stat-card"><div class="label">Profile Completion</div><div class="value">${completion}%</div></div>
    </div>
    <div class="card-grid">
      <div class="info-card"><div class="k">Your Blood Group</div><div class="v">${donor.bloodGroup}</div></div>
      <div class="info-card"><div class="k">Availability Status</div><div class="v">${donor.available ? "Available" : "Not Available"}</div></div>
      <div class="info-card"><div class="k">Last Donation</div><div class="v">${donor.lastDonation || "—"}</div></div>
      <div class="info-card"><div class="k">Potential Matches</div><div class="v">${nearbyRequests.length}</div></div>
    </div>
  `;
}

function renderDonorProfile() {
  const donor = getDonorForCurrentUser();
  setPageHeader("My Profile", "Keep your details accurate for faster matching.");
  if (!donor) { document.getElementById("appContent").innerHTML = emptyState("🧑", "Donor profile not found."); return; }

  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <form id="donorProfileForm">
        <div class="form-grid">
          <div class="form-group"><label>Name</label><input type="text" id="pfName" value="${escapeHtml(donor.name)}" required></div>
          <div class="form-group"><label>Email</label><input type="email" id="pfEmail" value="${escapeHtml(donor.email)}" required></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="pfPhone" value="${escapeHtml(donor.phone)}" required></div>
          <div class="form-group"><label>Blood Group</label>
            <select id="pfBloodGroup">${BLOOD_GROUPS.map(bg => `<option ${bg === donor.bloodGroup ? "selected" : ""}>${bg}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Age</label><input type="number" id="pfAge" value="${donor.age || ""}" min="18" max="65"></div>
          <div class="form-group"><label>Gender</label>
            <select id="pfGender">
              ${["Male","Female","Other"].map(g => `<option ${g === donor.gender ? "selected" : ""}>${g}</option>`).join("")}
            </select>
          </div>
          <div class="form-group"><label>City</label><input type="text" id="pfCity" value="${escapeHtml(donor.city)}"></div>
          <div class="form-group"><label>Last Donation Date</label><input type="date" id="pfLastDonation" value="${donor.lastDonation || ""}"></div>
          <div class="form-group full"><label>Address</label><input type="text" id="pfAddress" value="${escapeHtml(donor.address)}"></div>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Changes</button>
      </form>
    </div>
  `;

  document.getElementById("donorProfileForm").addEventListener("submit", e => {
    e.preventDefault();
    donor.name = document.getElementById("pfName").value.trim();
    donor.email = document.getElementById("pfEmail").value.trim();
    donor.phone = document.getElementById("pfPhone").value.trim();
    donor.bloodGroup = document.getElementById("pfBloodGroup").value;
    donor.age = Number(document.getElementById("pfAge").value) || donor.age;
    donor.gender = document.getElementById("pfGender").value;
    donor.city = document.getElementById("pfCity").value.trim();
    donor.lastDonation = document.getElementById("pfLastDonation").value;
    donor.address = document.getElementById("pfAddress").value.trim();
    saveDB();
    showToast("Profile saved.", "success");
  });
}

function renderDonorAvailability() {
  const donor = getDonorForCurrentUser();
  setPageHeader("Availability", "Let hospitals know if you're able to donate right now.");
  if (!donor) { document.getElementById("appContent").innerHTML = emptyState("🧑", "Donor profile not found."); return; }

  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <p>Your current availability status:</p>
      <div class="availability-toggle">
        <div class="toggle-option ${donor.available ? "selected available" : ""}" data-avail="true">✅ Available</div>
        <div class="toggle-option ${!donor.available ? "selected unavailable" : ""}" data-avail="false">🚫 Not Available</div>
      </div>
    </div>
  `;
  document.querySelectorAll("[data-avail]").forEach(el => {
    el.onclick = () => {
      donor.available = el.dataset.avail === "true";
      saveDB();
      showToast("Availability updated.", "success");
      renderDonorAvailability();
    };
  });
}

function renderDonorRequests() {
  const donor = getDonorForCurrentUser();
  setPageHeader("Blood Requests", "Active requests compatible with your blood group.");
  const relevant = donor
    ? DB.requests.filter(r => COMPATIBILITY[donor.bloodGroup] && COMPATIBILITY[donor.bloodGroup].includes(r.bloodGroup) && !["Completed", "Cancelled", "Rejected"].includes(r.status))
    : [];

  let html = `<div class="panel"><div class="panel-header"><h3>Compatible Requests</h3></div>`;
  if (!relevant.length) {
    html += emptyState("📋", "No compatible blood requests right now.");
  } else {
    html += `<div class="table-wrap"><table><thead><tr><th>Request ID</th><th>Blood Group</th><th>Units</th><th>Location</th><th>Urgency</th><th>Status</th></tr></thead><tbody>`;
    relevant.forEach(r => {
      html += `<tr><td>${r.id}</td><td>${r.bloodGroup}</td><td>${r.units}</td><td>${escapeHtml(r.location)}</td><td>${badgeForStatus(r.urgency)}</td><td>${badgeForStatus(r.status)}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }
  html += `</div>`;
  document.getElementById("appContent").innerHTML = html;
}

// ================================================================
// HOSPITAL FUNCTIONS
// ================================================================
function getHospitalForCurrentUser() {
  return DB.hospitals.find(h => h.userId === currentUser.id);
}

function renderHospitalDashboard() {
  const hospital = getHospitalForCurrentUser();
  setPageHeader(`Welcome, ${currentUser.name}`, "Overview of your emergency blood requests.");
  const myRequests = hospital ? DB.requests.filter(r => r.hospitalId === hospital.id) : [];
  const active = myRequests.filter(r => !["Completed", "Cancelled", "Rejected"].includes(r.status)).length;
  const pendingMatches = myRequests.filter(r => r.status === "Matching" || r.status === "Match Requested").length;
  const matched = myRequests.filter(r => r.status === "Accepted").length;
  const completed = myRequests.filter(r => r.status === "Completed").length;

  document.getElementById("appContent").innerHTML = `
    <div class="stat-grid">
      <div class="stat-card accent-primary"><div class="label">Active Requests</div><div class="value">${active}</div></div>
      <div class="stat-card accent-warning"><div class="label">Pending Matches</div><div class="value">${pendingMatches}</div></div>
      <div class="stat-card accent-success"><div class="label">Matched Requests</div><div class="value">${matched}</div></div>
      <div class="stat-card"><div class="label">Completed Requests</div><div class="value">${completed}</div></div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Recent Requests</h3><button class="btn btn-primary btn-sm" id="quickCreateReqBtn">Create Request</button></div>
      ${myRequests.length ? tableForRequests(myRequests.slice(-5).reverse()) : emptyState("📋", "No requests yet. Create your first emergency blood request.")}
    </div>
  `;
  document.getElementById("quickCreateReqBtn").onclick = () => navigateTab("createRequest");
  bindRequestRowActions();
}

function tableForRequests(list, showHospital = false) {
  return `<div class="table-wrap"><table><thead><tr>
    <th>Request ID</th>${showHospital ? "<th>Hospital</th>" : ""}<th>Blood Group</th><th>Units</th><th>Urgency</th><th>Status</th><th>Date</th><th>Actions</th>
  </tr></thead><tbody>
  ${list.map(r => {
    const hosp = DB.hospitals.find(h => h.id === r.hospitalId);
    return `<tr>
      <td>${r.id}</td>
      ${showHospital ? `<td>${escapeHtml(hosp ? hosp.name : "—")}</td>` : ""}
      <td>${r.bloodGroup}</td><td>${r.units}</td><td>${badgeForStatus(r.urgency)}</td><td>${badgeForStatus(r.status)}</td>
      <td>${r.createdAt}</td>
      <td class="table-actions"><button class="btn btn-outline btn-sm" data-view-request="${r.id}">View</button></td>
    </tr>`;
  }).join("")}
  </tbody></table></div>`;
}

function bindRequestRowActions() {
  document.querySelectorAll("[data-view-request]").forEach(btn => {
    btn.onclick = () => openRequestDetailModal(btn.dataset.viewRequest);
  });
}

function renderCreateRequestForm() {
  setPageHeader("Create Emergency Request", "Submit a new blood request for matching.");
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <form id="createRequestForm">
        <div class="form-grid">
          <div class="form-group"><label>Patient Name</label><input type="text" id="reqPatientName" required></div>
          <div class="form-group"><label>Blood Group</label>
            <select id="reqBloodGroup" required><option value="">Select</option>${BLOOD_GROUPS.map(bg => `<option>${bg}</option>`).join("")}</select>
          </div>
          <div class="form-group"><label>Units Required</label><input type="number" id="reqUnits" min="1" required></div>
          <div class="form-group"><label>Hospital Location</label><input type="text" id="reqLocation" required></div>
          <div class="form-group"><label>Required By</label><input type="date" id="reqRequiredBy" required></div>
          <div class="form-group"><label>Urgency</label>
            <select id="reqUrgency" required>
              <option value="">Select</option><option>Critical</option><option>High</option><option>Normal</option>
            </select>
          </div>
          <div class="form-group full"><label>Additional Notes</label><textarea id="reqNotes"></textarea></div>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Submit Request</button>
      </form>
    </div>
    <div id="requestResultArea"></div>
  `;

  document.getElementById("createRequestForm").addEventListener("submit", e => {
    e.preventDefault();
    const hospital = getHospitalForCurrentUser();
    const patientName = document.getElementById("reqPatientName").value.trim();
    const bloodGroup = document.getElementById("reqBloodGroup").value;
    const units = Number(document.getElementById("reqUnits").value);
    const location = document.getElementById("reqLocation").value.trim();
    const requiredBy = document.getElementById("reqRequiredBy").value;
    const urgency = document.getElementById("reqUrgency").value;
    const notes = document.getElementById("reqNotes").value.trim();

    if (!patientName || !bloodGroup || !units || units < 1 || !location || !urgency) {
      showToast("Please fill in all required fields correctly.", "warning");
      return;
    }
    if (!hospital) { showToast("Hospital profile not found.", "danger"); return; }

    const newRequest = {
      id: nextId("REQ", DB.requests),
      hospitalId: hospital.id, patientName, bloodGroup, units, location, requiredBy, urgency, notes,
      status: "Pending", createdAt: todayISO()
    };
    DB.requests.push(newRequest);
    saveDB();
    createNotification(currentUser.id, "Request Created", `Your blood request ${newRequest.id} has been created.`, "info");

    const results = runMatchingForRequest(newRequest);
    if (results.length) {
      createNotification(currentUser.id, "Potential Match Found", `A potential blood match has been found for ${newRequest.id}.`, "success");
    }
    showToast("Request created successfully.", "success");

    document.getElementById("requestResultArea").innerHTML = renderRequestResultBlock(newRequest, results);
    bindMatchRequestButtons(newRequest.id);
    document.getElementById("createRequestForm").reset();
  });
}

function renderRequestResultBlock(request, results) {
  return `
    <div class="panel">
      <div class="panel-header"><h3>Request ${request.id}</h3>${badgeForStatus(request.status)}</div>
      <div class="card-grid" style="margin-bottom:16px;">
        <div class="info-card"><div class="k">Blood Group</div><div class="v">${request.bloodGroup}</div></div>
        <div class="info-card"><div class="k">Units Required</div><div class="v">${request.units}</div></div>
        <div class="info-card"><div class="k">Urgency</div><div class="v">${request.urgency}</div></div>
        <div class="info-card"><div class="k">Location</div><div class="v">${escapeHtml(request.location)}</div></div>
      </div>
      ${statusTimelineHtml(request.status)}
      <h4 style="margin-top:20px;">Potential Matches</h4>
      ${results.length ? results.map(m => matchCardHtml(m, request.id)).join("") : emptyState("🔎", "No compatible blood is currently available in the demo inventory.")}
    </div>
  `;
}

function matchCardHtml(m, requestId) {
  return `
    <div class="match-card">
      <div class="match-info">
        <strong>${escapeHtml(m.sourceName)}</strong>
        <span class="muted">${m.source} · ${escapeHtml(m.city || "—")}</span>
        <span>Blood Group: <strong>${m.bloodGroup}</strong> &nbsp; Available: <strong>${m.availableUnits}</strong></span>
        <span>${badgeForStatus(m.compatibility === "Exact" ? "Available" : "Low Stock").replace(m.compatibility === "Exact" ? "Available" : "Low Stock", m.compatibility)} ${m.sameLocation ? '<span class="badge badge-neutral">Same Location</span>' : ""}</span>
      </div>
      <button class="btn btn-primary btn-sm" data-request-match="${requestId}" data-source="${escapeHtml(m.sourceName)}">Request Match</button>
    </div>
  `;
}

function bindMatchRequestButtons(requestId) {
  document.querySelectorAll(`[data-request-match="${requestId}"]`).forEach(btn => {
    btn.onclick = () => {
      const request = DB.requests.find(r => r.id === requestId);
      if (!request) return;
      request.status = "Match Requested";
      const match = {
        id: nextId("MAT", DB.matches),
        requestId: request.id, source: btn.dataset.source, status: "Match Requested", createdAt: todayISO()
      };
      DB.matches.push(match);
      saveDB();
      createNotification(currentUser.id, "Match Requested", `Match requested for ${request.id} with ${btn.dataset.source}.`, "info");
      showToast("Match requested.", "success");
      btn.disabled = true;
      btn.textContent = "Requested";
      const badgeEl = btn.closest(".panel").querySelector(".panel-header .badge");
      if (badgeEl) badgeEl.outerHTML = badgeForStatus(request.status);
    };
  });
}

function renderHospitalRequests() {
  const hospital = getHospitalForCurrentUser();
  setPageHeader("My Requests", "Track every request you've submitted.");
  const myRequests = hospital ? DB.requests.filter(r => r.hospitalId === hospital.id) : [];

  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="filter-bar">
        <select id="filterStatus"><option value="">All Statuses</option>${["Pending","Matching","Match Requested","Accepted","Completed","Rejected","Cancelled"].map(s => `<option>${s}</option>`).join("")}</select>
        <select id="filterUrgency"><option value="">All Urgency</option><option>Critical</option><option>High</option><option>Normal</option></select>
        <input type="text" id="filterSearch" placeholder="Search by ID or blood group">
      </div>
      <div id="hospitalRequestsTableArea">${myRequests.length ? tableForRequests(myRequests.slice().reverse()) : emptyState("📋", "No requests found.")}</div>
    </div>
  `;
  bindRequestRowActions();

  function applyFilters() {
    const status = document.getElementById("filterStatus").value;
    const urgency = document.getElementById("filterUrgency").value;
    const search = document.getElementById("filterSearch").value.toLowerCase();
    const filtered = myRequests.filter(r =>
      (!status || r.status === status) &&
      (!urgency || r.urgency === urgency) &&
      (!search || r.id.toLowerCase().includes(search) || r.bloodGroup.toLowerCase().includes(search))
    );
    document.getElementById("hospitalRequestsTableArea").innerHTML = filtered.length ? tableForRequests(filtered.slice().reverse()) : emptyState("🔍", "No requests match your filters.");
    bindRequestRowActions();
  }
  ["filterStatus", "filterUrgency", "filterSearch"].forEach(id => document.getElementById(id).addEventListener("input", applyFilters));
}

function renderSearchBlood() {
  setPageHeader("Search Blood", "Look up compatible blood across banks and donors.");
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="filter-bar">
        <select id="searchBg"><option value="">Select Blood Group</option>${BLOOD_GROUPS.map(bg => `<option>${bg}</option>`).join("")}</select>
        <input type="text" id="searchLoc" placeholder="Location (optional)">
        <button class="btn btn-primary" id="runSearchBtn">Search</button>
      </div>
      <div id="searchResultsArea"></div>
    </div>
  `;
  document.getElementById("runSearchBtn").onclick = () => {
    const bg = document.getElementById("searchBg").value;
    const loc = document.getElementById("searchLoc").value.trim();
    if (!bg) { showToast("Please select a blood group.", "warning"); return; }
    const results = findPotentialMatches(bg, loc);
    document.getElementById("searchResultsArea").innerHTML = results.length
      ? results.map(m => matchCardHtml(m, "SEARCH")).join("").replace(/data-request-match="SEARCH"/g, "disabled")
      : emptyState("🔎", "No compatible blood is currently available in the demo inventory.");
  };
}

function renderHospitalMatches() {
  const hospital = getHospitalForCurrentUser();
  setPageHeader("Matches", "All matches associated with your requests.");
  const myRequests = hospital ? DB.requests.filter(r => r.hospitalId === hospital.id) : [];
  const myMatches = DB.matches.filter(m => myRequests.some(r => r.id === m.requestId));

  let html = `<div class="panel"><div class="panel-header"><h3>Match History</h3></div>`;
  if (!myMatches.length) {
    html += emptyState("🤝", "No matches yet.");
  } else {
    html += `<div class="table-wrap"><table><thead><tr><th>Match ID</th><th>Request</th><th>Source</th><th>Status</th><th>Date</th></tr></thead><tbody>`;
    myMatches.slice().reverse().forEach(m => {
      html += `<tr><td>${m.id}</td><td>${m.requestId}</td><td>${escapeHtml(m.source)}</td><td>${badgeForStatus(m.status)}</td><td>${m.createdAt}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }
  html += `</div>`;
  document.getElementById("appContent").innerHTML = html;
}

function renderHospitalProfile() {
  const hospital = getHospitalForCurrentUser();
  setPageHeader("Profile", "Your hospital's registration details.");
  if (!hospital) { document.getElementById("appContent").innerHTML = emptyState("🏥", "Hospital profile not found."); return; }
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <form id="hospitalProfileForm">
        <div class="form-grid">
          <div class="form-group"><label>Hospital Name</label><input type="text" id="hpName" value="${escapeHtml(hospital.name)}" required></div>
          <div class="form-group"><label>License / Registration ID</label><input type="text" id="hpLicense" value="${escapeHtml(hospital.license || "")}"></div>
          <div class="form-group"><label>City</label><input type="text" id="hpCity" value="${escapeHtml(hospital.city || "")}"></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="hpPhone" value="${escapeHtml(hospital.phone || "")}"></div>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Changes</button>
      </form>
    </div>
  `;
  document.getElementById("hospitalProfileForm").addEventListener("submit", e => {
    e.preventDefault();
    hospital.name = document.getElementById("hpName").value.trim();
    hospital.license = document.getElementById("hpLicense").value.trim();
    hospital.city = document.getElementById("hpCity").value.trim();
    hospital.phone = document.getElementById("hpPhone").value.trim();
    saveDB();
    showToast("Profile saved.", "success");
  });
}

function openRequestDetailModal(requestId) {
  const request = DB.requests.find(r => r.id === requestId);
  if (!request) return;
  const hospital = DB.hospitals.find(h => h.id === request.hospitalId);
  const results = findPotentialMatches(request.bloodGroup, request.location);
  openGenericModal(`Request ${request.id}`, `
    <div class="card-grid" style="margin-bottom:16px;">
      <div class="info-card"><div class="k">Hospital</div><div class="v">${escapeHtml(hospital ? hospital.name : "—")}</div></div>
      <div class="info-card"><div class="k">Patient</div><div class="v">${escapeHtml(request.patientName || "—")}</div></div>
      <div class="info-card"><div class="k">Blood Group</div><div class="v">${request.bloodGroup}</div></div>
      <div class="info-card"><div class="k">Units</div><div class="v">${request.units}</div></div>
      <div class="info-card"><div class="k">Urgency</div><div class="v">${request.urgency}</div></div>
      <div class="info-card"><div class="k">Location</div><div class="v">${escapeHtml(request.location)}</div></div>
    </div>
    ${statusTimelineHtml(request.status)}
    <h4 style="margin-top:16px;">Potential Matches</h4>
    ${results.length ? results.slice(0, 4).map(m => `<div class="match-card"><div class="match-info"><strong>${escapeHtml(m.sourceName)}</strong><span class="muted">${m.source} · ${escapeHtml(m.city || "—")} · ${m.bloodGroup} · ${m.compatibility}</span></div></div>`).join("") : emptyState("🔎", "No compatible blood currently available.")}
  `);
}

// ================================================================
// BLOOD BANK FUNCTIONS
// ================================================================
function getBankForCurrentUser() {
  return DB.bloodBanks.find(b => b.userId === currentUser.id);
}

function inventoryStatus(inv) {
  if (inv.available <= 0) return "Out of Stock";
  if (inv.available <= 5) return "Low Stock";
  return "Available";
}

function renderBloodBankDashboard() {
  const bank = getBankForCurrentUser();
  setPageHeader(`Welcome, ${currentUser.name}`, "Inventory and request overview.");
  const myInv = bank ? DB.inventory.filter(i => i.bloodBankId === bank.id) : [];
  const totalUnits = myInv.reduce((sum, i) => sum + i.available, 0);
  const lowStock = myInv.filter(i => inventoryStatus(i) !== "Available").length;
  const incoming = DB.requests.filter(r => r.status === "Matching" || r.status === "Match Requested");
  const processed = DB.requests.filter(r => r.status === "Completed" || r.status === "Accepted");

  document.getElementById("appContent").innerHTML = `
    <div class="stat-grid">
      <div class="stat-card accent-primary"><div class="label">Total Units</div><div class="value">${totalUnits}</div></div>
      <div class="stat-card accent-warning"><div class="label">Low Stock Groups</div><div class="value">${lowStock}</div></div>
      <div class="stat-card"><div class="label">Pending Requests</div><div class="value">${incoming.length}</div></div>
      <div class="stat-card accent-success"><div class="label">Processed Requests</div><div class="value">${processed.length}</div></div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Inventory Snapshot</h3><button class="btn btn-primary btn-sm" id="goInventoryBtn">Manage Inventory</button></div>
      ${myInv.length ? inventoryTableHtml(myInv) : emptyState("🧪", "No inventory records yet.")}
    </div>
  `;
  document.getElementById("goInventoryBtn").onclick = () => navigateTab("inventory");
  bindInventoryActions();
}

function inventoryTableHtml(list) {
  return `<div class="table-wrap"><table><thead><tr>
    <th>Blood Group</th><th>Available</th><th>Reserved</th><th>Status</th><th>Last Updated</th><th>Actions</th>
  </tr></thead><tbody>
  ${list.map(inv => `<tr>
      <td><strong>${inv.bloodGroup}</strong></td><td>${inv.available}</td><td>${inv.reserved}</td>
      <td>${badgeForStatus(inventoryStatus(inv))}</td><td>${inv.lastUpdated}</td>
      <td class="table-actions">
        <button class="btn btn-outline btn-sm" data-inv-update="${inv.id}">Update</button>
      </td>
    </tr>`).join("")}
  </tbody></table></div>`;
}

function bindInventoryActions() {
  document.querySelectorAll("[data-inv-update]").forEach(btn => {
    btn.onclick = () => openUpdateInventoryModal(btn.dataset.invUpdate);
  });
}

function renderInventoryPage() {
  const bank = getBankForCurrentUser();
  setPageHeader("Inventory", "Manage available blood units.");
  const myInv = bank ? DB.inventory.filter(i => i.bloodBankId === bank.id) : [];

  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3>Blood Inventory</h3><button class="btn btn-primary btn-sm" id="addInventoryBtn">Add Blood Units</button></div>
      ${myInv.length ? inventoryTableHtml(myInv) : emptyState("🧪", "No inventory records yet. Add blood units to get started.")}
    </div>
  `;
  bindInventoryActions();
  document.getElementById("addInventoryBtn").onclick = () => openUpdateInventoryModal(null);
}

function openUpdateInventoryModal(invId) {
  const bank = getBankForCurrentUser();
  const inv = invId ? DB.inventory.find(i => i.id === invId) : null;
  openGenericModal(inv ? "Update Inventory" : "Add Blood Units", `
    <form id="invForm">
      <div class="form-group">
        <label>Blood Group</label>
        <select id="invBloodGroup" ${inv ? "disabled" : ""}>
          ${BLOOD_GROUPS.map(bg => `<option ${inv && inv.bloodGroup === bg ? "selected" : ""}>${bg}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Operation</label>
        <select id="invOperation">
          <option value="add">Add Units</option>
          <option value="remove">Remove Units</option>
          ${inv ? '<option value="set">Set Exact Value</option>' : ""}
        </select>
      </div>
      <div class="form-group"><label>Quantity</label><input type="number" id="invQuantity" min="1" required></div>
      <button type="submit" class="btn btn-primary btn-block">Save</button>
    </form>
  `);

  document.getElementById("invForm").addEventListener("submit", e => {
    e.preventDefault();
    const bg = document.getElementById("invBloodGroup").value;
    const op = document.getElementById("invOperation").value;
    const qty = Number(document.getElementById("invQuantity").value);
    if (!qty || qty < 1) { showToast("Quantity must be greater than 0.", "warning"); return; }

    let record = inv;
    if (!record) {
      record = DB.inventory.find(i => i.bloodBankId === bank.id && i.bloodGroup === bg);
    }
    if (!record) {
      record = { id: nextId("INV", DB.inventory), bloodBankId: bank.id, bloodGroup: bg, available: 0, reserved: 0, lastUpdated: todayISO() };
      DB.inventory.push(record);
    }

    if (op === "add") record.available += qty;
    else if (op === "remove") record.available = Math.max(0, record.available - qty);
    else if (op === "set") record.available = qty;

    record.lastUpdated = todayISO();
    saveDB();
    closeModal("genericModal");
    showToast("Inventory updated.", "success");
    if (inventoryStatus(record) === "Low Stock" || inventoryStatus(record) === "Out of Stock") {
      createNotification(currentUser.id, "Low Stock Alert", `Inventory for ${record.bloodGroup} is running low.`, "warning");
    }
    navigateTab("inventory");
  });
}

function renderBloodBankRequests() {
  setPageHeader("Blood Requests", "Incoming requests you can respond to.");
  const relevant = DB.requests.filter(r => !["Completed", "Cancelled", "Rejected"].includes(r.status));
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3>Incoming Requests</h3></div>
      ${relevant.length ? bankRequestsTableHtml(relevant) : emptyState("📋", "No active requests.")}
    </div>
  `;
  bindBankRequestActions();
}

function bankRequestsTableHtml(list) {
  return `<div class="table-wrap"><table><thead><tr>
    <th>Request ID</th><th>Hospital</th><th>Blood Group</th><th>Units</th><th>Urgency</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>
  ${list.slice().reverse().map(r => {
    const hosp = DB.hospitals.find(h => h.id === r.hospitalId);
    return `<tr>
      <td>${r.id}</td><td>${escapeHtml(hosp ? hosp.name : "—")}</td><td>${r.bloodGroup}</td><td>${r.units}</td>
      <td>${badgeForStatus(r.urgency)}</td><td>${badgeForStatus(r.status)}</td>
      <td class="table-actions">
        <button class="btn btn-success btn-sm" data-accept-req="${r.id}">Accept</button>
        <button class="btn btn-outline btn-sm" data-reject-req="${r.id}">Reject</button>
      </td>
    </tr>`;
  }).join("")}
  </tbody></table></div>`;
}

function bindBankRequestActions() {
  document.querySelectorAll("[data-accept-req]").forEach(btn => {
    btn.onclick = () => {
      const req = DB.requests.find(r => r.id === btn.dataset.acceptReq);
      if (!req) return;
      req.status = "Accepted";
      saveDB();
      const hospUser = DB.users.find(u => {
        const h = DB.hospitals.find(hh => hh.id === req.hospitalId);
        return h && h.userId === u.id;
      });
      if (hospUser) createNotification(hospUser.id, "Blood Bank Responded", `Blood Bank ${currentUser.name} has responded to your request ${req.id}.`, "success");
      showToast("Request accepted.", "success");
      renderBloodBankRequests();
    };
  });
  document.querySelectorAll("[data-reject-req]").forEach(btn => {
    btn.onclick = () => {
      confirmAction("Reject this blood request?", () => {
        const req = DB.requests.find(r => r.id === btn.dataset.rejectReq);
        if (!req) return;
        req.status = "Rejected";
        saveDB();
        showToast("Request rejected.", "info");
        renderBloodBankRequests();
      });
    };
  });
}

function renderBloodBankMatches() {
  setPageHeader("Matches", "Match requests directed to blood banks.");
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      ${DB.matches.length ? `<div class="table-wrap"><table><thead><tr><th>Match ID</th><th>Request</th><th>Source</th><th>Status</th><th>Date</th></tr></thead><tbody>
        ${DB.matches.slice().reverse().map(m => `<tr><td>${m.id}</td><td>${m.requestId}</td><td>${escapeHtml(m.source)}</td><td>${badgeForStatus(m.status)}</td><td>${m.createdAt}</td></tr>`).join("")}
      </tbody></table></div>` : emptyState("🤝", "No matches yet.")}
    </div>
  `;
}

function renderBloodBankProfile() {
  const bank = getBankForCurrentUser();
  setPageHeader("Profile", "Your blood bank's registration details.");
  if (!bank) { document.getElementById("appContent").innerHTML = emptyState("🧪", "Blood bank profile not found."); return; }
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <form id="bankProfileForm">
        <div class="form-grid">
          <div class="form-group"><label>Blood Bank Name</label><input type="text" id="bpName" value="${escapeHtml(bank.name)}" required></div>
          <div class="form-group"><label>Registration ID</label><input type="text" id="bpReg" value="${escapeHtml(bank.registrationId || "")}"></div>
          <div class="form-group"><label>City</label><input type="text" id="bpCity" value="${escapeHtml(bank.city || "")}"></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="bpPhone" value="${escapeHtml(bank.phone || "")}"></div>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Changes</button>
      </form>
    </div>
  `;
  document.getElementById("bankProfileForm").addEventListener("submit", e => {
    e.preventDefault();
    bank.name = document.getElementById("bpName").value.trim();
    bank.registrationId = document.getElementById("bpReg").value.trim();
    bank.city = document.getElementById("bpCity").value.trim();
    bank.phone = document.getElementById("bpPhone").value.trim();
    saveDB();
    showToast("Profile saved.", "success");
  });
}

// ================================================================
// ADMIN FUNCTIONS
// ================================================================
function renderAdminDashboard() {
  setPageHeader("Admin Dashboard", "System-wide overview.");
  const totalUsers = DB.users.length;
  const donors = DB.users.filter(u => u.role === "donor").length;
  const hospitals = DB.users.filter(u => u.role === "hospital").length;
  const bloodBanks = DB.users.filter(u => u.role === "bloodbank").length;
  const active = DB.requests.filter(r => !["Completed", "Cancelled", "Rejected"].includes(r.status)).length;
  const completed = DB.requests.filter(r => r.status === "Completed").length;
  const potentialMatches = DB.matches.length;

  document.getElementById("appContent").innerHTML = `
    <div class="stat-grid">
      <div class="stat-card accent-primary"><div class="label">Total Users</div><div class="value">${totalUsers}</div></div>
      <div class="stat-card"><div class="label">Donors</div><div class="value">${donors}</div></div>
      <div class="stat-card"><div class="label">Hospitals</div><div class="value">${hospitals}</div></div>
      <div class="stat-card"><div class="label">Blood Banks</div><div class="value">${bloodBanks}</div></div>
      <div class="stat-card accent-warning"><div class="label">Active Requests</div><div class="value">${active}</div></div>
      <div class="stat-card accent-success"><div class="label">Completed Requests</div><div class="value">${completed}</div></div>
      <div class="stat-card"><div class="label">Potential Matches</div><div class="value">${potentialMatches}</div></div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Recent Requests</h3></div>
      ${DB.requests.length ? tableForRequests(DB.requests.slice(-6).reverse(), true) : emptyState("📋", "No requests yet.")}
    </div>
  `;
  bindRequestRowActions();
}

function renderAdminUsers() {
  setPageHeader("Users", "All registered users across the system.");
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="filter-bar">
        <input type="text" id="userSearch" placeholder="Search by name or email">
        <select id="userRoleFilter"><option value="">All Roles</option><option value="donor">Donor</option><option value="hospital">Hospital</option><option value="bloodbank">Blood Bank</option><option value="admin">Admin</option></select>
      </div>
      <div id="userTableArea"></div>
    </div>
  `;
  renderUserTable(DB.users);
  document.getElementById("userSearch").addEventListener("input", applyUserFilters);
  document.getElementById("userRoleFilter").addEventListener("change", applyUserFilters);

  function applyUserFilters() {
    const q = document.getElementById("userSearch").value.toLowerCase();
    const role = document.getElementById("userRoleFilter").value;
    const filtered = DB.users.filter(u =>
      (!role || u.role === role) &&
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
    renderUserTable(filtered);
  }
}

function renderUserTable(list) {
  const html = list.length ? `<div class="table-wrap"><table><thead><tr>
    <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
  </tr></thead><tbody>
    ${list.map(u => `<tr>
      <td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td style="text-transform:capitalize">${u.role}</td>
      <td>${badgeForStatus(u.status)}</td><td>${u.joined}</td>
      <td class="table-actions">
        <button class="btn btn-outline btn-sm" data-toggle-status="${u.id}">${u.status === "active" ? "Suspend" : "Activate"}</button>
      </td>
    </tr>`).join("")}
  </tbody></table></div>` : emptyState("👥", "No users found.");
  document.getElementById("userTableArea").innerHTML = html;

  document.querySelectorAll("[data-toggle-status]").forEach(btn => {
    btn.onclick = () => {
      const u = DB.users.find(x => x.id === btn.dataset.toggleStatus);
      if (!u) return;
      u.status = u.status === "active" ? "suspended" : "active";
      saveDB();
      showToast(`User ${u.status === "active" ? "activated" : "suspended"}.`, "success");
      renderUserTable(DB.users);
    };
  });
}

function renderAdminHospitals() {
  setPageHeader("Hospitals", "All registered hospitals.");
  document.getElementById("appContent").innerHTML = `<div class="panel">
    ${DB.hospitals.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>License</th><th>City</th><th>Phone</th></tr></thead><tbody>
      ${DB.hospitals.map(h => `<tr><td>${escapeHtml(h.name)}</td><td>${escapeHtml(h.license || "—")}</td><td>${escapeHtml(h.city || "—")}</td><td>${escapeHtml(h.phone || "—")}</td></tr>`).join("")}
    </tbody></table></div>` : emptyState("🏥", "No hospitals registered.")}
  </div>`;
}

function renderAdminBloodBanks() {
  setPageHeader("Blood Banks", "All registered blood banks.");
  document.getElementById("appContent").innerHTML = `<div class="panel">
    ${DB.bloodBanks.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Registration ID</th><th>City</th><th>Phone</th></tr></thead><tbody>
      ${DB.bloodBanks.map(b => `<tr><td>${escapeHtml(b.name)}</td><td>${escapeHtml(b.registrationId || "—")}</td><td>${escapeHtml(b.city || "—")}</td><td>${escapeHtml(b.phone || "—")}</td></tr>`).join("")}
    </tbody></table></div>` : emptyState("🧪", "No blood banks registered.")}
  </div>`;
}

function renderAdminDonors() {
  setPageHeader("Donors", "All registered donors.");
  document.getElementById("appContent").innerHTML = `<div class="panel">
    ${DB.donors.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Blood Group</th><th>City</th><th>Availability</th><th>Donations</th></tr></thead><tbody>
      ${DB.donors.map(d => `<tr><td>${escapeHtml(d.name)}</td><td>${d.bloodGroup}</td><td>${escapeHtml(d.city || "—")}</td><td>${badgeForStatus(d.available ? "Available" : "Out of Stock")}</td><td>${d.donationCount}</td></tr>`).join("")}
    </tbody></table></div>` : emptyState("🧑", "No donors registered.")}
  </div>`;
}

function renderAdminRequests() {
  setPageHeader("Requests", "All blood requests in the system.");
  document.getElementById("appContent").innerHTML = `<div class="panel">
    ${DB.requests.length ? tableForRequests(DB.requests.slice().reverse(), true) : emptyState("📋", "No requests yet.")}
  </div>`;
  bindRequestRowActions();
}

// ================================================================
// SETTINGS (shared: dark mode, reset demo data)
// ================================================================
function renderSettingsPage() {
  setPageHeader("Settings", "Preferences and demo data controls.");
  document.getElementById("appContent").innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3>Appearance</h3></div>
      <button class="btn btn-outline" id="settingsDarkModeBtn">Toggle Dark Mode</button>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Demo Data</h3></div>
      <p>Reset all data in this prototype back to its original demo state. This clears any changes you've made.</p>
      <button class="btn btn-danger" id="resetDemoBtn">Reset Demo Data</button>
    </div>
  `;
  document.getElementById("settingsDarkModeBtn").onclick = toggleDarkMode;
  document.getElementById("resetDemoBtn").onclick = () => {
    confirmAction("This will erase all changes and restore original demo data. Continue?", () => {
      resetDemoData();
      showToast("Demo data has been reset.", "success");
      handleLogout();
    });
  };
}

// ================================================================
// DARK MODE
// ================================================================
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  setDarkMode(!isDark);
}
function setDarkMode(enabled) {
  document.documentElement.setAttribute("data-theme", enabled ? "dark" : "light");
  localStorage.setItem(STORAGE_PREFIX + "theme", enabled ? "dark" : "light");
  ["darkModeToggle", "darkModeToggle2"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = enabled ? "☀️" : "🌙";
  });
}
function initDarkMode() {
  const saved = localStorage.getItem(STORAGE_PREFIX + "theme");
  setDarkMode(saved === "dark");
}

// ================================================================
// LANDING PAGE: STATS + AVAILABILITY CHECKER
// ================================================================
function renderHeroStats() {
  const stats = [
    { label: "Registered Donors", value: DB.donors.length },
    { label: "Blood Banks", value: DB.bloodBanks.length },
    { label: "Hospitals", value: DB.hospitals.length },
    { label: "Successful Matches", value: DB.requests.filter(r => r.status === "Completed").length + DB.matches.length }
  ];
  document.getElementById("heroStats").innerHTML = stats.map(s => `
    <div><div class="hero-stat-num">${s.value}</div><div class="hero-stat-label">${s.label}</div></div>
  `).join("");
}

function renderAvailabilityResults(bloodGroup, location) {
  const container = document.getElementById("availabilityResults");
  let groups = bloodGroup ? [bloodGroup] : BLOOD_GROUPS;
  const cards = groups.map(bg => {
    let total = DB.inventory
      .filter(i => i.bloodGroup === bg && (!location || (DB.bloodBanks.find(b => b.id === i.bloodBankId) || {}).city?.toLowerCase().includes(location.toLowerCase())))
      .reduce((sum, i) => sum + i.available, 0);
    return { bg, total };
  });
  if (!cards.some(c => c.total > 0) && location) {
    container.innerHTML = emptyState("🔎", `No availability found for "${location}" in the demo inventory.`);
    return;
  }
  container.innerHTML = cards.map(c => `
    <div class="avail-card"><div class="bg">${c.bg}</div><div class="units">Available Units: ${c.total}</div></div>
  `).join("");
}

function handleAvailabilityCheck(e) {
  e.preventDefault();
  const bg = document.getElementById("availBloodGroup").value;
  const loc = document.getElementById("availLocation").value.trim();
  renderAvailabilityResults(bg, loc);
}

// ================================================================
// EVENT BINDING / INIT
// ================================================================
function bindStaticEvents() {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegister);
  document.getElementById("availabilityForm").addEventListener("submit", handleAvailabilityCheck);
  document.getElementById("logoutBtn").addEventListener("click", handleLogout);

  document.getElementById("navLoginBtn").addEventListener("click", () => showView("loginView"));
  document.getElementById("findBloodBtn").addEventListener("click", () => document.getElementById("availability").scrollIntoView({ behavior: "smooth" }));
  document.getElementById("becomeDonorBtn").addEventListener("click", () => { openModal("registerModal"); document.getElementById("regRole").value = "donor"; toggleRoleFields("donor"); });
  document.getElementById("showRegisterLink").addEventListener("click", e => { e.preventDefault(); openModal("registerModal"); });
  document.getElementById("forgotPasswordLink").addEventListener("click", e => {
    e.preventDefault();
    showToast("Password reset is simulated in this prototype. Use the demo credentials shown below.", "info");
  });

  document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.back)));

  document.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.add("hidden"); });
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay").forEach(o => o.classList.add("hidden"));
  });

  document.getElementById("regRole").addEventListener("change", e => toggleRoleFields(e.target.value));

  document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
  document.getElementById("darkModeToggle2").addEventListener("click", toggleDarkMode);

  document.getElementById("hamburgerBtn").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
  document.getElementById("sidebarOpenBtn").addEventListener("click", () => document.getElementById("sidebar").classList.add("open"));
  document.getElementById("sidebarCloseBtn").addEventListener("click", () => document.getElementById("sidebar").classList.remove("open"));
  document.getElementById("notifBellBtn").addEventListener("click", openNotifPanel);
}

function toggleRoleFields(role) {
  document.getElementById("regDonorFields").classList.toggle("hidden", role !== "donor");
  document.getElementById("regHospitalFields").classList.toggle("hidden", role !== "hospital");
  document.getElementById("regBloodBankFields").classList.toggle("hidden", role !== "bloodbank");
}

function init() {
  try {
    loadDB();
  } catch (e) {
    console.error("Failed to load data, starting fresh.", e);
    DB = buildDemoData();
  }
  initDarkMode();
  bindStaticEvents();
  renderHeroStats();
  renderAvailabilityResults("", "");

  const restored = tryRestoreSession();
  if (!restored) {
    showView("landingView");
  }
}

document.addEventListener("DOMContentLoaded", init);

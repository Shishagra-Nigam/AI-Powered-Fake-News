// Paytm Balance & History Interactive Application Logic

let currentPin = '';
let isBalanceHidden = false;
let currentBankName = 'HDFC Bank';
let currentBankAcc = '5820';

document.addEventListener('DOMContentLoaded', () => {
  // Live Clock Update for Phone Header
  updateClock();
  setInterval(updateClock, 1000);

  // Trigger balance count up animation
  animateCountUp(5000);

  // Event Listeners for UI Controls
  setupEventListeners();
});

function updateClock() {
  const statusTime = document.getElementById('statusTime');
  if (statusTime) {
    statusTime.textContent = '17:31';
  }
}

// Balance Count-Up Animation
function animateCountUp(targetAmount) {
  const balanceEl = document.getElementById('hdfcBalanceDisplay');
  const totalBalEl = document.getElementById('totalBalanceAmount');
  if (!balanceEl) return;

  let current = 0;
  const duration = 1000; // ms
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = targetAmount / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetAmount) {
      current = targetAmount;
      clearInterval(timer);
    }
    const formatted = '₹' + Math.floor(current).toLocaleString('en-IN');
    if (!isBalanceHidden) {
      balanceEl.textContent = formatted;
      if (totalBalEl) totalBalEl.textContent = formatted + '.00';
    }
  }, stepTime);
}

// Setup Event Listeners
function setupEventListeners() {
  // Toggle Phone Frame vs Desktop Full Screen
  const toggleFrameBtn = document.getElementById('toggleFrameBtn');
  const phoneFrame = document.getElementById('phoneFrame');
  if (toggleFrameBtn && phoneFrame) {
    toggleFrameBtn.addEventListener('click', () => {
      phoneFrame.classList.toggle('full-screen');
      const isFull = phoneFrame.classList.contains('full-screen');
      toggleFrameBtn.innerHTML = isFull 
        ? '<i class="fa-solid fa-mobile-screen"></i> Phone View' 
        : '<i class="fa-solid fa-expand"></i> Full Screen';
    });
  }

  // Toggle Dark Theme
  const toggleDarkBtn = document.getElementById('toggleDarkBtn');
  if (toggleDarkBtn) {
    toggleDarkBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      toggleDarkBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i> Light Mode'
        : '<i class="fa-solid fa-moon"></i> Dark Mode';
    });
  }

  // Refresh Balance Button
  const refreshBtn = document.getElementById('refreshBalanceBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      animateCountUp(5000);
      showToast('HDFC Bank Balance refreshed: ₹5,000.00');
    });
  }

  // Toggle Balance Visibility
  const toggleBalBtn = document.getElementById('toggleBalVisibilityBtn');
  const balanceEl = document.getElementById('hdfcBalanceDisplay');
  const eyeIcon = document.getElementById('eyeIcon');
  if (toggleBalBtn && balanceEl) {
    toggleBalBtn.addEventListener('click', () => {
      isBalanceHidden = !isBalanceHidden;
      if (isBalanceHidden) {
        balanceEl.textContent = '••••••••';
        eyeIcon.className = 'fa-solid fa-eye-slash';
        showToast('Balance hidden');
      } else {
        balanceEl.textContent = '₹5,000';
        eyeIcon.className = 'fa-solid fa-eye';
        showToast('Balance visible');
      }
    });
  }

  // PIN Button Trigger
  const pinCheckBtn = document.getElementById('pinCheckBtn');
  if (pinCheckBtn) {
    pinCheckBtn.addEventListener('click', () => {
      openUpiPinModal('HDFC Bank', '5820');
    });
  }

  // Pay / Send Money Button Trigger
  const payBtn = document.getElementById('payBtn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      showToast('Opening Paytm Money Transfer...');
    });
  }

  // Close UPI Modal
  const closeUpiBtn = document.getElementById('closeUpiModalBtn');
  const upiOverlay = document.getElementById('upiModalOverlay');
  if (closeUpiBtn && upiOverlay) {
    closeUpiBtn.addEventListener('click', closeUpiPinModal);
    upiOverlay.addEventListener('click', (e) => {
      if (e.target === upiOverlay) closeUpiPinModal();
    });
  }

  // Statement Modal Triggers
  const openStmtBtn = document.getElementById('openStatementModalBtn');
  const closeStmtBtn = document.getElementById('closeStmtModalBtn');
  const stmtOverlay = document.getElementById('statementModalOverlay');
  
  if (openStmtBtn && stmtOverlay) {
    openStmtBtn.addEventListener('click', () => {
      stmtOverlay.classList.add('active');
    });
  }

  if (closeStmtBtn && stmtOverlay) {
    closeStmtBtn.addEventListener('click', () => {
      stmtOverlay.classList.remove('active');
    });
    stmtOverlay.addEventListener('click', (e) => {
      if (e.target === stmtOverlay) stmtOverlay.classList.remove('active');
    });
  }
}

// UPI PIN Functions
function openUpiPinModal(bankName, accNo) {
  currentBankName = bankName;
  currentBankAcc = accNo;
  currentPin = '';
  updatePinDots();

  const titleEl = document.getElementById('upiBankTitle');
  const accEl = document.getElementById('upiBankAcc');
  const modalOverlay = document.getElementById('upiModalOverlay');

  if (titleEl) titleEl.textContent = bankName;
  if (accEl) accEl.textContent = `A/c No: •••• ${accNo}`;
  if (modalOverlay) modalOverlay.classList.add('active');
}

function closeUpiPinModal() {
  const modalOverlay = document.getElementById('upiModalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
  currentPin = '';
  updatePinDots();
}

function enterPinDigit(digit) {
  if (currentPin.length < 4) {
    currentPin += digit;
    updatePinDots();
    if (currentPin.length === 4) {
      setTimeout(submitPin, 300);
    }
  }
}

function clearPinDigit() {
  if (currentPin.length > 0) {
    currentPin = currentPin.slice(0, -1);
    updatePinDots();
  }
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (dot) {
      if (i <= currentPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }
}

function submitPin() {
  if (currentPin.length < 4) {
    showToast('Please enter full 4-digit PIN');
    return;
  }

  // Simulate PIN submission
  showToast(`PIN Verified for ${currentBankName}`);
  closeUpiPinModal();
  animateCountUp(5000);
}

// Toast Helper
function showToast(message) {
  const toast = document.getElementById('appToast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

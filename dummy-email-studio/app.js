/**
 * Dummy Email Studio - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Form Inputs
  const inputSenderName = document.getElementById('input-sender-name');
  const inputSenderEmail = document.getElementById('input-sender-email');
  const inputVerified = document.getElementById('input-verified');
  const inputRecipientName = document.getElementById('input-recipient-name');
  const inputSubject = document.getElementById('input-subject');
  const inputTimestamp = document.getElementById('input-timestamp');
  const inputAvatarInitials = document.getElementById('input-avatar-initials');
  const inputBodyContent = document.getElementById('input-body-content');

  // DOM Elements - Display Viewport
  const displaySubject = document.getElementById('display-subject');
  const displayAvatar = document.getElementById('display-avatar');
  const displaySenderName = document.getElementById('display-sender-name');
  const displayVerified = document.getElementById('display-verified');
  const displaySenderEmail = document.getElementById('display-sender-email');
  const displayRecipient = document.getElementById('display-recipient');
  const displayTimestamp = document.getElementById('display-timestamp');
  const displayBodyContent = document.getElementById('display-body-content');

  // Controls & Buttons
  const presetChips = document.querySelectorAll('.chip');
  const btnDesktopView = document.getElementById('btn-desktop-view');
  const btnMobileView = document.getElementById('btn-mobile-view');
  const stageViewport = document.getElementById('stage-viewport');
  const themeToggle = document.getElementById('theme-toggle');
  const btnExportScreenshot = document.getElementById('btn-export-screenshot');
  const starToggle = document.getElementById('star-toggle');

  // Pre-loaded Generic Preset Email Templates
  const PRESETS = {
    'project-update': {
      senderName: 'Acme Project Suite',
      senderEmail: 'digest@acme-demo.org',
      verified: true,
      recipient: 'Jane Smith <jane.smith@example.com>',
      subject: '🚀 Weekly Project Progress & Key Milestones Summary',
      timestamp: 'Today at 10:45 AM',
      avatar: 'PS',
      body: `<p>Hi <strong>Jane</strong>,</p>
<p>Here is your weekly digest of team progress across all active project streams for the current sprint.</p>

<div class="email-callout success">
  <strong>Key Sprint Achievement:</strong> Core API endpoints optimized with a 42% latency reduction.
</div>

<h3>📊 Milestones Completed</h3>
<table class="email-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Status</th>
      <th>Lead</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>User Authentication Service</td>
      <td><span style="color: var(--success-color); font-weight: 600;">Completed</span></td>
      <td>Alex Rivera</td>
    </tr>
    <tr>
      <td>Analytics Dashboard UI</td>
      <td><span style="color: var(--warning-color); font-weight: 600;">In Review</span></td>
      <td>Devon Chen</td>
    </tr>
    <tr>
      <td>Database Migration v2.4</td>
      <td><span style="color: var(--success-color); font-weight: 600;">Completed</span></td>
      <td>Sarah Jenkins</td>
    </tr>
  </tbody>
</table>

<p>Please review the full report on your dashboard before our sync meeting tomorrow at 2:00 PM UTC.</p>

<a href="#" class="email-cta-btn" onclick="return false;">View Full Project Dashboard →</a>

<div class="email-footer-note">
  This is an automated weekly project digest sent by Acme Project Suite.<br>
  Manage your notification preferences in account settings.
</div>`
    },

    'welcome-onboarding': {
      senderName: 'Acme Customer Success',
      senderEmail: 'welcome@acme-demo.org',
      verified: true,
      recipient: 'Jane Smith <jane.smith@example.com>',
      subject: '👋 Welcome to Acme Platform! Here is your quickstart guide',
      timestamp: 'Yesterday at 3:15 PM',
      avatar: 'AC',
      body: `<p>Hello <strong>Jane</strong>,</p>
<p>Thank you for joining Acme Platform! We are excited to have you onboard.</p>

<div class="email-callout">
  <strong>Getting Started:</strong> Your account workspace has been provisioned and is ready for use.
</div>

<p>To help you hit the ground running, we've prepared three quick steps:</p>
<ol style="margin-left: 20px; margin-bottom: 16px;">
  <li style="margin-bottom: 8px;">Set up your team profile & notification preferences.</li>
  <li style="margin-bottom: 8px;">Explore sample workflows in the interactive sandbox.</li>
  <li>Invite your team members to collaborate in real-time.</li>
</ol>

<a href="#" class="email-cta-btn" onclick="return false;">Launch Your Workspace Now →</a>

<p style="margin-top: 18px;">If you have any questions or need assistance, feel free to reply directly to this email.</p>

<div class="email-footer-note">
  Acme Software Inc., 100 Technology Way, Suite 400.<br>
  © 2026 Acme Corp. All rights reserved.
</div>`
    },

    'order-receipt': {
      senderName: 'Acme Billing Store',
      senderEmail: 'receipts@acme-demo.org',
      verified: true,
      recipient: 'Jane Smith <jane.smith@example.com>',
      subject: '🧾 Payment Confirmation & Receipt #ACM-98412',
      timestamp: 'Aug 14, 2026, 8:20 PM',
      avatar: 'AB',
      body: `<p>Hi <strong>Jane</strong>,</p>
<p>Thank you for your purchase! We've received your payment and processed your order.</p>

<h3>Order Summary (Ref: #ACM-98412)</h3>
<table class="email-table">
  <thead>
    <tr>
      <th>Description</th>
      <th>Qty</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Acme Pro Tier Subscription (Annual Plan)</td>
      <td>1</td>
      <td>$149.00</td>
    </tr>
    <tr>
      <td>Developer API Access Token Add-on</td>
      <td>1</td>
      <td>$29.00</td>
    </tr>
    <tr>
      <td colspan="2" style="text-align: right; font-weight: 700;">Total Paid:</td>
      <td style="font-weight: 700; color: var(--accent-primary);">$178.00</td>
    </tr>
  </tbody>
</table>

<div class="email-callout success">
  <strong>Payment Method:</strong> Visa ending in •••• 4242 | <strong>Status:</strong> Paid in Full
</div>

<p>You can download a formal PDF invoice directly from your billing portal.</p>

<a href="#" class="email-cta-btn" onclick="return false;">Download PDF Invoice</a>

<div class="email-footer-note">
  Questions regarding this transaction? Contact billing-support@acme-demo.org.
</div>`
    },

    'system-alert': {
      senderName: 'Acme Security Center',
      senderEmail: 'security@acme-demo.org',
      verified: true,
      recipient: 'Jane Smith <jane.smith@example.com>',
      subject: '🔒 Routine Security Digest: New Authorized Login Detected',
      timestamp: 'Today at 7:10 AM',
      avatar: 'AS',
      body: `<p>Hello <strong>Jane</strong>,</p>
<p>We detected a new sign-in to your Acme account from a new browser or device.</p>

<div class="email-callout warning">
  <strong>Login Details:</strong><br>
  • <strong>Device:</strong> Chrome on macOS 14.5<br>
  • <strong>Location:</strong> San Francisco, CA, USA<br>
  • <strong>Time:</strong> Today at 07:09:42 AM UTC
</div>

<p>If this was you, no further action is required and you can safely ignore this notification.</p>
<p>If you did not perform this sign-in, please secure your account immediately by resetting your password.</p>

<a href="#" class="email-cta-btn" style="background: var(--danger-color);" onclick="return false;">Review Security Settings</a>

<div class="email-footer-note">
  This is an automated system security notification from Acme Security Center.
</div>`
    }
  };

  // Function to Update Canvas from Input Controls
  function syncCanvas() {
    displaySenderName.textContent = inputSenderName.value || 'Sender Name';
    displaySenderEmail.textContent = `<${inputSenderEmail.value || 'sender@example.com'}>`;
    displayVerified.style.display = inputVerified.checked ? 'inline-flex' : 'none';
    displayRecipient.textContent = inputRecipientName.value || 'recipient@example.com';
    displaySubject.textContent = inputSubject.value || 'Subject Line';
    displayTimestamp.textContent = inputTimestamp.value || 'Just now';
    displayAvatar.textContent = (inputAvatarInitials.value || 'EM').toUpperCase();
    displayBodyContent.innerHTML = inputBodyContent.value;
  }

  // Load Preset
  function loadPreset(presetKey) {
    const data = PRESETS[presetKey];
    if (!data) return;

    inputSenderName.value = data.senderName;
    inputSenderEmail.value = data.senderEmail;
    inputVerified.checked = data.verified;
    inputRecipientName.value = data.recipient;
    inputSubject.value = data.subject;
    inputTimestamp.value = data.timestamp;
    inputAvatarInitials.value = data.avatar;
    inputBodyContent.value = data.body;

    // Highlight Chip
    presetChips.forEach(chip => {
      if (chip.dataset.preset === presetKey) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    syncCanvas();
  }

  // Event Listeners for Input Synchronization
  [inputSenderName, inputSenderEmail, inputVerified, inputRecipientName, inputSubject, inputTimestamp, inputAvatarInitials, inputBodyContent].forEach(input => {
    input.addEventListener('input', syncCanvas);
    input.addEventListener('change', syncCanvas);
  });

  // Preset Chips Listener
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      loadPreset(chip.dataset.preset);
    });
  });

  // View Mode Switcher (Desktop vs Mobile View)
  btnDesktopView.addEventListener('click', () => {
    btnDesktopView.classList.add('active');
    btnMobileView.classList.remove('active');
    stageViewport.classList.remove('mobile-mode');
  });

  btnMobileView.addEventListener('click', () => {
    btnMobileView.classList.add('active');
    btnDesktopView.classList.remove('active');
    stageViewport.classList.add('mobile-mode');
  });

  // Theme Toggle Listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  });

  // Star Toggle
  starToggle.addEventListener('click', () => {
    starToggle.classList.toggle('starred');
    if (starToggle.classList.contains('starred')) {
      starToggle.classList.remove('fa-regular');
      starToggle.classList.add('fa-solid');
    } else {
      starToggle.classList.remove('fa-solid');
      starToggle.classList.add('fa-regular');
    }
  });

  // Export PNG Screenshot Button using html2canvas
  btnExportScreenshot.addEventListener('click', () => {
    const captureTarget = document.getElementById('email-capture-target');
    
    // Provide visual feedback
    const originalText = btnExportScreenshot.innerHTML;
    btnExportScreenshot.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Rendering...`;
    btnExportScreenshot.disabled = true;

    html2canvas(captureTarget, {
      scale: 2, // High DPI resolution
      useCORS: true,
      logging: false,
      backgroundColor: null
    }).then(canvas => {
      // Create download link
      const imageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = `dummy-email-screenshot-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Restore button
      btnExportScreenshot.innerHTML = `<i class="fa-solid fa-check"></i> Downloaded!`;
      setTimeout(() => {
        btnExportScreenshot.innerHTML = originalText;
        btnExportScreenshot.disabled = false;
      }, 2000);
    }).catch(err => {
      console.error('Screenshot export error:', err);
      alert('Failed to capture screenshot. Please try again.');
      btnExportScreenshot.innerHTML = originalText;
      btnExportScreenshot.disabled = false;
    });
  });

  // Initialize with Default Preset
  loadPreset('project-update');
});

// Email Invite Service for Curry2Cakes
// This service handles automated invite code generation and email sending via GoDaddy

const crypto = require('crypto');

// Mock GoDaddy Email API configuration
// In production, you would use actual GoDaddy API credentials
const GODADDY_CONFIG = {
  apiKey: process.env.GODADDY_API_KEY || 'demo-api-key',
  apiSecret: process.env.GODADDY_API_SECRET || 'demo-api-secret',
  domain: process.env.GODADDY_DOMAIN || 'curry2cakes.com',
  fromEmail: 'invites@curry2cakes.com'
};

// In-memory storage for demo purposes
// In production, use a proper database
const inviteCodes = new Map();
const emailRequests = new Map();

/**
 * Generate a unique invite code
 */
function generateInviteCode() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `C2C${timestamp}${random}`.substring(0, 12);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send invite email via GoDaddy API (mock implementation)
 */
async function sendInviteEmail(email, inviteCode, userName = '') {
  // Mock email sending - in production, integrate with GoDaddy Email API
  console.log(`Sending invite email to: ${email}`);
  console.log(`Invite code: ${inviteCode}`);
  
  const emailContent = {
    to: email,
    from: GODADDY_CONFIG.fromEmail,
    subject: '🍛 Your Exclusive Curry2Cakes Invite Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8B4513; }
          .accent { color: #FF6347; }
          .invite-code { 
            background: #F5F5F7; 
            padding: 20px; 
            text-align: center; 
            border-radius: 12px; 
            margin: 20px 0;
            border: 2px dashed #8B4513;
          }
          .code { 
            font-size: 24px; 
            font-weight: bold; 
            color: #8B4513; 
            font-family: monospace;
            letter-spacing: 2px;
          }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CURRY<span class="accent">2$</span>CAKES</div>
            <p>From Spicy to Sweet!</p>
          </div>
          
          <h2>Welcome to the Inner Circle! 🎉</h2>
          
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          
          <p>Congratulations! You've been granted exclusive access to Curry2Cakes, where we craft an unforgettable journey from savory curries to decadent desserts.</p>
          
          <div class="invite-code">
            <p><strong>Your Exclusive Invite Code:</strong></p>
            <div class="code">${inviteCode}</div>
          </div>
          
          <p>Use this code to unlock our secret menu featuring:</p>
          <ul>
            <li>🍛 Authentic handcrafted curries</li>
            <li>🍰 Artisanal desserts and cakes</li>
            <li>🎂 Limited-edition New York Cheesecake</li>
          </ul>
          
          <p><strong>How to redeem:</strong></p>
          <ol>
            <li>Visit our exclusive portal</li>
            <li>Sign in with your Google account</li>
            <li>Enter your invite code above</li>
            <li>Explore our secret menu</li>
          </ol>
          
          <p><em>This invite code is valid for 30 days and can only be used once.</em></p>
          
          <div class="footer">
            <p>Welcome to the Curry2Cakes family!</p>
            <p>© 2023 Curry2Cakes. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, make actual API call to GoDaddy
  // const response = await fetch('https://api.godaddy.com/v1/email/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `sso-key ${GODADDY_CONFIG.apiKey}:${GODADDY_CONFIG.apiSecret}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(emailContent)
  // });
  
  console.log('Email sent successfully (mock)');
  return { success: true, messageId: `mock-${Date.now()}` };
}

/**
 * Request an invite code for an email address
 */
async function requestInviteCode(email, userName = '') {
  try {
    // Validate email
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email address format'
      };
    }

    // Check if email already has a recent request (rate limiting)
    const existingRequest = emailRequests.get(email);
    if (existingRequest && Date.now() - existingRequest.timestamp < 300000) { // 5 minutes
      return {
        success: false,
        error: 'Please wait 5 minutes before requesting another invite code'
      };
    }

    // Generate new invite code
    const inviteCode = generateInviteCode();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Store invite code
    inviteCodes.set(inviteCode, {
      email,
      userName,
      createdAt: new Date(),
      expiresAt: expiryDate,
      used: false
    });

    // Record email request
    emailRequests.set(email, {
      timestamp: Date.now(),
      inviteCode
    });

    // Send email
    const emailResult = await sendInviteEmail(email, inviteCode, userName);
    
    if (emailResult.success) {
      return {
        success: true,
        message: 'Invite code sent successfully! Check your email in a few minutes.',
        inviteCode: inviteCode // Remove this in production for security
      };
    } else {
      return {
        success: false,
        error: 'Failed to send email. Please try again later.'
      };
    }

  } catch (error) {
    console.error('Error requesting invite code:', error);
    return {
      success: false,
      error: 'Internal server error. Please try again later.'
    };
  }
}

/**
 * Validate an invite code
 */
function validateInviteCode(code) {
  const invite = inviteCodes.get(code);
  
  if (!invite) {
    return {
      valid: false,
      error: 'Invalid invite code'
    };
  }

  if (invite.used) {
    return {
      valid: false,
      error: 'This invite code has already been used'
    };
  }

  if (new Date() > invite.expiresAt) {
    return {
      valid: false,
      error: 'This invite code has expired'
    };
  }

  // Mark as used
  invite.used = true;
  invite.usedAt = new Date();

  return {
    valid: true,
    email: invite.email,
    userName: invite.userName
  };
}

/**
 * Get invite statistics (for admin purposes)
 */
function getInviteStats() {
  const total = inviteCodes.size;
  const used = Array.from(inviteCodes.values()).filter(invite => invite.used).length;
  const expired = Array.from(inviteCodes.values()).filter(invite => 
    new Date() > invite.expiresAt && !invite.used
  ).length;
  
  return {
    total,
    used,
    expired,
    active: total - used - expired
  };
}

module.exports = {
  requestInviteCode,
  validateInviteCode,
  getInviteStats,
  generateInviteCode
};

// Google OAuth authentication service for Curry2Cakes
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * Sign in with Google using popup
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Track sign-in event with Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'login', {
        method: 'Google',
        user_id: user.uid
      });
    }
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Popup was blocked. Please allow popups for this site and try again.',
        code: 'popup-blocked'
      };
    } else if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Sign-in was cancelled.',
        code: 'cancelled'
      };
    } else if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        code: 'network-error'
      };
    }
    
    return {
      success: false,
      error: error.message || 'An error occurred during sign-in.',
      code: error.code
    };
  }
};

/**
 * Sign in with Google using redirect (fallback for mobile)
 */
export const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    return { success: true };
  } catch (error) {
    console.error('Google redirect sign-in error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign-in.',
      code: error.code
    };
  }
};

/**
 * Handle redirect result after Google sign-in
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      
      // Track sign-in event with Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'login', {
          method: 'Google',
          user_id: user.uid
        });
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }
      };
    }
    return { success: true, user: null };
  } catch (error) {
    console.error('Redirect result error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign-in.',
      code: error.code
    };
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    
    // Track sign-out event with Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'logout');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Sign-out error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during sign-out.'
    };
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export default {
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleRedirectResult,
  signOutUser,
  onAuthStateChange,
  getCurrentUser,
  isAuthenticated
};

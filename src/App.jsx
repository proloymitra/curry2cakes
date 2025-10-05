import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, User, Menu, X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import DynamicMenu from './components/DynamicMenu';
import { signInWithGoogle, signOutUser, onAuthStateChange } from './services/auth';
import './App.css';

// Firebase Auth Context with real Google OAuth
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasValidInvite, setHasValidInvite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        });
        setIsAuthenticated(true);
        
        // Track user properties with Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('config', 'G-EH6N2HGMCW', {
            user_id: firebaseUser.uid,
            custom_map: { dimension1: 'authenticated_user' }
          });
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setHasValidInvite(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setAuthError(null);
      setLoading(true);
      
      const result = await signInWithGoogle();
      
      if (!result.success) {
        setAuthError(result.error);
        setLoading(false);
        return false;
      }
      
      // User state will be updated by the onAuthStateChange listener
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred during sign-in.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const result = await signOutUser();
      
      if (!result.success) {
        console.error('Logout error:', result.error);
      }
      
      // User state will be updated by the onAuthStateChange listener
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateInviteCode = async (code) => {
    try {
      // Import the API service dynamically to avoid issues
      const { validateInviteCode: apiValidateInviteCode } = await import('./services/api.js');
      
      const result = await apiValidateInviteCode(code);
      
      if (result.success) {
        setHasValidInvite(true);
        
        // Track invite code validation with Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'invite_code_validated', {
            event_category: 'engagement',
            event_label: 'successful_validation'
          });
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Invite validation error:', error);
      
      // Fallback validation for development/offline mode
      const validCodes = ['C2C2023', 'EXCLUSIVE2024', 'INNER2024', 'SWEET2024'];
      if (validCodes.includes(code.toUpperCase())) {
        setHasValidInvite(true);
        
        // Track fallback validation
        if (typeof gtag !== 'undefined') {
          gtag('event', 'invite_code_validated', {
            event_category: 'engagement',
            event_label: 'fallback_validation'
          });
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Invalid invite code. Please try again.' };
    }
  };

  const requestInviteCode = async (email) => {
    try {
      // Import the API service dynamically
      const { requestInviteCode: apiRequestInviteCode } = await import('./services/api.js');
      
      const result = await apiRequestInviteCode(email);
      
      // Track invite request with Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'invite_code_requested', {
          event_category: 'engagement',
          event_label: result.success ? 'successful_request' : 'failed_request'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Invite request error:', error);
      return { 
        success: false, 
        error: 'Unable to send invite code at this time. Please try again later.' 
      };
    }
  };

  return {
    user,
    isAuthenticated,
    hasValidInvite,
    loading,
    authError,
    login,
    logout,
    validateInviteCode,
    requestInviteCode
  };
};

// Invite Code Form Component
const InviteCodeForm = ({ onSuccess, user, validateInviteCode, requestInviteCode }) => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage('');

    const result = await validateInviteCode(code.trim());
    
    if (result.success) {
      setMessage('');
      onSuccess();
    } else {
      setMessage(result.error || 'Invalid invite code. Please try again.');
    }
    
    setLoading(false);
  };

  const handleRequestInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setRequestStatus('Please enter a valid email address.');
      return;
    }

    setRequestLoading(true);
    setRequestStatus('');

    const result = await requestInviteCode(email.trim());
    
    if (result.success) {
      setRequestStatus('Invite code sent! Check your email and enter the code above.');
    } else {
      setRequestStatus(result.error || 'Unable to send invite code. Please try again.');
    }
    
    setRequestLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Welcome to</h2>
        <h1 className="text-3xl font-bold text-primary">CURRY2CAKES Inner Circle</h1>
        <p className="text-muted-foreground">Enter your invite code to unlock our secret menu.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inviteCode">Invite Code</Label>
          <Input
            id="inviteCode"
            type="text"
            placeholder="Enter your invite code (try: C2C2023)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center font-mono tracking-wider"
          />
        </div>

        {message && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{message}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300"
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        DON'T HAVE A CODE?
      </div>

      <form onSubmit={handleRequestInvite} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center"
          />
        </div>

        {requestStatus && (
          <Alert className={requestStatus.includes('sent') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {requestStatus.includes('sent') ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={requestStatus.includes('sent') ? 'text-green-800' : 'text-red-800'}>
              {requestStatus}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit"
          variant="outline"
          className="w-full rounded-xl transition-all duration-300"
          disabled={requestLoading || !email.trim()}
        >
          {requestLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Request an Invite Code'
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Invite codes are sent to verified email addresses only.
      </p>
    </div>
  );
};

// Header Component
const Header = ({ user, isAuthenticated, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full py-5 bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-border/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Curry2Cakes - From Spicy to Sweet" 
              className="h-12 w-auto"
            />
          </div>          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#menu" className="text-foreground hover:text-primary transition-colors font-medium">
              Menu
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground hidden sm:inline">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/10">
            <div className="flex flex-col space-y-2 pt-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Home
              </a>
              <a href="#menu" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Menu
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Contact
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// Landing Page Component
const LandingPage = ({ onGetStarted }) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            From Spicy to Sweet
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-primary leading-tight">
            An Exclusive Culinary Experience
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to Curry2Cakes, where we craft an unforgettable journey from savory curries to decadent desserts. 
            Our exclusive cloud kitchen is available by invitation only.
          </p>
          
          <div className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-6 bg-accent text-white">
            Invite-Only Access
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Sign In to Explore
            </Button>
            <Button 
              variant="outline"
              onClick={onGetStarted}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Request an Invite
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sign-In Page Component
const SignInPage = ({ onSignIn, authError, loading }) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 text-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto shadow-2xl border-0">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Welcome to the Inner Circle</h2>
                <p className="text-muted-foreground">
                  To access our exclusive menu, please sign in with your Google account.
                </p>
              </div>

              {authError && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{authError}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={onSignIn}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In with Google'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We respect your privacy. Your information is secure with us and will only be used to provide you with our exclusive culinary experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Invite Code Page Component
const InviteCodePage = ({ onSuccess, user, validateInviteCode, requestInviteCode }) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 text-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto shadow-2xl border-0">
          <CardContent className="pt-6">
            <InviteCodeForm 
              onSuccess={onSuccess} 
              user={user} 
              validateInviteCode={validateInviteCode}
              requestInviteCode={requestInviteCode}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// Menu Page Component
const MenuPage = () => {
  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-foreground">
              Our Exclusive Menu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handcrafted selection of curries and cakes, available only to our inner circle. 
              Each dish is prepared with premium ingredients and traditional techniques.
            </p>
            
            <div className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide bg-accent text-white">
              Only 15 invites left this month!
            </div>
          </div>
          
          {/* Dynamic Menu Component */}
          <DynamicMenu />
          
          <div className="italic my-12 p-6 bg-muted rounded-xl text-lg leading-relaxed max-w-2xl mx-auto text-center">
            "Absolutely worth the wait! The cheesecake was the best I've ever had."
            <div className="text-right font-semibold mt-4 text-foreground not-italic">
              - Sarah M., Inner Circle Member
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
function App() {
  const auth = useAuth();
  const { user, isAuthenticated, hasValidInvite, loading, authError, login, logout, validateInviteCode, requestInviteCode } = auth;
  const [currentPage, setCurrentPage] = useState('landing');

  const handleGetStarted = () => {
    setCurrentPage('signin');
  };

  const handleSignIn = async () => {
    const success = await login();
    if (success) {
      setCurrentPage('invite');
    }
  };

  const handleInviteSuccess = () => {
    setCurrentPage('menu');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('landing');
  };

  // Show loading spinner while checking authentication state
  if (loading && currentPage === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    if (!isAuthenticated) {
      if (currentPage === 'signin') {
        return <SignInPage onSignIn={handleSignIn} authError={authError} loading={loading} />;
      }
      return <LandingPage onGetStarted={handleGetStarted} />;
    }

    if (!hasValidInvite) {
      return <InviteCodePage onSuccess={handleInviteSuccess} user={user} validateInviteCode={validateInviteCode} requestInviteCode={requestInviteCode} />;
    }

    return <MenuPage />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;

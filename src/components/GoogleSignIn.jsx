import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const GoogleSignIn = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    
    try {
      // Decode the JWT token to get user information
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const userInfo = JSON.parse(jsonPayload);
      
      const userData = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        email_verified: userInfo.email_verified
      };

      // Store the user data in our auth context
      login(userData);
      
      if (onSuccess) {
        onSuccess(userData);
      }
    } catch (error) {
      console.error('Error processing Google sign-in:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Google sign-in error:', error);
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isLoading ? (
        <Button disabled className="c2c-btn-accent">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </Button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
        />
      )}
      
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        We respect your privacy. Your information is secure with us and will only be used to provide you with our exclusive culinary experience.
      </p>
    </div>
  );
};

export default GoogleSignIn;

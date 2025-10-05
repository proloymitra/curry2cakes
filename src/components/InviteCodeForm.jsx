import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const InviteCodeForm = ({ onSuccess }) => {
  const { validateInviteCode, requestInviteCode, user } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate validation delay for better UX
    setTimeout(() => {
      const isValid = validateInviteCode(inviteCode);
      
      if (isValid) {
        setIsLoading(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError('Sorry, this code isn\'t on our list. Double-check your code or request a new one.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleRequestInvite = async () => {
    if (!user?.email) {
      setError('Please sign in first to request an invite code.');
      return;
    }

    setIsRequestingCode(true);
    setError('');
    setRequestStatus(null);

    try {
      const result = await requestInviteCode(user.email);
      if (result.success) {
        setRequestStatus({
          type: 'success',
          message: result.message
        });
      } else {
        setRequestStatus({
          type: 'error',
          message: result.message || 'Failed to send invite request. Please try again.'
        });
      }
    } catch (error) {
      setRequestStatus({
        type: 'error',
        message: 'Failed to send invite request. Please try again.'
      });
    } finally {
      setIsRequestingCode(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">
          Welcome to CURRY2CAKES Inner Circle
        </h2>
        <p className="text-muted-foreground">
          Enter your invite code to unlock our secret menu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inviteCode">Invite Code</Label>
          <Input
            id="inviteCode"
            type="text"
            placeholder="Enter your invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="text-center text-lg font-mono tracking-wider"
            disabled={isLoading}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {requestStatus && (
          <Alert variant={requestStatus.type === 'success' ? 'default' : 'destructive'}>
            {requestStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>{requestStatus.message}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full c2c-btn-primary"
          disabled={isLoading || !inviteCode.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Don't have a code?
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleRequestInvite}
        disabled={isRequestingCode || !user?.email}
      >
        {isRequestingCode ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Request...
          </>
        ) : (
          'Request an Invite Code'
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Invite codes are sent to verified email addresses only.
          {!user?.email && ' Please sign in first.'}
        </p>
      </div>
    </div>
  );
};

export default InviteCodeForm;

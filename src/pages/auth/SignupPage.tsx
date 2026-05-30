import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

export const SignupPage = () => {
  const { signup, googleLogin, authNotice, authError, clearAuthMessages } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const googleSubmit = async () => {
    setGoogleLoading(true);
    setError('');
    clearAuthMessages();
    try {
      const signedIn = await googleLogin();
      if (signedIn) navigate('/dashboard');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Google signup failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="border-cyan-300/20 bg-white/95 dark:bg-slate-900/90">
      {authNotice ? <Toast type="success" message={authNotice} onClose={clearAuthMessages} /> : null}
      {authError ? <Toast type="error" message={authError} onClose={clearAuthMessages} /> : null}
      <h1 className="font-display text-3xl font-black">Create account</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Start with the Free plan and upgrade when you are ready.</p>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
        <Button loading={loading}>Create account</Button>
        <GoogleButton loading={googleLoading} onClick={googleSubmit}>Signup with Google</GoogleButton>
        <Link className="text-sm text-neutral-500 dark:text-neutral-400" to="/login">Already have an account? Login</Link>
      </form>
    </Card>
  );
};

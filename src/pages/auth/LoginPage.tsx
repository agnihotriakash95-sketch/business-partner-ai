import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton } from '../../components/auth/GoogleButton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage = () => {
  const { login, googleLogin, authNotice, authError, clearAuthMessages } = useAuth();
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
      await login(email, password);
      navigate('/dashboard');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed');
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
      setError(caught instanceof Error ? caught.message : 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="border-cyan-300/20 bg-white/95 dark:bg-slate-900/90">
      {authNotice ? <Toast type="success" message={authNotice} onClose={clearAuthMessages} /> : null}
      {authError ? <Toast type="error" message={authError} onClose={clearAuthMessages} /> : null}
      <h1 className="font-display text-3xl font-black">Welcome back</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">Sign in to your enterprise AI Business Operating System.</p>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error ? <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
        <Button loading={loading}>Login</Button>
        <GoogleButton loading={googleLoading} onClick={googleSubmit}>Continue with Google</GoogleButton>
        <Link className="text-sm font-semibold text-cyan-600 dark:text-cyan-300" to="/forgot-password">Forgot password?</Link>
        <Link className="text-sm text-neutral-500 dark:text-neutral-400" to="/signup">New here? Create account</Link>
      </form>
    </Card>
  );
};

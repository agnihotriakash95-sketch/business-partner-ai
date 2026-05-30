import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await forgotPassword(email);
      setStatus('Password reset email sent.');
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-cyan-300/20 bg-white/95 dark:bg-slate-900/90">
      <h1 className="font-display text-3xl font-black">Reset password</h1>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        {status ? <p className="rounded-lg bg-gold-400/10 p-3 text-sm text-gold-600 dark:text-gold-300">{status}</p> : null}
        <Button loading={loading}>Send reset link</Button>
        <Link className="text-sm text-neutral-500 dark:text-neutral-400" to="/login">Back to login</Link>
      </form>
    </Card>
  );
};

import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export const SettingsPage = () => {
  const { profile } = useAuth();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl font-black">Settings</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Manage profile and workspace preferences.</p>
      </div>
      <Card className="grid gap-4">
        <Input label="Name" value={profile.name} readOnly />
        <Input label="Role" value={profile.title} readOnly />
        <Input label="Email" value={profile.email} readOnly />
        <Input label="Account Type" value={profile.role === 'admin' ? 'Admin' : 'User'} readOnly />
        <Input label="Plan" value={profile.plan.toUpperCase()} readOnly />
      </Card>
    </div>
  );
};

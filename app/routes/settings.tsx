import ProfileSettingsTab from './ProfileSettingsTab';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-1 p-8">
      <div className="max-w-2xl mx-auto bg-bolt-elements-background-depth-2 rounded-xl shadow-lg p-6 border border-bolt-elements-borderColor">
        <h1 className="text-2xl font-bold text-bolt-elements-textPrimary mb-6">Settings</h1>
        <ProfileSettingsTab />
      </div>
    </div>
  );
}
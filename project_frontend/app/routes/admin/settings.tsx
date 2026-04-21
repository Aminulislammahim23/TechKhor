import { createFileRoute } from "@tanstack/react-router";
import { Save, RefreshCw } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{ title: "Admin Settings" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "TechKhor",
    supportEmail: "support@techkhor.com",
    currency: "USD",
    minProductPrice: 1.0,
    maxProductPrice: 100000.0,
    commissionPercentage: 5.0,
    maintenanceMode: false,
    allowNewSellers: true,
    requireProductApproval: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure platform settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">General Settings</h2>

        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) =>
                  setSettings({ ...settings, platformName: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  setSettings({ ...settings, supportEmail: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>AED</option>
                <option>SAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commission %
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.commissionPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    commissionPercentage: parseFloat(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Product Settings</h2>

        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Product Price
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.minProductPrice}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    minProductPrice: parseFloat(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Product Price
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.maxProductPrice}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxProductPrice: parseFloat(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="requireApproval"
              checked={settings.requireProductApproval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  requireProductApproval: e.target.checked,
                })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="requireApproval" className="text-sm font-medium text-gray-700">
              Require approval for new products
            </label>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Platform Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="maintenance"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode: e.target.checked,
                })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
              Maintenance Mode (disables customer access)
            </label>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="newSellers"
              checked={settings.allowNewSellers}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowNewSellers: e.target.checked,
                })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="newSellers" className="text-sm font-medium text-gray-700">
              Allow new seller registrations
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={18} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

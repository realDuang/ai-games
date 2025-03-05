import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    width: number;
    height: number;
    mines: number;
  };
  onSave: (settings: { width: number; height: number; mines: number }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [newSettings, setNewSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxMines = (newSettings.width * newSettings.height) - 1;
    const validatedSettings = {
      ...newSettings,
      mines: Math.min(newSettings.mines, maxMines)
    };
    onSave(validatedSettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Game Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (5-30)
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={newSettings.width}
                onChange={(e) => setNewSettings({
                  ...newSettings,
                  width: Math.max(5, Math.min(30, parseInt(e.target.value) || 5))
                })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (5-30)
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={newSettings.height}
                onChange={(e) => setNewSettings({
                  ...newSettings,
                  height: Math.max(5, Math.min(30, parseInt(e.target.value) || 5))
                })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mines (1-{(newSettings.width * newSettings.height) - 1})
              </label>
              <input
                type="number"
                min="1"
                max={newSettings.width * newSettings.height - 1}
                value={newSettings.mines}
                onChange={(e) => setNewSettings({
                  ...newSettings,
                  mines: Math.max(1, Math.min(
                    newSettings.width * newSettings.height - 1,
                    parseInt(e.target.value) || 1
                  ))
                })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
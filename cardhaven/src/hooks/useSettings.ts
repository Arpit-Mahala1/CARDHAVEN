import { useState, useEffect } from 'react';
import { GameSettings } from '../types';

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  reducedMotion: false,
  showDamageNumbers: true,
  autoEndTurn: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('cardhaven_settings');
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('cardhaven_settings', JSON.stringify(newSettings));
  };

  return { settings, updateSetting };
}

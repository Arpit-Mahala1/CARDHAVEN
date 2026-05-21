import { useSettings } from '../hooks/useSettings';
import { audioManager } from '../utils/audioManager';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { settings, updateSetting: baseUpdateSetting } = useSettings();

  const updateSetting = <K extends keyof import('../types').GameSettings>(key: K, value: import('../types').GameSettings[K]) => {
    baseUpdateSetting(key, value);
    
    if (key.toString().includes('Volume')) {
      audioManager.updateVolumes();
    }
    
    if (key === 'sfxVolume' || key === 'masterVolume') {
      audioManager.playSFX('click');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in bg-black relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-8 z-50 p-3 glass-panel border-opacity-10 hover:border-opacity-40 text-text-muted hover:text-accent-gold transition-all group flex items-center gap-3"
      >
        <span className="text-xl">←</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase tracking-[0.3em] font-bold">Return</span>
      </button>

      <h1 className="text-5xl font-serif text-accent-gold tracking-widest mb-2">SETTINGS</h1>
      <div className="h-px w-16 bg-accent-gold opacity-30 mb-12" />

      <div className="glass-panel p-10 w-full max-w-lg flex flex-col gap-8 border-opacity-20">
        
        {/* Master Volume */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-serif text-text-primary uppercase tracking-widest">Master Volume</label>
            <span className="font-mono text-xs text-accent-gold">{Math.round(settings.masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={settings.masterVolume}
            onChange={e => updateSetting('masterVolume', parseFloat(e.target.value))}
            className="w-full accent-[#c5a059] h-1 bg-bg-secondary rounded cursor-pointer"
          />
        </div>

        {/* Music Volume */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-serif text-text-primary uppercase tracking-widest">Music Volume</label>
            <span className="font-mono text-xs text-accent-gold">{Math.round(settings.musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={settings.musicVolume}
            onChange={e => updateSetting('musicVolume', parseFloat(e.target.value))}
            className="w-full accent-[#c5a059] h-1 bg-bg-secondary rounded cursor-pointer"
          />
        </div>

        {/* SFX Volume */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-serif text-text-primary uppercase tracking-widest">SFX Volume</label>
            <span className="font-mono text-xs text-accent-gold">{Math.round(settings.sfxVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={settings.sfxVolume}
            onChange={e => updateSetting('sfxVolume', parseFloat(e.target.value))}
            className="w-full accent-[#c5a059] h-1 bg-bg-secondary rounded cursor-pointer"
          />
        </div>

        <div className="h-px w-full bg-white opacity-5" />

        {/* Toggles */}
        <ToggleSetting
          label="Reduced Motion"
          description="Disable animations for accessibility"
          value={settings.reducedMotion}
          onChange={v => updateSetting('reducedMotion', v)}
        />
        <ToggleSetting
          label="Damage Numbers"
          description="Show floating damage numbers in battle"
          value={settings.showDamageNumbers}
          onChange={v => updateSetting('showDamageNumbers', v)}
        />
        <ToggleSetting
          label="Auto End Turn"
          description="Automatically end turn when out of energy"
          value={settings.autoEndTurn}
          onChange={v => updateSetting('autoEndTurn', v)}
        />
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <p className="text-[10px] text-text-muted uppercase tracking-widest">Cardhaven</p>
        <p className="text-[9px] text-text-muted opacity-50">v1.0.0</p>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-serif text-text-primary">{label}</span>
        <span className="text-[10px] text-text-muted">{description}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${value ? 'bg-accent-gold' : 'bg-bg-secondary border border-white border-opacity-10'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300 shadow-md ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

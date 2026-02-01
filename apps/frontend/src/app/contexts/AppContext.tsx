import type { ICampaign, UnitSystem } from '@five-parsecs/parsec-api';
import React, { createContext, useCallback, useContext, useState } from 'react';

const SETTINGS_STORAGE_KEY = 'five-parsecs-settings';

export interface AppSettings {
  unitSystem: UnitSystem;
  // Add more generic settings here as needed
}

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>;
      if (parsed.unitSystem === 'imperial' || parsed.unitSystem === 'metric') {
        return { unitSystem: parsed.unitSystem };
      }
    }
  } catch {
    // ignore
  }
  return { unitSystem: 'imperial' };
}

function persistSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

interface AppContextType {
  // Campaign state
  selectedCampaign: ICampaign | null;
  setSelectedCampaign: (campaign: ICampaign | null) => void;
  selectedCampaignId: string | undefined;
  setSelectedCampaignId: (id: string | undefined) => void;
  // App settings (generic, persisted)
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>();
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings());

  const setSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState((prev) => {
      const next = { ...prev, [key]: value };
      persistSettings(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedCampaign,
        setSelectedCampaign,
        selectedCampaignId,
        setSelectedCampaignId,
        settings,
        setSetting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks for specific features
export function useCampaign() {
  const { selectedCampaign, setSelectedCampaign, selectedCampaignId, setSelectedCampaignId } = useApp();
  return { selectedCampaign, setSelectedCampaign, selectedCampaignId, setSelectedCampaignId };
}

export function useSettings() {
  const { settings, setSetting } = useApp();
  return {
    settings,
    setSetting,
    unitSystem: settings.unitSystem,
    setUnitSystem: (unit: UnitSystem) => setSetting('unitSystem', unit),
  };
}

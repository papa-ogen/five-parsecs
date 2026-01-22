import type { ICampaign } from '@five-parsecs/parsec-api';
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  // Campaign state
  selectedCampaign: ICampaign | null;
  setSelectedCampaign: (campaign: ICampaign | null) => void;
  selectedCampaignId: string | undefined;
  setSelectedCampaignId: (id: string | undefined) => void;
  
  // Add more state here as needed:
  // selectedCrew: ICampaignCrew | null;
  // setSelectedCrew: (crew: ICampaignCrew | null) => void;
  // etc.
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Campaign state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>();
  const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);

  // Add more state here as your app grows:
  // const [selectedCrew, setSelectedCrew] = useState<ICampaignCrew | null>(null);
  // const [selectedCharacter, setSelectedCharacter] = useState<ICampaignCharacter | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedCampaign,
        setSelectedCampaign,
        selectedCampaignId,
        setSelectedCampaignId,
        // Add more state to value as needed
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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TargetConfig } from '../types/config';

interface TargetStore {
  config: TargetConfig;
  updateConfig: (config: Partial<TargetConfig>) => void;
  updateTargetToken: (accessToken: string, expiryTime: number) => void;
}

const defaultConfig: TargetConfig = {
  orgId: '',
  workspaceId: '',
  clientId: '',
  clientSecret: '',
  refreshToken: '',
  frequency: 1,
  format: 'days',
  accessToken: '',
  expiryTime: 0
};

export const useTargetStore = create<TargetStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),
      updateTargetToken: (accessToken, expiryTime) => set((state) => ({
        config: { ...state.config, accessToken, expiryTime }
      }))
    }),
    {
      name: 'target-storage'
    }
  )
);
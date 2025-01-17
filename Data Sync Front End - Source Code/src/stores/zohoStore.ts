import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TargetConfig } from '../types/config';

interface ZohoStore {
  config: TargetConfig;
  updateConfig: (config: TargetConfig) => void;
}

export const useZohoStore = create<ZohoStore>()(
  persist(
    (set) => ({
      config: {
        orgId: '',
        workspaceId: '',
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        frequency: 0,
        format: 'days',
        accessToken: '',
        expiryTime: 0
      },
      updateConfig: (config) => set({ config })
    }),
    {
      name: 'zoho-storage'
    }
  )
);
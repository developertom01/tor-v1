'use client'

import { createContext, useContext } from 'react'
import type { StoreConfig } from './index'

const StoreContext = createContext<StoreConfig | null>(null)

export function StoreProvider({ config, children }: { config: StoreConfig; children: React.ReactNode }) {
  return <StoreContext.Provider value={config}>{children}</StoreContext.Provider>
}

export function useStore(): StoreConfig {
  const config = useContext(StoreContext)
  if (!config) throw new Error('useStore must be used within a StoreProvider')
  return config
}

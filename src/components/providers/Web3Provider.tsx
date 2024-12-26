import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/web3'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const queryClient = new QueryClient()

// Initialize web3modal
createWeb3Modal({ wagmiConfig: config })

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
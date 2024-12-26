import { defaultConfig, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

export const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID'

const metadata = {
  name: 'Durger King',
  description: 'Your favorite crypto burger shop',
  url: 'https://durgerking.com', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = createConfig(
  defaultConfig({
    chains: [mainnet],
    projectId,
    metadata,
    ssr: true
  })
)

createWeb3Modal({ wagmiConfig: config, projectId, chains: [mainnet] })
import { defaultWagmiConfig } from '@web3modal/wagmi'
import { http } from 'viem'
import { mainnet } from 'viem/chains'

export const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID'

const metadata = {
  name: 'Durger King',
  description: 'Your favorite crypto burger shop',
  url: 'https://durgerking.com', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains: [mainnet],
  projectId,
  metadata,
  transports: {
    [mainnet.id]: http()
  }
})
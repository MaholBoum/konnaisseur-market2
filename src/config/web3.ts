import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet } from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = 'YOUR_PROJECT_ID'

const metadata = {
  name: 'Konnaisseur Market',
  description: 'Web3 Food Delivery',
  url: 'https://konnaisseur.market', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains: [mainnet], 
  projectId,
  metadata,
})
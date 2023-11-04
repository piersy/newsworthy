import React from 'react';
import { WagmiConfig, sepolia } from 'wagmi'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

// import createMetaMaskProvider from 'metamask-extension-provider';

// 1. Get projectId
const projectId = 'cdf2b9e1f97c033c5e4a962ebd6607e7'

// 2. Create wagmiConfig
const metadata = {
    name: 'GitNews',
    description: 'GitNews is a chrome extension against New Censorship',
    url: 'https://gitnews.xyz',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}


const chains = [sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

function Wagmi({ children }: { children: React.ReactNode }){
    return(
        <WagmiConfig config={wagmiConfig}>
            { children }
        </WagmiConfig>
    )
}

export default Wagmi;

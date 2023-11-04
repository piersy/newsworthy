import React from 'react';
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { createWeb3Modal, defaultWagmiConfig } from '../node_modules/@web3modal/wagmi/dist/esm/exports/react.js'

import createMetaMaskProvider from 'metamask-extension-provider';


import App from './App';

// 1. Get projectId
const projectId = 'cdf2b9e1f97c033c5e4a962ebd6607e7'

// 2. Create wagmiConfig
const metadata = {
    name: 'GitNews',
    description: 'bla',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

function Wagmi(){


    // const { publicClient } = configureChains(
    //     [mainnet],
    //     [publicProvider(), createMetaMaskProvider()],
    // )
    //
    //
    // const metamaskConnector = new MetaMaskConnector({
    //     chains: [mainnet, sepolia],
    //     options: {
    //         shimDisconnect: true,
    //     },
    // })
    //
    // const walletConnectConnector = new WalletConnectConnector({
    //     options: {
    //         // qrcode: true,
    //         projectId: 'cdf2b9e1f97c033c5e4a962ebd6607e7',
    //     },
    // })
    //
    // const config = createConfig({
    //     autoConnect: true,
    //     connectors: [
    //         metamaskConnector,
    //         walletConnectConnector,
    //         new InjectedConnector(),
    //         // new createMetaMaskProvider(),
    //     ],
    //     publicClient,
    //     // webSocketPublicClient,
    // })

    return(
        <WagmiConfig config={wagmiConfig}>
            <App />
        </WagmiConfig>
    )
}

export default Wagmi;

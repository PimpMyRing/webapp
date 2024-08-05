import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  optimism,
  base,
  optimismSepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';

// Import the buffer polyfill
import { Buffer } from 'buffer';

// Polyfill the Buffer globally in the browser environment
// if (!window.Buffer) {
  window.Buffer = Buffer;
// }


const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [optimism, optimismSepolia, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet], // Only Metamask to support the snap
    },
  ]
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
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
import './index.css';

// Import the buffer polyfill
import { Buffer } from 'buffer';

// Polyfill the Buffer globally in the browser environment
// if (!window.Buffer) {
window.Buffer = Buffer;
// }


// import reportWebVitals from './reportWebVitals';


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



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


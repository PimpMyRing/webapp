// src/global.d.ts
interface Ethereum {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: Array<any> }) => Promise<any>;
  // Add other properties and methods as needed
}

interface Window {
  ethereum: Ethereum;
}

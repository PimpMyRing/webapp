export const API_URL = "http://localhost:3022/api/";
export const GET_RING_URL = `${API_URL}ring`

export const NFT_ADDRESS = {
  "optimism_sepolia": "0xA8F21b08ba05985141b95C7EB0DA3C4aB645FCE1",
  "optimism": "0x420",
  "base": "0x69",
}

export const GOVERNANCE_CONTRACT = {
  "10": "0x420", // op
  "11155420": "0x4A3d52198d3d36A7cA60133c9A8260d657E6A320", // op sepolia
  "8453": "0x420", // base
}

const ALCHEMY_API_KEY = "RuW3M-sKKB2IOPgalS76_EnjArmTW5X8";

export const ALCHEMY_URL = {
  "10": `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "11155420": `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "8453": `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
}
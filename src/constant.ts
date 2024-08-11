export const API_URL = "https://api.daoofthering.cypherlab.org/api/"; // "http://localhost:3022/api/";
export const GET_RING_URL = `${API_URL}ring`

export const NFT_ADDRESS = {
  "optimism_sepolia": "0x005519c6d1569d875f3db28fd7d40b73a235ce18",
  "optimism": "0xc5Bc1b10671d2Db2734EC81edc7320f61D8CC4A1",
  "base": "0xFeaa7962b200695D411F38C13B330Df855D12f59",
}

export const GOVERNANCE_CONTRACT = {
  "10": "0xF0d7935a33b6126115D21Ec49403e4ce378A42Dd", // op
  "11155420": "0xfA41c676566422887f29FD095Fb8E8FdB2396548", // op sepolia
  "8453": "0x7a8a5b5Fd0880DF2118c3360D9c013dDA754FacF", // base
}

const ALCHEMY_API_KEY = "RuW3M-sKKB2IOPgalS76_EnjArmTW5X8"; // process.env.REACT_APP_ALCHEMY_API_KEY;

export const ALCHEMY_URL = {
  "10": `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "11155420": `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "8453": `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
}
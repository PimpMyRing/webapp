# DAO of the Ring 💍

DAO of the Ring is a tool for Decentralized Autonomous Organizations (DAOs) that innovatively uses ring signatures to ensure privacy. This unique approach enables the toolkit to provide privacy to DAO members through token-gated authentication based on ring signatures.  

## Key Features

- **Privacy-Preserving Authentication:** DAO of the Ring leverages ring signatures to enable token-gated authentication, allowing members to interact with the DAO without revealing their individual identities.
- **Secure Voting System:** The project also innovates by incorporating ring signatures into the DAO's voting and proposal system, enhancing the privacy and security of the decision-making process.
-  **Decentralized Governance:** DAO of the Ring is designed to empower DAO members with a decentralized governance model, where decisions are made collectively and transparently.
-  **Account abstraction for gasless and privacy preserving transactions:** The project also includes account abstraction to allow users to interact with the DAO without needing to hold any native tokens. It also allow users to broadcast their votes / proposals / messages without revealing their address / identity.
-  **Metamask Snap Integration:** DAO of the Ring leverages [Cypher Lab's (it's us btw !) Metamask Snap](https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/) extension to seamlessly integrate the ring signature process into the user experience, providing a familiar and secure way for members to authenticate and vote within the DAO.

-  ## Ring Signatures 
Ring signatures are a type of digital signature that provide anonymity and privacy for the signer. The signer creates a signature using their own private key, but their identity is hidden within a "ring" of multiple public keys.

Key features of ring signatures:

- **Anonymity**: The signer's identity is obfuscated within the ring of public keys.
- **Unforgeability**: Only a member of the ring can create a valid signature.
- **Efficiency**: Ring signatures can be generated and verified efficiently.

Ring signatures have applications in areas like confidential transactions, whistleblowing, and e-voting.

For this project, we utilize [Cypher Lab's (it's us btw !) Metamask Snap](https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/) based on [Alice's Ring LSAG TS library](https://github.com/Cypher-Laboratory/Alice-s-Ring-LSAG-TS), a TypeScript implementation of the ring signature algorithm. 

## Make DAOs Confidential Social Applications

DAO of the Ring aims to transform DAOs into confidential social applications, where privacy and security are paramount. By leveraging advanced cryptographic techniques, such as ring signatures, DAO of the Ring ensures that members can participate in discussions, voting, and other governance activities without compromising their privacy. The following features demonstrate how DAO of the Ring enhances confidentiality within a DAO:

- **Private Communication Channels:** The toolkit provides private and confidential communication channels for DAO members, ensuring that discussions and collaborations within the DAO remain confidential. These channels are secured using ring signatures, allowing members to contribute without revealing their identities.
  
- **Confidential Voting and Proposal Submissions:** DAO of the Ring enables confidential voting and proposal submissions, where members can privately cast their votes or submit proposals. This ensures that the decision-making process is free from undue influence and that members can express their opinions without fear of retaliation.
  
- **Private Member Interactions:** Beyond voting and governance, DAO of the Ring allows members to interact privately within the DAO ecosystem. This includes sending messages, sharing documents, and engaging in group discussions, all while maintaining anonymity through ring signature technology.

By integrating these privacy-preserving features, DAO of the Ring not only protects the identities of its members but also fosters a more open and honest environment for collaboration and decision-making. This approach empowers DAOs to operate as confidential social applications, where privacy is respected, and members can freely participate in the governance process.



## Project Structure :

The project is composed of several key components that work together to provide a secure and privacy-preserving governance solution for decentralized autonomous organizations. 
- [**Metamask Snap**](https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/) :The Metamask Snap (made by us !) is a crucial part of the Ring DAO system, as it allows users to create ring signatures seamlessly while maintaining the safety and user experience provided by the Metamask wallet. This integration enables DAO members to authenticate and interact with the DAO without revealing their individual identities.
- [**WebApp**](https://github.com/PimpMyRing/webapp) : The Ring DAO web application, built using VITE & React, provides a user-friendly interface for DAO members to interact with each other and the DAO's governance processes. The web application leverages the ring signature functionality to anonymize the users' identities, ensuring that their participation in the DAO is kept private.
- [**Backend**](https://github.com/PimpMyRing/backend) : The backend component, built using Express, serves as the intermediary between the web application and DB. 
The primary goal of the backend is to serve the frontend with the necessary dataset for constructing the ring signature. It also displays dynamic information such as proposals (stored on chain alongside with the votes) and live discussions.
- [**Smart-Contract**](https://github.com/PimpMyRing/Governance-contracts) : The Ring DAO smart contracts are deployed on Optimism and Base, enabling DAO members to vote anonymously using ring signatures. This approach ensures that the DAO's decision-making process is transparent and secure, while preserving the privacy of the individual members.

## DEMO :

Watch the live demo video [here](https://youtu.be/RMPiLqEJ7Fw)

To use the demo version of Ring DAO you can interact with our app : [daoofthering.cypherlab.org](https://daoofthering.cypherlab.org/)  
You NEED to install Metamask in order to use our homemade SNAP, see [MetaMask Snap](https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/)  

> Nb: **Do not import any of your main account, this is for test purpose only.**

## Deployed and verified Smart Contracts
### Membership SBT

| CHAIN     | SMART CONTRACT ADDRESS     |
|-----------|-----------------------------|
| Optimism MAINNET  | [0xc5Bc1b10671d2Db2734EC81edc7320f61D8CC4A1](https://optimistic.etherscan.io/address/0xc5Bc1b10671d2Db2734EC81edc7320f61D8CC4A1#code) |
| Optimism TESTNET   | [0x005519c6d1569d875f3db28fd7d40b73a235ce18](https://sepolia-optimism.etherscan.io/address/0x005519c6d1569d875f3db28fd7d40b73a235ce18#code) |
| Base MAINNET   | [0xFeaa7962b200695D411F38C13B330Df855D12f59](https://basescan.org/address/0xFeaa7962b200695D411F38C13B330Df855D12f59#code) |

### LSAG verifier

| CHAIN     | SMART CONTRACT ADDRESS     |
|-----------|-----------------------------|
| Optimism MAINNET  | [0x7fEa7DB327836DF00221c8288B9BBd1f812dFb33](https://optimistic.etherscan.io/address/0x7fEa7DB327836DF00221c8288B9BBd1f812dFb33#code) |
| Optimism TESTNET   | [0xbEeB29483e810290B2610593B30C589672CCE3c8](https://sepolia-optimism.etherscan.io/address/0xbEeB29483e810290B2610593B30C589672CCE3c8#code) |
| Base MAINNET   | [0x7709708E7Aff121164bBA336aEb9653f7467cC2A](https://basescan.org/address/0x7709708E7Aff121164bBA336aEb9653f7467cC2A#code) |

### Governance contract

| CHAIN     | SMART CONTRACT ADDRESS     |
|-----------|-----------------------------|
| Optimism MAINNET  |[0xF0d7935a33b6126115D21Ec49403e4ce378A42Dd](https://optimistic.etherscan.io/address/0xF0d7935a33b6126115D21Ec49403e4ce378A42Dd#code)|
| Optimism TESTNET   |[0xfA41c676566422887f29FD095Fb8E8FdB2396548](https://sepolia-optimism.etherscan.io/address/0xfA41c676566422887f29FD095Fb8E8FdB2396548#code)|
| Base MAINNET   |[0x7a8a5b5Fd0880DF2118c3360D9c013dDA754FacF](https://basescan.org/address/0x7a8a5b5Fd0880DF2118c3360D9c013dDA754FacF#code)|

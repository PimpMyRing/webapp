export const DAOofTheRingABI=[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "MIN_ACCEPTANCE_RATIO",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_VOTERS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VOTE_DURATION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "callData",
          "type": "bytes"
        },
        {
          "internalType": "uint256[]",
          "name": "ring",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "responses",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "c",
          "type": "uint256"
        },
        {
          "internalType": "uint256[2]",
          "name": "keyImage",
          "type": "uint256[2]"
        },
        {
          "internalType": "string",
          "name": "linkabilityFlag",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "witnesses",
          "type": "uint256[]"
        }
      ],
      "name": "anonProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "executeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "callData",
          "type": "bytes"
        }
      ],
      "name": "newProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "proposalCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "proposals",
      "outputs": [
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteForCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "voteAgainstCount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "executed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "callData",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "ring",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "responses",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "c",
          "type": "uint256"
        },
        {
          "internalType": "uint256[2]",
          "name": "keyImage",
          "type": "uint256[2]"
        },
        {
          "internalType": "string",
          "name": "linkabilityFlag",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "witnesses",
          "type": "uint256[]"
        }
      ],
      "name": "voteFalse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "ring",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "responses",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "c",
          "type": "uint256"
        },
        {
          "internalType": "uint256[2]",
          "name": "keyImage",
          "type": "uint256[2]"
        },
        {
          "internalType": "string",
          "name": "linkabilityFlag",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "witnesses",
          "type": "uint256[]"
        }
      ],
      "name": "voteTrue",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]
// src/utils/types.ts

export interface Proposal {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  closingDate: string;
  votes: number;
  author: string;
}

export interface Message {
  body: string;
  sender: string;
  date: string;
  id: number;
}

export interface Discussion {
  proposalId: string;
  messages: Message[];
}
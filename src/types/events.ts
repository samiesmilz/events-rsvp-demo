export interface EventData {
  id: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date?: string;
}

export interface Submission {
  id: number;
  children: number;
  timestamp: string;
}

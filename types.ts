
export enum PostStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  POSTED = 'POSTED'
}

export interface Persona {
  id: string;
  displayName: string;
  profilePicture: string;
  mbti?: string;
  zodiac?: string;
  birthday?: string;
  tone: string;
}

export interface Post {
  id: string;
  content: string;
  topic: string;
  status: PostStatus;
  createdAt: number;
  scheduledFor: number;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  personaId?: string; // Track which persona created this
}

export interface ContentPillar {
  name: string;
  description: string;
}

export interface Settings {
  brandName: string;
  industry: string;
  targetAudience: string;
  tone: string;
  topics: string[];
  postFrequency: number;
  contentPillars: ContentPillar[];
  styleGuide: string;
  brandMission: string;
  // BYOK Fields
  aiEngine: 'native' | 'openrouter';
  openRouterKey?: string;
  openRouterModel?: string;
  // Persona Management
  personas: Persona[];
}

export interface Campaign {
  text: string;
  personaId: string;
}

export type View = 'dashboard' | 'generator' | 'queue' | 'history' | 'settings';

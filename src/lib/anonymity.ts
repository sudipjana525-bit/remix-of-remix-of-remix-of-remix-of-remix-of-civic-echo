// Generate anonymous ID
export function generateAnonymousId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'Anon_';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate session token for anonymous posting
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Get or create anonymous session
export function getAnonymousSession(): { id: string; token: string } {
  const stored = localStorage.getItem('civic_anon_session');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const session = {
    id: generateAnonymousId(),
    token: generateSessionToken(),
  };
  localStorage.setItem('civic_anon_session', JSON.stringify(session));
  return session;
}

// Clear session (for privacy)
export function clearAnonymousSession(): void {
  localStorage.removeItem('civic_anon_session');
}

// Categories
export const CATEGORIES = [
  { id: 'fraud', label: 'Fraud', icon: 'AlertTriangle' },
  { id: 'violence', label: 'Violence', icon: 'Flame' },
  { id: 'corruption', label: 'Corruption', icon: 'Scale' },
  { id: 'governance', label: 'Governance', icon: 'Landmark' },
  { id: 'safety', label: 'Public Safety', icon: 'ShieldAlert' },
  { id: 'healthcare', label: 'Healthcare', icon: 'Heart' },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'Building2' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const;

export type Category = typeof CATEGORIES[number]['id'];

// Severity levels
export const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', color: 'severity-low' },
  { id: 'medium', label: 'Medium', color: 'severity-medium' },
  { id: 'high', label: 'High', color: 'severity-high' },
  { id: 'critical', label: 'Critical', color: 'severity-critical' },
] as const;

export type Severity = typeof SEVERITY_LEVELS[number]['id'];

// Evidence types
export const EVIDENCE_TYPES = [
  { id: 'photo', label: 'Photo' },
  { id: 'video', label: 'Video' },
  { id: 'document', label: 'Document' },
  { id: 'witness', label: 'Witness Statement' },
] as const;

export type EvidenceType = typeof EVIDENCE_TYPES[number]['id'];

// Post interface
export interface Post {
  id: string;
  anonymousId: string;
  content: string;
  category: Category;
  severity: Severity;
  evidenceType?: EvidenceType;
  location?: string;
  imageUrl?: string;
  createdAt: Date;
  credibleVotes: number;
  suspiciousVotes: number;
  commentCount: number;
}

// Generate mock posts for demo
export function generateMockPosts(): Post[] {
  return [
    {
      id: '1',
      anonymousId: 'Anon_X7K2M9',
      content: 'Witnessed fraudulent billing practices at the municipal water department. Citizens are being charged for services not rendered. Have documented evidence spanning 3 months.',
      category: 'fraud',
      severity: 'high',
      evidenceType: 'document',
      location: 'Metro District',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      credibleVotes: 47,
      suspiciousVotes: 3,
      commentCount: 12,
    },
    {
      id: '2',
      anonymousId: 'Anon_P3F8N1',
      content: 'Road construction materials being diverted from public project. Contractors using substandard materials while billing for premium. Infrastructure safety concern.',
      category: 'corruption',
      severity: 'critical',
      evidenceType: 'photo',
      location: 'Highway 47 Section',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      credibleVotes: 89,
      suspiciousVotes: 7,
      commentCount: 34,
    },
    {
      id: '3',
      anonymousId: 'Anon_Q9T4L6',
      content: 'Hospital emergency response times have increased significantly. Ambulances taking 40+ minutes for critical cases. Lives at risk.',
      category: 'healthcare',
      severity: 'critical',
      evidenceType: 'witness',
      location: 'Central Hospital',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      credibleVotes: 124,
      suspiciousVotes: 11,
      commentCount: 56,
    },
    {
      id: '4',
      anonymousId: 'Anon_W2R7H5',
      content: 'Street lights in residential area have been non-functional for 6 months despite multiple complaints. Safety hazard for pedestrians.',
      category: 'infrastructure',
      severity: 'medium',
      location: 'Riverside Colony',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      credibleVotes: 31,
      suspiciousVotes: 2,
      commentCount: 8,
    },
    {
      id: '5',
      anonymousId: 'Anon_K8M3V2',
      content: 'Public tender process manipulated. Same company winning all contracts with suspiciously similar bid amounts. Pattern suggests coordination.',
      category: 'governance',
      severity: 'high',
      evidenceType: 'document',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      credibleVotes: 67,
      suspiciousVotes: 15,
      commentCount: 23,
    },
  ];
}

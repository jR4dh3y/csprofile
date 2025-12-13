import type { AllstarClipDisplay } from './allstar';
import type { CS2Medal, CS2MusicKit, CS2WeaponSkin } from './steam';

export interface ProfileIdentity {
  handle: string;
  context: string;
  avatarUrl?: string;
  profileUrl?: string;
  medals?: CS2Medal[];
  crosshair?: string;
}

export interface ProfileMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface ProfileTeammate {
  steamId: string;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
}

export interface ClutchData {
  clutch1v1: number | null;
  clutch1v2: number | null;
  clutch1v3: number | null;
}

export interface ProfileData {
  identity: ProfileIdentity;
  metrics: ProfileMetric[];
  clutchStats: ClutchData | null;
  highlights: AllstarClipDisplay[];
  teammates: ProfileTeammate[];
  musicKits: CS2MusicKit[];
  weaponSkins: CS2WeaponSkin[];
  lastUpdated: string;
}

export interface ProfileError {
  code: string;
  message: string;
}

export type ProfileResult = 
  | { success: true; data: ProfileData }
  | { success: false; error: ProfileError };

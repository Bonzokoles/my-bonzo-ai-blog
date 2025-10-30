/**
 * User Profile Management System
 *
 * Zarządza profilami użytkowników z persistentnymi ustawieniami:
 * - Ulubione modele AI
 * - Custom system prompty
 * - Preferowane bazy wiedzy
 * - Ustawienia interfejsu
 */

import type { ChatModelOption, KnowledgeBase, CustomPromptTemplate } from '@/config/ai-chat-models.enhanced';

// ========== TYPES ==========

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: UserSettings;
  customPrompts: CustomPromptTemplate[];
  isActive: boolean;
}

export interface UserSettings {
  // Model preferences
  defaultModel: string;
  favoriteModels: string[];

  // Knowledge base
  defaultKnowledgeBase: string;

  // Custom system prompt
  customSystemPrompt?: string;
  useCustomSystemPrompt: boolean;

  // UI preferences
  theme: 'auto' | 'light' | 'dark';
  streamingEnabled: boolean;
  historyEnabled: boolean;
  sidebarOpen: boolean;

  // Chat preferences
  defaultTemperature: number;
  defaultMaxTokens: number;
  autoSaveConversations: boolean;

  // Notifications
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

// ========== STORAGE KEYS ==========

const STORAGE_KEYS = {
  PROFILES: 'mybonzo-ai-profiles',
  ACTIVE_PROFILE: 'mybonzo-ai-active-profile',
  GUEST_SETTINGS: 'mybonzo-ai-guest-settings'
} as const;

// ========== DEFAULT VALUES ==========

export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultModel: '@cf/meta/llama-3.1-70b-instruct',
  favoriteModels: [
    '@cf/meta/llama-3.1-70b-instruct',
    '@cf/meta/llama-3.1-8b-instruct',
    '@cf/qwen/qwq-32b'
  ],
  defaultKnowledgeBase: 'general',
  customSystemPrompt: undefined,
  useCustomSystemPrompt: false,
  theme: 'auto',
  streamingEnabled: true,
  historyEnabled: true,
  sidebarOpen: true,
  defaultTemperature: 0.7,
  defaultMaxTokens: 2048,
  autoSaveConversations: true,
  notificationsEnabled: false,
  soundEnabled: false
};

// ========== PROFILE MANAGER CLASS ==========

export class UserProfileManager {
  private profiles: UserProfile[] = [];
  private activeProfile: UserProfile | null = null;

  constructor() {
    this.loadProfiles();
    this.loadActiveProfile();
  }

  // ===== Profile Management =====

  createProfile(name: string, settings?: Partial<UserSettings>): UserProfile {
    const now = Date.now();
    const profile: UserProfile = {
      id: `profile-${now}`,
      name,
      createdAt: now,
      updatedAt: now,
      settings: { ...DEFAULT_USER_SETTINGS, ...settings },
      customPrompts: [],
      isActive: false
    };

    this.profiles.push(profile);
    this.saveProfiles();

    return profile;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  getAllProfiles(): UserProfile[] {
    return [...this.profiles];
  }

  updateProfile(id: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): boolean {
    const profileIndex = this.profiles.findIndex(p => p.id === id);
    if (profileIndex === -1) return false;

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updates,
      updatedAt: Date.now()
    };

    this.saveProfiles();

    // Update active profile if it's the one being updated
    if (this.activeProfile?.id === id) {
      this.activeProfile = this.profiles[profileIndex];
    }

    return true;
  }

  deleteProfile(id: string): boolean {
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);

    if (this.profiles.length !== initialLength) {
      this.saveProfiles();

      // If deleted profile was active, switch to guest or first profile
      if (this.activeProfile?.id === id) {
        this.activeProfile = this.profiles.length > 0 ? this.profiles[0] : null;
        this.saveActiveProfile();
      }

      return true;
    }

    return false;
  }

  setActiveProfile(id: string | null): boolean {
    if (id === null) {
      // Guest mode
      this.activeProfile = null;
      this.saveActiveProfile();
      return true;
    }

    const profile = this.getProfile(id);
    if (!profile) return false;

    // Deactivate old profile
    if (this.activeProfile) {
      this.updateProfile(this.activeProfile.id, { isActive: false });
    }

    // Activate new profile
    this.updateProfile(id, { isActive: true });
    this.activeProfile = profile;
    this.saveActiveProfile();

    return true;
  }

  getActiveProfile(): UserProfile | null {
    return this.activeProfile;
  }

  isGuestMode(): boolean {
    return this.activeProfile === null;
  }

  // ===== Settings Management =====

  getSettings(): UserSettings {
    if (this.activeProfile) {
      return this.activeProfile.settings;
    }

    // Guest settings
    return this.loadGuestSettings();
  }

  updateSettings(updates: Partial<UserSettings>): boolean {
    if (this.activeProfile) {
      return this.updateProfile(this.activeProfile.id, {
        settings: { ...this.activeProfile.settings, ...updates }
      });
    } else {
      // Update guest settings
      const currentSettings = this.loadGuestSettings();
      const newSettings = { ...currentSettings, ...updates };
      this.saveGuestSettings(newSettings);
      return true;
    }
  }

  getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.getSettings()[key];
  }

  setSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): boolean {
    return this.updateSettings({ [key]: value } as Partial<UserSettings>);
  }

  // ===== Custom Prompts Management =====

  addCustomPrompt(prompt: Omit<CustomPromptTemplate, 'id' | 'userCreated'>): CustomPromptTemplate | null {
    if (!this.activeProfile) return null;

    const newPrompt: CustomPromptTemplate = {
      ...prompt,
      id: `custom-${Date.now()}`,
      userCreated: true
    };

    const updated = this.updateProfile(this.activeProfile.id, {
      customPrompts: [...this.activeProfile.customPrompts, newPrompt]
    });

    return updated ? newPrompt : null;
  }

  getCustomPrompts(): CustomPromptTemplate[] {
    return this.activeProfile?.customPrompts || [];
  }

  updateCustomPrompt(id: string, updates: Partial<CustomPromptTemplate>): boolean {
    if (!this.activeProfile) return false;

    const promptIndex = this.activeProfile.customPrompts.findIndex(p => p.id === id);
    if (promptIndex === -1) return false;

    const updatedPrompts = [...this.activeProfile.customPrompts];
    updatedPrompts[promptIndex] = {
      ...updatedPrompts[promptIndex],
      ...updates
    };

    return this.updateProfile(this.activeProfile.id, {
      customPrompts: updatedPrompts
    });
  }

  deleteCustomPrompt(id: string): boolean {
    if (!this.activeProfile) return false;

    const updatedPrompts = this.activeProfile.customPrompts.filter(p => p.id !== id);

    if (updatedPrompts.length !== this.activeProfile.customPrompts.length) {
      return this.updateProfile(this.activeProfile.id, {
        customPrompts: updatedPrompts
      });
    }

    return false;
  }

  // ===== Favorite Models =====

  addFavoriteModel(modelId: string): boolean {
    const settings = this.getSettings();
    if (settings.favoriteModels.includes(modelId)) return false;

    return this.updateSettings({
      favoriteModels: [...settings.favoriteModels, modelId]
    });
  }

  removeFavoriteModel(modelId: string): boolean {
    const settings = this.getSettings();
    const newFavorites = settings.favoriteModels.filter(id => id !== modelId);

    if (newFavorites.length !== settings.favoriteModels.length) {
      return this.updateSettings({ favoriteModels: newFavorites });
    }

    return false;
  }

  isFavoriteModel(modelId: string): boolean {
    return this.getSettings().favoriteModels.includes(modelId);
  }

  // ===== Storage Operations =====

  private loadProfiles(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (stored) {
        this.profiles = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      this.profiles = [];
    }
  }

  private saveProfiles(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  }

  private loadActiveProfile(): void {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
      if (activeId && activeId !== 'null') {
        this.activeProfile = this.getProfile(activeId) || null;
      }
    } catch (error) {
      console.error('Error loading active profile:', error);
      this.activeProfile = null;
    }
  }

  private saveActiveProfile(): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACTIVE_PROFILE,
        this.activeProfile ? this.activeProfile.id : 'null'
      );
    } catch (error) {
      console.error('Error saving active profile:', error);
    }
  }

  private loadGuestSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GUEST_SETTINGS);
      if (stored) {
        return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading guest settings:', error);
    }

    return { ...DEFAULT_USER_SETTINGS };
  }

  private saveGuestSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GUEST_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving guest settings:', error);
    }
  }

  // ===== Export / Import =====

  exportProfile(id: string): string | null {
    const profile = this.getProfile(id);
    if (!profile) return null;

    return JSON.stringify(profile, null, 2);
  }

  importProfile(jsonString: string): UserProfile | null {
    try {
      const profile = JSON.parse(jsonString) as UserProfile;

      // Validate basic structure
      if (!profile.id || !profile.name || !profile.settings) {
        throw new Error('Invalid profile structure');
      }

      // Generate new ID to avoid conflicts
      const newProfile: UserProfile = {
        ...profile,
        id: `profile-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: false
      };

      this.profiles.push(newProfile);
      this.saveProfiles();

      return newProfile;
    } catch (error) {
      console.error('Error importing profile:', error);
      return null;
    }
  }

  // ===== Utilities =====

  resetToDefaults(): boolean {
    return this.updateSettings({ ...DEFAULT_USER_SETTINGS });
  }

  clearAllData(): void {
    this.profiles = [];
    this.activeProfile = null;

    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.GUEST_SETTINGS);
  }
}

// ========== SINGLETON INSTANCE ==========

let profileManagerInstance: UserProfileManager | null = null;

export function getUserProfileManager(): UserProfileManager {
  if (typeof window === 'undefined') {
    // Server-side rendering - return mock
    return new UserProfileManager();
  }

  if (!profileManagerInstance) {
    profileManagerInstance = new UserProfileManager();
  }

  return profileManagerInstance;
}

// ========== HELPER FUNCTIONS ==========

export function isProfileMode(): boolean {
  return !getUserProfileManager().isGuestMode();
}

export function getCurrentSettings(): UserSettings {
  return getUserProfileManager().getSettings();
}

export function updateUserSetting<K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K]
): boolean {
  return getUserProfileManager().setSetting(key, value);
}

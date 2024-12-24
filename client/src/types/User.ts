export interface User {
    _id: string;
    username: string;
    email: string;
    profilePhotoUrl?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    followers: string[];
    following: string[];
    role: 'user' | 'admin' | 'moderator';
    status: 'active' | 'suspended' | 'deleted';
    lastLogin?: Date;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    preferences?: {
      darkMode: boolean;
      notifications: boolean;
    };
    topCreator?: boolean;
    uploadedFilmsCount: number;
    createdAt: Date;
}
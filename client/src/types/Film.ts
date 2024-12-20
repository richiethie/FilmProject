export interface Film {
    _id: string;
    title: string;
    description?: string;
    thumbnailUrl: string;
    filmUrl: string;
    genre?: string;
    series?: {
        _id: string;
        title: string;
    }
    duration?: number;
    rank: number | null;
    views: number;
    visibility: 'private' | 'unlisted' | 'public';
    votes: string[];
    downvotes: string[];
    comments: string[];
    uploadedBy: { username: string; email: string; _id: string };
    createdAt: Date;
}
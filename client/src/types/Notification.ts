export interface Notification {
    _id: string;
    user: string; // Still a string (userId) on the backend
    type: 'Vote' | 'Follow' | 'Comment';
    film?: {
        _id: string;
        thumbnailUrl: string;
        title: string;
    }; // Optional since some notifications (like Follow) don't involve a film
    initiator: {
        _id: string;
        username: string;
        profilePhotoUrl: string;
    };
    commentText?: string;
    createdAt: string;
}
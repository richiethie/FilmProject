export interface Comment {
    _id: string;
    text: string;
    user: { _id: string; username: string };
    createdAt: Date;
}
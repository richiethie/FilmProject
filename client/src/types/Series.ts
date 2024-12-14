import { Film } from "./Film";


export interface Series {
    _id: string;
    title: string;
    description?: string;
    createdBy: {
      _id: string;
      username: string;
      email: string;
    };
    films: Film[]; // Array of Film IDs or Film objects, depending on your use case
    createdAt: Date;
}  
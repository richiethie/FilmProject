import thumbnail from "../assets/img/tumbnail2.jpg"

export interface Film {
    title: string;
    creator: string;
    thumbnail: string;
    genre: string;
    rank: number;
}

// Example film data
export const films: Film[] = [
    { title: "Film 1", creator: "Creator 1", thumbnail: thumbnail, genre: "ACTION", rank: 1},
    { title: "Film 2", creator: "Creator 2", thumbnail: thumbnail, genre: "ROMANCE", rank: 2 },
    { title: "Film 3", creator: "Creator 3", thumbnail: thumbnail, genre: "COMEDY", rank: 3 },
    { title: "Film 4", creator: "Creator 4", thumbnail: thumbnail, genre: "THRILLER", rank: 4},
    { title: "Film 5", creator: "Creator 5", thumbnail: thumbnail, genre: "ACTION", rank: 5 },
    { title: "Film 6", creator: "Creator 6", thumbnail: thumbnail, genre: "DRAMA", rank: 6 },
    { title: "Film 7", creator: "Creator 7", thumbnail: thumbnail, genre: "COMEDY", rank: 7},
    { title: "Film 8", creator: "Creator 8", thumbnail: thumbnail, genre: "HORROR", rank: 8 },
    { title: "Film 9", creator: "Creator 9", thumbnail: thumbnail, genre: "MYSTERY", rank: 9 },
    { title: "Film 10", creator: "Creator 10", thumbnail: thumbnail, genre: "FANTASY", rank: 10}
    // Add more film objects as needed
];
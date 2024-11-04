import thumbnail1 from "../assets/img/thumbnail1.jpg"
import thumbnail2 from "../assets/img/thumbnail2.jpg"
import thumbnail3 from "../assets/img/thumbnail3.jpg"
import thumbnail4 from "../assets/img/thumbnail4.jpg"
import thumbnail5 from "../assets/img/thumbnail5.jpg"
import thumbnail6 from "../assets/img/thumbnail6.jpg"
import thumbnail7 from "../assets/img/thumbnail7.jpg"
import thumbnail8 from "../assets/img/thumbnail8.jpg"
import thumbnail9 from "../assets/img/thumbnail9.jpg"
import thumbnail10 from "../assets/img/thumbnail10.jpg"

export interface Film {
    title: string;
    creator: string;
    thumbnail: string;
    genre: string;
    rank: number;
}

// Example film data
export const films: Film[] = [
    { title: "Film 1", creator: "Creator 1", thumbnail: thumbnail1, genre: "ACTION", rank: 1},
    { title: "Film 2", creator: "Creator 2", thumbnail: thumbnail2, genre: "ROMANCE", rank: 2 },
    { title: "Film 3", creator: "Creator 3", thumbnail: thumbnail3, genre: "COMEDY", rank: 3 },
    { title: "Film 4", creator: "Creator 4", thumbnail: thumbnail4, genre: "THRILLER", rank: 4},
    { title: "Film 5", creator: "Creator 5", thumbnail: thumbnail5, genre: "ACTION", rank: 5 },
    { title: "Film 6", creator: "Creator 6", thumbnail: thumbnail6, genre: "DRAMA", rank: 6 },
    { title: "Film 7", creator: "Creator 7", thumbnail: thumbnail7, genre: "COMEDY", rank: 7},
    { title: "Film 8", creator: "Creator 8", thumbnail: thumbnail8, genre: "HORROR", rank: 8 },
    { title: "Film 9", creator: "Creator 9", thumbnail: thumbnail9, genre: "MYSTERY", rank: 9 },
    { title: "Film 10", creator: "Creator 10", thumbnail: thumbnail10, genre: "FANTASY", rank: 10}
    // Add more film objects as needed
];

export const followedFilms: Film[] = [
    { title: "Film 1", creator: "Creator 1", thumbnail: thumbnail1, genre: "ACTION", rank: 1},
    { title: "Film 2", creator: "Creator 2", thumbnail: thumbnail2, genre: "ROMANCE", rank: 2 },
    { title: "Film 3", creator: "Creator 3", thumbnail: thumbnail3, genre: "COMEDY", rank: 3 },
    { title: "Film 4", creator: "Creator 4", thumbnail: thumbnail4, genre: "THRILLER", rank: 4},
    { title: "Film 5", creator: "Creator 5", thumbnail: thumbnail5, genre: "ACTION", rank: 5 },
    { title: "Film 6", creator: "Creator 6", thumbnail: thumbnail6, genre: "DRAMA", rank: 6 },
    { title: "Film 7", creator: "Creator 7", thumbnail: thumbnail7, genre: "COMEDY", rank: 7},
    { title: "Film 8", creator: "Creator 8", thumbnail: thumbnail8, genre: "HORROR", rank: 8 },
    { title: "Film 9", creator: "Creator 9", thumbnail: thumbnail9, genre: "MYSTERY", rank: 9 },
    { title: "Film 10", creator: "Creator 10", thumbnail: thumbnail10, genre: "FANTASY", rank: 10}
]

export const categories = [
    "All",
    "Romance",
    "Comedy",
    "Action",
    "Thriller",
    "Drama",
    "Mystery",
    "Fantasy",
    "Horror",
  ]
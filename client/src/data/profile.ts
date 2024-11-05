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

import pic1 from "../assets/img/profilePic/pic1.jpg"

export interface Film {
    title: string;
    creator: string;
    thumbnail: string;
    genre: string;
    rank?: number;
    votes: number;
    timePosted: string;
}

// Example film data
export const userFilms: Film[] = [
    { title: "Film 1", creator: "John Doe", thumbnail: thumbnail1, genre: "ACTION", votes: 183, timePosted: "8h"},
    { title: "Film 2", creator: "John Doe", thumbnail: thumbnail2, genre: "ROMANCE", votes: 266, timePosted: "8h" },
    { title: "Film 3", creator: "John Doe", thumbnail: thumbnail3, genre: "COMEDY", rank: 3, votes: 12845, timePosted: "8h" },
    { title: "Film 4", creator: "John Doe", thumbnail: thumbnail4, genre: "THRILLER", votes: 561, timePosted: "8h"},
    { title: "Film 5", creator: "John Doe", thumbnail: thumbnail5, genre: "ACTION", rank: 5, votes: 9826, timePosted: "8h" },
    { title: "Film 6", creator: "John Doe", thumbnail: thumbnail6, genre: "DRAMA", votes: 331, timePosted: "8h" },
    { title: "Film 7", creator: "John Doe", thumbnail: thumbnail7, genre: "COMEDY", votes: 278, timePosted: "8h"},
    { title: "Film 8", creator: "John Doe", thumbnail: thumbnail8, genre: "HORROR", rank: 8, votes: 5497, timePosted: "8h" },
    { title: "Film 9", creator: "John Doe", thumbnail: thumbnail9, genre: "MYSTERY", votes: 1012, timePosted: "8h" },
    { title: "Film 10", creator: "John Doe", thumbnail: thumbnail10, genre: "FANTASY", rank: 10, votes: 3909, timePosted: "8h"}
    // Add more film objects as needed
];

export interface User {
    name: string;
    username: string;
    userProfilePic: string;
    followers: number;
    following: number;
    bio: string;
    films: Film[];
}

export const exampleUser: User = {
    name: "John Doe",
    username: "johndoe",
    userProfilePic: pic1,
    followers: 120,
    following: 80,
    bio: "Film enthusiast. Lover of storytelling through visuals.",
    films: userFilms 
};
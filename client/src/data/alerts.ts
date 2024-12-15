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

export interface Alert {
    user: string;
    thumbnail: string;
    userProfilePic: string;
    time: string;
    notificationType: string;
}

export const alerts: Alert[] = [
    { user: "PixelPioneer23", userProfilePic: pic1, thumbnail: thumbnail1, time: "20m", notificationType: "Vote"},
    { user: "EchoChaser", userProfilePic: pic1, thumbnail: thumbnail2, time: "36m", notificationType: "Follow"},
    { user: "NebulaNomad", userProfilePic: pic1, thumbnail: thumbnail3, time: "1h", notificationType: "Vote"},
    { user: "CodeCrafterX", userProfilePic: pic1, thumbnail: thumbnail4, time: "1h", notificationType: "Vote"},
    { user: "AuroraGleam", userProfilePic: pic1, thumbnail: thumbnail5, time: "2h", notificationType: "Vote" },
    { user: "WhirlwindWizard", userProfilePic: pic1, thumbnail: thumbnail6, time: "4h", notificationType: "Vote" },
    { user: "FrostedQuasar", userProfilePic: pic1, thumbnail: thumbnail7, time: "6h", notificationType: "Follow"},
    { user: "ShadowDiver88", userProfilePic: pic1, thumbnail: thumbnail8, time: "10h", notificationType: "Follow" },
    { user: "GlimmerHawk", userProfilePic: pic1, thumbnail: thumbnail9, time: "12h", notificationType: "Vote" },
    { user: "ThunderScribe", userProfilePic: pic1, thumbnail: thumbnail10, time: "2d", notificationType: "Vote"}
]
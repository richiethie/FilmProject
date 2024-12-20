# FilmShare

FilmShare is a platform designed for film school students and creators to share short films under 10 minutes. Users can connect, follow one another, and view a curated feed of films from creators they follow. The platform also features a ranking system to highlight top-rated films.

---

## Features

- **User Authentication**: Sign up, log in, and manage your profile.
- **Short Film Sharing**: Upload and share short films under 10 minutes.
- **Follow System**: Follow other creators to view their content on your personalized feed.
- **Curated Feed**: Display films from creators you follow.
- **Ranking System**: Rank films based on user votes and feedback.

---

## Tech Stack

### Frontend
- **React** (with Vite)
- **TypeScript**
- **CSS Modules**
- **Tailwind CSS**
- **Chakra UI**
- **Poppins Font** for a modern, clean aesthetic

### Backend
- **Node.js**
- **Express** (organized in a routes folder)

### Database
- **MongoDB**
- **Hosted on MongoDB Atlas**

### Storage
- **AWS S3** for bucket storage of videos and thumbnails

### Deployment
- **Vercel** (Frontend)
- **Render** (Backend)

### Styling
- **Custom Dark Theme**:
  - `bg-charcoal`, `text-crispWhite`, `border-steelGray`
  - `shadow-inner`, `shadow-secondary`
  - Focus and hover states with `cornflowerBlue`

---

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- MongoDB instance (local or hosted)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/richiethie/filmshare.git
   cd filmshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Contact me for access (richiethie@gmail.com)
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGO_URI=your_mongo_database_url
     PORT=your_backend_port
     JWT_SECRET=your_jwt_secret
     ```

4. Start the application:
   - **Frontend**: Run
     ```bash
     npm run dev:frontend
     ```
   - **Backend**: Run
     ```bash
     npm run dev
     ```

5. Open your browser and navigate to `http://localhost:5173` to view the app.

---

## Folder Structure

```plaintext
filmshare/
├── client/         # React frontend source code
├── server/          # Express server source code
└── README.md         # Project documentation
```

---

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgements

- **Poppins Font** for its clean and modern typography.
- Community feedback and support for shaping the platform.

---

## Contact

For questions or suggestions, please reach out through [richiethie.com](https://richiethie.com/) or your preferred communication channels.

require('dotenv').config();
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Film = require('./models/Film');
const Vote = require('./models/Vote');
const Series = require('./models/Series');
const Genre = require('./models/Genre');
const Comment = require('./models/Comment');

const NUM_USERS = 100;
const NUM_FILMS = 100;
const NUM_GENRES = 5;
const NUM_SERIES = 10;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB!');
    
    // Seed Users
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const password = faker.internet.password();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        passwordHash,
        profileImage: faker.image.avatar(),
        bio: faker.lorem.sentences(),
      });
      await user.save();
      users.push(user);
    }
    console.log(`${NUM_USERS} users created.`);

    // Seed Genres
    const genres = [];
    for (let i = 0; i < NUM_GENRES; i++) {
      const genre = new Genre({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });
      await genre.save();
      genres.push(genre);
    }
    console.log(`${NUM_GENRES} genres created.`);

    // Seed Films
    const films = [];
    for (let i = 0; i < NUM_FILMS; i++) {
      const film = new Film({
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
        thumbnailUrl: faker.image.imageUrl(),
        filmUrl: faker.internet.url(),
        genre: genres[Math.floor(Math.random() * genres.length)]._id,
        series: Math.random() > 0.5 ? new mongoose.Types.ObjectId() : null,
        duration: faker.datatype.number({ min: 10, max: 180 }),
        visibility: ['private', 'unlisted', 'public'][Math.floor(Math.random() * 3)],
        uploadedBy: users[Math.floor(Math.random() * users.length)]._id,
      });
      await film.save();
      films.push(film);
    }
    console.log(`${NUM_FILMS} films created.`);

    // Seed Series
    for (let i = 0; i < NUM_SERIES; i++) {
      const series = new Series({
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
        createdBy: users[Math.floor(Math.random() * users.length)]._id,
        films: films.slice(0, 5).map(film => film._id),
      });
      await series.save();
    }
    console.log(`${NUM_SERIES} series created.`);

    // Seed Comments
    for (let i = 0; i < NUM_FILMS; i++) {
      const commentsCount = faker.datatype.number({ min: 0, max: 10 });
      for (let j = 0; j < commentsCount; j++) {
        const comment = new Comment({
          content: faker.lorem.sentence(),
          postedBy: users[Math.floor(Math.random() * users.length)]._id,
          film: films[i]._id,
        });
        await comment.save();
      }
    }
    console.log('Comments added to films.');

    // Seed Votes (Likes and Dislikes)
    for (let i = 0; i < NUM_FILMS; i++) {
      const votesCount = faker.datatype.number({ min: 0, max: 20 });
      for (let j = 0; j < votesCount; j++) {
        const vote = new Vote({
          user: users[Math.floor(Math.random() * users.length)]._id,
          film: films[i]._id,
          type: ['like', 'dislike'][Math.floor(Math.random() * 2)],
        });
        await vote.save();
      }
    }
    console.log('Votes added to films.');

    // Close the connection
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

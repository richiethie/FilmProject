const Film = require('../models/Film');
const Series = require('../models/Series');
const mongoose = require('mongoose');

exports.addSeries = async (req, res) => {
    const { filmId, seriesId } = req.body;

    try {
        // Find the film and series
        const film = await Film.findById(filmId);
        if (!film) {
            return res.status(404).json({ message: 'Film not found' });
        }

        const series = await Series.findById(seriesId);
        if (!series) {
            return res.status(404).json({ message: 'Series not found' });
        }

        // Check if the film is already in the series
        if (!series.films.includes(filmId)) {
            series.films.push(filmId); // Add the film to the series
            await series.save();
        }

        // Update the film's series attribute
        film.series = seriesId; // Assign the series ID to the film
        await film.save();
        res.status(200).json({ message: 'Film added to series', film, series });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUserSeries = async (req, res) => {
    const { userId } = req.params;
    try {
        const series = await Series.find({ createdBy: userId })
            .populate('films', 'title genre thumbnailUrl description') // Populate film details
            .exec();

        if (!series) {
            return res.status(404).json({ message: 'No series found for this user' });
        }

        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSeriesById = async (req, res) => {
    const { seriesId } = req.params;
    try {
        const series = await Series.findById(seriesId)
            .populate('films', 'title genre thumbnailUrl description')
            .populate('createdBy', 'username _id')
            .exec();
        if (!series) {
            return res.status(404).json({ message: 'No series found for this user' });
        }
        res.status(200).json(series);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
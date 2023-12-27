const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'tour',
    required: [true, 'Favourite must belongs to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'Favourite must belongs to a User!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
FavouriteSchema.index({ tour: 1, user: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;

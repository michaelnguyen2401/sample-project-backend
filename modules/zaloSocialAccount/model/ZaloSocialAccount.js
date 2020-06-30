const { ObjectId, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const followingSchema = require('./ZaloSocialAccountFollowing');

const zaloOASchema = new Schema({
  id: ObjectId,
  birthday: String,
  gender: String,
  name: String,
  avatar: String,
  avatars: Object,
  createdAt: Date,
  lastModified: Date,
  phoneNumber: { type: String, unique: true },
  followings: [followingSchema],
  address: Object,
});

zaloOASchema.plugin(mongoosePaginate);
zaloOASchema.methods.getFollowingByCleverOAId = function getFollowingByCleverOAId(cleverOAId) {
  return this.followings.find((item) => {
    console.log('item.cleverOAId.toString()', item.cleverOAId.toString());
    console.log('cleverOAId.toString()', cleverOAId.toString());
    return item.cleverOAId.toString() === cleverOAId.toString();
  });
};

zaloOASchema.methods.getFollowingByZaloOAId = function getFollowingByZaloOAId(zaloOAId) {
  return this.followings.find((item) => {
    console.log('item.oaId.toString()', item.oaId.toString());
    console.log('zaloOAId.toString()', zaloOAId.toString());
    return item.oaId.toString() === zaloOAId.toString();
  });
};

module.exports = zaloOASchema;

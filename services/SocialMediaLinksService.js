const factory = require("./handllerFactory");
const SocialMediaLinks = require("../models/socialMediaLinksModel");

// create new SocialMediaLinks
exports.createSocialMediaLinks = factory.createOne(SocialMediaLinks);
// get all SocialMediaLinks

exports.getSocialMediaLinks = factory.getAll(
  SocialMediaLinks,
  "SocialMediaLinks"
);

// get single SocialMediaLinks

exports.getSingleSocialMediaLink = factory.getOne(SocialMediaLinks);

// update single SocialMediaLinks
exports.updateSocialMediaLink = factory.updateOne(SocialMediaLinks);

// delete single SocialMediaLink
exports.deleteSocialMediaLinks = factory.deleteOne(SocialMediaLinks);

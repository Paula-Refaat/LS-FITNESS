const factory = require("./handllerFactory");
const ContactUs = require("../models/contactUsModel");

exports.createContactUs = factory.createOne(ContactUs);

exports.getContactUs = factory.getAll(ContactUs, "ContactUs");

exports.getSingleContactUs = factory.getOne(ContactUs);

exports.updateContactUs = factory.updateOne(ContactUs);

exports.deleteContactUs = factory.deleteOne(ContactUs);

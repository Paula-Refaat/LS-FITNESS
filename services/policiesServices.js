const factory = require("./handllerFactory");
const Policies = require("../models/policiesModel");

exports.getPolicies = factory.getAll(Policies, "Policies");

exports.getSinglePolicy = factory.getOne(Policies);

exports.updatePolicy = factory.updateOne(Policies);

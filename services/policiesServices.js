const factory = require("./handllerFactory");
const Policies = require("../models/policiesModel");

exports.createPolicy = factory.createOne(Policies);

exports.getPolicies = factory.getAll(Policies, "Policies");

exports.getSinglePolicy = factory.getOne(Policies);

exports.updatePolicy = factory.updateOne(Policies);

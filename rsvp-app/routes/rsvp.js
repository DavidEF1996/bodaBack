const express = require("express");
const { db } = require("../config/firebase");
const asyncHandler = require("../shared/http/asyncHandler");

const RsvpRepository = require("../modules/rsvp/rsvp.repository");
const RsvpService = require("../modules/rsvp/rsvp.service");
const RsvpController = require("../modules/rsvp/rsvp.controller");

const router = express.Router();

const rsvpRepository = new RsvpRepository({ db });
const rsvpService = new RsvpService({ rsvpRepository });
const rsvpController = new RsvpController({ rsvpService });

router.post("/", asyncHandler(rsvpController.create));

module.exports = router;

const ApiError = require("../../shared/errors/ApiError");

class RsvpController {
  constructor({ rsvpService }) {
    this.rsvpService = rsvpService;
    this.create = this.create.bind(this);
  }

  async create(req, res) {
    if (!req.is("application/json")) {
      throw new ApiError(415, "Content-Type debe ser application/json");
    }

    const response = await this.rsvpService.createRsvp(req.body);

    return res.status(201).json({
      ok: true,
      message: response.message,
      data: {
        rsvpId: response.rsvpId,
      },
    });
  }
}

module.exports = RsvpController;

const ApiError = require("../../shared/errors/ApiError");

class RsvpService {
  constructor({ rsvpRepository }) {
    this.rsvpRepository = rsvpRepository;
  }

  async createRsvp(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new ApiError(400, "El body debe ser un JSON valido.");
    }

    const token = typeof payload.token === "string" ? payload.token.trim().toUpperCase() : "";
    const nombre = typeof payload.nombre === "string" ? payload.nombre.trim() : "";
    const apellido = typeof payload.apellido === "string" ? payload.apellido.trim() : "";
    const telefono = typeof payload.telefono === "string" ? payload.telefono.trim() : "";
    const asistentes = Number(payload.asistentes);

    if (!token) throw new ApiError(400, "token es obligatorio.");
    if (!nombre) throw new ApiError(400, "nombre es obligatorio.");
    if (!apellido) throw new ApiError(400, "apellido es obligatorio.");
    if (!telefono) throw new ApiError(400, "telefono es obligatorio.");
    if (!Number.isFinite(asistentes) || asistentes < 0) {
      throw new ApiError(400, "asistentes debe ser un numero mayor o igual a 0.");
    }

    const normalizedPayload = {
      token,
      nombre,
      apellido,
      telefono,
      asistentes,
      usado: true,
      fechaConfirmacion: new Date().toISOString(),
    };

    const result = await this.rsvpRepository.create(normalizedPayload);

    return {
      message: "RSVP guardado correctamente.",
      rsvpId: result.id,
    };
  }
}

module.exports = RsvpService;

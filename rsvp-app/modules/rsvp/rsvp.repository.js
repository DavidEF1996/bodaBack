const ApiError = require("../../shared/errors/ApiError");

class RsvpRepository {
  constructor({ db }) {
    this.db = db;
    this.collectionName = "tokens";
  }

  async create(rsvpPayload) {
    const tokenId = rsvpPayload.token;
    const docRef = this.db.collection(this.collectionName).doc(tokenId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      throw new ApiError(404, "Token no encontrado.");
    }

    const current = snapshot.data() || {};
    if (current.usado === true) {
      throw new ApiError(409, "Este token ya fue registrado.");
    }

    await docRef.set(
      {
        nombre: rsvpPayload.nombre,
        apellido: rsvpPayload.apellido,
        telefono: rsvpPayload.telefono,
        asistentes: rsvpPayload.asistentes,
        usado: rsvpPayload.usado,
        fechaConfirmacion: rsvpPayload.fechaConfirmacion,
      },
      { merge: true }
    );

    return { id: tokenId };
  }
}

module.exports = RsvpRepository;

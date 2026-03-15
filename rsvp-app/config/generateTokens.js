const { db } = require("./firebase.js");
const fs = require("fs");
const path = require("path");

function generateToken(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/I/1 pa que no confundan
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

async function tokenExists(token) {
  const doc = await db.collection("tokens").doc(token).get();
  return doc.exists;
}

async function createTokens({ amount = 200, length = 8, maxAttempts = 10000 }) {
  const created = [];
  let attempts = 0;

  console.log(`Generando ${amount} tokens de ${length} caracteres...`);

  while (created.length < amount) {
    if (attempts++ > maxAttempts) {
      throw new Error("Demasiados intentos generando tokens. Aumenta length o maxAttempts.");
    }

    const token = generateToken(length);

    // evita duplicados en memoria
    if (created.includes(token)) continue;

    // evita duplicados en Firestore
    if (await tokenExists(token)) continue;

    await db.collection("tokens").doc(token).set({
      usado: false,
      nombre: "",
      telefono: "",
      asistentes: 0,
      fechaConfirmacion: null,
    });

    created.push(token);

    if (created.length % 20 === 0) {
      console.log(`... ${created.length}/${amount}`);
    }
  }

  return created;
}

function saveCsv(tokens, baseUrl) {
  const outDir = path.join(__dirname, "..", "exports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const file = path.join(outDir, `tokens_${tokens.length}.csv`);
  const lines = ["token,link"];

  for (const t of tokens) {
    // link general (no token en URL), porque el token lo meten en el formulario
    lines.push(`${t},${baseUrl}`);
  }

  fs.writeFileSync(file, lines.join("\n"), "utf8");
  return file;
}

(async () => {
  try {
    // Cambia esto a tu URL real cuando la publiques
    const RSVP_URL = "http://localhost:3000/rsvp";

    const tokens = await createTokens({ amount: 200, length: 8 });
    console.log("✅ Tokens creados.");

    const csvFile = saveCsv(tokens, RSVP_URL);
    console.log("✅ CSV generado:", csvFile);

    console.log("\nEjemplo para WhatsApp:");
    console.log(`Link: ${RSVP_URL}`);
    console.log(`Código: ${tokens[0]}`);

    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e);
    process.exit(1);
  }
})();
const { db } = require("./firebase");

const COLLECTION = process.env.TOKENS_COLLECTION || "tokens";
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 400);

async function deleteBatch() {
  const snapshot = await db.collection(COLLECTION).limit(BATCH_SIZE).get();
  if (snapshot.empty) return 0;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return snapshot.size;
}

(async () => {
  try {
    let totalDeleted = 0;
    console.log(`Limpiando colección "${COLLECTION}"...`);

    while (true) {
      const deleted = await deleteBatch();
      if (deleted === 0) break;

      totalDeleted += deleted;
      console.log(`... eliminados ${deleted} | total ${totalDeleted}`);
    }

    console.log(`✅ Colección "${COLLECTION}" limpia. Total eliminados: ${totalDeleted}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error limpiando tokens:", error);
    process.exit(1);
  }
})();

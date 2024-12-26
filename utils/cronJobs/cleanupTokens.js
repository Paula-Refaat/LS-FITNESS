// const cron = require("node-cron");
// const BlacklistedToken = require("../../models/blacklistedTokenModel");

// // تشغيل المهمة يوميًا في منتصف الليل
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("🔄 Starting manual cleanup for expired tokens...");
//     const result = await BlacklistedToken.deleteMany({
//       expiresAt: { $lte: new Date() },
//     });
//     console.log(`✅ ${result.deletedCount} expired tokens cleaned up manually`);
//   } catch (err) {
//     console.error("❌ Failed to clean expired tokens manually:", err);
//   }
// });

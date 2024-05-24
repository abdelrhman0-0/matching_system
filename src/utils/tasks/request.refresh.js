const cron = require("node-cron");
const RequestService = require("../../domain/services/request.service");

const refreshRequests = async () => {
  try {
    const _res = await RequestService.refreshRequests();
    console.log("Requests refreshed successfully!");
  } catch (_err) {
    console.error(_err);
  }
};

module.exports = cron.schedule("0 0 */3 * *", async () => {
  await refreshRequests();
});

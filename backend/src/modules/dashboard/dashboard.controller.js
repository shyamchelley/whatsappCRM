const dashboardService = require('./dashboard.service');

async function getStats(req, res, next) {
  try { res.json(await dashboardService.getStats()); } catch (err) { next(err); }
}

async function getBySource(req, res, next) {
  try { res.json(await dashboardService.getBySource()); } catch (err) { next(err); }
}

async function getByStage(req, res, next) {
  try { res.json(await dashboardService.getByStage()); } catch (err) { next(err); }
}

async function getRecent(req, res, next) {
  try { res.json(await dashboardService.getRecent()); } catch (err) { next(err); }
}

async function getReminders(req, res, next) {
  try { res.json(await dashboardService.getUpcomingReminders(req.user.id)); } catch (err) { next(err); }
}

module.exports = { getStats, getBySource, getByStage, getRecent, getReminders };

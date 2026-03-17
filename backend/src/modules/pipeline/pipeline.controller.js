const pipelineService = require('./pipeline.service');

async function getBoard(req, res, next) {
  try {
    const board = await pipelineService.getBoard(req.user.role, req.user.id);
    res.json(board);
  } catch (err) { next(err); }
}

async function getStages(req, res, next) {
  try { res.json(await pipelineService.getStages()); } catch (err) { next(err); }
}

async function createStage(req, res, next) {
  try {
    const stage = await pipelineService.createStage(req.body);
    res.status(201).json(stage);
  } catch (err) { next(err); }
}

async function updateStage(req, res, next) {
  try {
    const stage = await pipelineService.updateStage(req.params.id, req.body);
    res.json(stage);
  } catch (err) { next(err); }
}

async function deleteStage(req, res, next) {
  try {
    await pipelineService.deleteStage(req.params.id);
    res.json({ message: 'Stage deleted' });
  } catch (err) { next(err); }
}

async function reorderStages(req, res, next) {
  try {
    const stages = await pipelineService.reorderStages(req.body.ids);
    res.json(stages);
  } catch (err) { next(err); }
}

module.exports = { getBoard, getStages, createStage, updateStage, deleteStage, reorderStages };

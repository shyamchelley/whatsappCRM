const Joi = require('joi');

const createLead = Joi.object({
  name: Joi.string().max(150).allow('', null),
  phone: Joi.string().max(30).required(),
  email: Joi.string().email().allow('', null),
  source: Joi.string().valid('whatsapp', 'website', 'manual').default('manual'),
  stage_id: Joi.number().integer(),
  assigned_to: Joi.number().integer().allow(null),
  deal_value: Joi.number().min(0).default(0),
});

const updateLead = Joi.object({
  name: Joi.string().max(150).allow('', null),
  phone: Joi.string().max(30),
  email: Joi.string().email().allow('', null),
  assigned_to: Joi.number().integer().allow(null),
  deal_value: Joi.number().min(0),
  lost_reason: Joi.string().allow('', null),
});

const moveStage = Joi.object({
  stage_id: Joi.number().integer().required(),
});

module.exports = { createLead, updateLead, moveStage };

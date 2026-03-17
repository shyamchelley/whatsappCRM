exports.seed = async function (knex) {
  await knex('pipeline_stages').del();

  await knex('pipeline_stages').insert([
    { name: 'New Lead',     order_index: 1, color: '#6366f1', is_terminal: false, is_won: false },
    { name: 'Contacted',    order_index: 2, color: '#3b82f6', is_terminal: false, is_won: false },
    { name: 'Qualified',    order_index: 3, color: '#8b5cf6', is_terminal: false, is_won: false },
    { name: 'Proposal',     order_index: 4, color: '#f59e0b', is_terminal: false, is_won: false },
    { name: 'Negotiation',  order_index: 5, color: '#f97316', is_terminal: false, is_won: false },
    { name: 'Won',          order_index: 6, color: '#22c55e', is_terminal: true,  is_won: true  },
    { name: 'Lost',         order_index: 7, color: '#ef4444', is_terminal: true,  is_won: false },
  ]);
};

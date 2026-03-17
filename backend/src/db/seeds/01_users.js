const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      name: 'Sales Agent',
      email: 'agent@crm.com',
      password: await bcrypt.hash('agent123', 10),
      role: 'agent',
    },
  ]);
};


exports.up = function(knex) {
  return knex.schema
    .createTable('climb', function (table) {
      table.string('id');
      table.string('name');
      table.string('type');
      table.string('source');
      table.string('raw');
      table.timestamps(true, true);
    })
    .createTable('area', function (table) {
      table.string('id');
      table.string('name');
      table.string('type');
      table.string('source');
      table.boolean('is_state')
      table.string('raw');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('climb')
    .dropTable('area');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('attacks').del()
  await knex('attacks').insert([
    {mission: 1, attack: 1 , variant: 1, description: 'This is not a real', goal: 'Kill the enemy' , assumptions: 'We assume the enemy will BEG for mercy', mission_impact: 'The enemy lost major comms' , mission_impact_score: 8 , likelihood: 'Likely', likelihood_score: 5 , event_id: 1}
  ]);
};

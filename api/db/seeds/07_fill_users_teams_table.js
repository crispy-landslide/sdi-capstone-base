const { faker } = require('@faker-js/faker');
const { getRandomNumber } = require('../../utils/seedUtils.js');
const fs = require('fs');
const path = require("path");

const fillTeams = (users) =>{
  const attackList = [];
  for(let i = 0; i < users.length; i++){
    // console.log(users[i])
    attackList.push({
      user_email: users[i], 
      team_id: getRandomNumber(1, 4001), 
      role: faker.lorem.word()
    });
  }

  return attackList;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  await knex('users_teams').select('*')
  .then((rows) => {
    if (rows.length === 0) {
      try {
        const emailList = fs.readFileSync(path.resolve(__dirname, '../../utils/seedEmails.txt'), {encoding:'utf8', flag:'r'}).split('\n');
        if(emailList[emailList.length - 1] == ''){
          emailList.pop()
        }
        return knex('users_teams').insert(fillTeams(emailList));
      
      } catch (err) {
        console.error(err);
      }  
    }
  })
};

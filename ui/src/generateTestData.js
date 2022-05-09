const { faker } = require('@faker-js/faker');

export const makeTestEvents = (num) => {
  let testEvents = []
  let start = new Date()
  let end = new Date()
  for (let i = 0; i < num; i++) {
    let testEvent = {
      name: `System ${i + 1} CTT`,
      id: i + 1,
      description: faker.lorem.sentences(Math.floor(Math.random() * (20 + 1 - 10)) + 10),
      start_date: start.toDateString(),
      end_date: (new Date(end.setTime(start.getTime() + 60 * 60 * 24 * 3 * 1000))).toDateString()
    }
    testEvents.push(testEvent)
  }
  return testEvents
}


export const makeTestUsers = (num) => {
  let testUsers = []
  for (let i = 0; i < num; i++) {
    let testUser = {
      name: faker.name.firstName(),
      is_admin: Math.floor(Math.random() * (1 + 1)),
      is_editor: Math.floor(Math.random() * (1 + 1))
    }
    testUsers.push(testUser)
  }
  return testUsers
}

export const makeTestAttacks = (num) => {
  let testAttacks = []
  for (let i = 0; i < num; i++) {
    let testAttack = {
      id: i,
      mission: Math.floor(Math.random() * (6 + 1 - 1)) + 1,
      attack: i,
      variant: 1,
      description: faker.lorem.sentences(Math.floor(Math.random() * (10 + 1 - 1)) + 1),
      goal: faker.lorem.sentences(Math.floor(Math.random() * (10 + 1 - 1)) + 1),
      assumptions: faker.lorem.sentences(Math.floor(Math.random() * (10 + 1 - 1)) + 1),
      mission_impact: faker.lorem.sentences(Math.floor(Math.random() * (10 + 1 - 1)) + 1),
      mission_impact_score: Math.floor(Math.random() * (5 + 1 - 1)) + 1,
      likelihood: faker.lorem.sentences(Math.floor(Math.random() * (10 + 1 - 1)) + 1),
      likelihood_score: Math.floor(Math.random() * (5 + 1 - 1)) + 1,
      event_id: Math.floor(Math.random() * (10 + 1 - 1)) + 1,
    }
    testAttacks.push(testAttack)
  }
  return testAttacks
}

export const makeTestTeams = (num) => {
  let testTeams = []
  for (let i = 0; i < num; i++) {
    let testTeam = {
      name: `Team ${i}`
    }
    testTeams.push(testTeam)
  }
  return testTeams
}


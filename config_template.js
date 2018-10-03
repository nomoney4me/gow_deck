module.exports = {
  db_path: `./gow.db`,
  db_selection: {
    users: {
      title: `Users`,
      value: `users`
    },
    troops: {
      title: `Troops`,
      value: `troops`,
      url: `http://gowdb.com/api/troops`
    },
    spells: {
      title: `Spells`,
      value: `spells`,
      url: `http://gowdb.com/api/spells`,
    },
    classes: {
      title: `Classes`,
      value: `classes`,
      url: `http://gowdb.com/api/classes`,
    },
    traits: {
      title: `Traits`,
      value: `traits`,
      url: `http://gowdb.com/api/traits`,
    },
    weapons: {
      title: `Weapons`,
      value: `weapons`,
      url: `http://gowdb.com/api/weapons`,
    },
    traitstones: {
      title: `Traitstones`,
      value: `traitstones`,
      url: `http://gowdb.com/api/traitstones`,
    },
  }, 
  api_fnc: {
    gow_url: `https://pcmob-prod.parse.gemsofwar.com/call_function`,
    get_hero_profile: {
      functionName: 'get_hero_profile',
      username: null,
      password: null,
      clientVersion: '4.0.0.08',
    },
  }
}
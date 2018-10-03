const router = require('express').Router()
      , fetch = require('node-fetch')
      , fs = require('fs')
      , { api_fnc, db_path } = require('../config')
      , moment = require('moment')
      , Promise = require('bluebird')
      , knex = require('knex')({
				client: 'sqlite3',
				connection: {
					filename: db_path
				}
			})

let fetchProfile = (NameCode) => {
  let query = knex('users')
    .where('username', NameCode)
    .andWhere('timestamp', '>', moment().subtract(30, "minutes").format('YYYY-MM-DD HH:mm:ss.SSS'))

  console.log(query.toString())

  return query.select().then(rows => {
    // console.log(rows)
    // # update profile if either record is too old or not exists
    if(rows.length < 1) {
      console.log('fetching from gow api')

      api_fnc.get_hero_profile.NameCode = NameCode;
      return fetch(api_fnc.gow_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(api_fnc.get_hero_profile)
      }).then(resp => resp.json()).then(data => {
        return knex('users').insert({
          username: NameCode,
          timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
          data: JSON.stringify(data)
        })
      })
    }
  })
  .then(() => {
    // # pull data from gow.db
    return query.select()
      .orderBy('timestamp', 'desc')
    .then(data => data[0])
  })
}



  router.post('/GetUserProfile', (req, res) => {
    if(req.body.NameCode) {
      fetchProfile(req.body.NameCode).then(data => {
        return JSON.parse(data.data).result.ProfileData
      })
      .then(data => {
        let Troops = data.Troops;

        let TroopsArray = Object.entries(Troops).filter(item => {
          if(item[0] > 1) return true
          else return false
        }).map(troop => {
          // console.log(troop[0])
          if(troop[0] > 1) return troop[0]
        }, [])
        // console.log(TroopsCollection)

        let query = knex('troops').select(
          // [
          //   'id', 'name',	'rarity',	'kingdomId',	'type',	
          //   'printf as colors',	'spellId',	'description',	'rarityId',	
          //   'typeCode1',	'typeCode2',	'maxArmor',	'maxLife',
          //   'maxAttack',	'maxMagic',	'kingdomName',	'imageUrl',	
          //   'pageUrl'
          // ]
        )
          .whereIn('id', TroopsArray)
          .andWhereNot('kingdomName', 'The Vault')

        query.then(rows => {
          Object.entries(rows).map(row => {
            let hex = parseInt(row[1].colors).toString(16)
            Troops[row[1].id] = {...Troops[row[1].id], ...row[1], hexColor: hex }
          }, {})

          return Troops
        })
        .then(Troops => {
          // console.log(Troops)
          return Object.entries(Troops).filter(troop => {
            // console.log(troop)
            if(!troop[1].name) return false
            else return true
          }).map(troop => {
            return troop[1]
          })
        })
        .then(Troops => {
          res.json(Troops)
        })
      })
      .catch(e => {
        res.json({err: e})
      })
    }else {
      res.json({err: 'invalid NameCode'})
    }
  })


  



module.exports = router;
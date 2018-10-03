const fetch = require('node-fetch')
			, config = require('./config.js')
			, Promise = require('bluebird')
			, knex = require('knex')({
				client: 'sqlite3',
				connection: {
					filename: config.db_path
				}
			})

module.exports = {
	// * working as of 9/20/18
	// * example: getData('http://gowdb.com/api/classes', 'classes').then(data => console.log(data))
	getData: (label, url) => {
		switch(label) {
			default:
				return fetch(url).then(res => res.json()).then(data => data[label])
		}
	},


	// * working as of 9/20/18
	// * note: headers are arrays, ['id', 'foo', 'bar', 'etc', ...]
	// * example: createTable("troops", headers)
	createTable: (table, headers) => {
		// check for exist
		return knex.schema.hasTable(table).then(exists => {
			if(!exists) {
				process.stdout.write(`table '${table}' does not exist, creating...`)
				switch (table) {
					case 'users': 
						return knex.schema.createTable(table, (t) => {
							headers.map(header => {
								switch(header) {
									case 'username':
										return t.text(header)
									case 'timestamp':
										return t.time(header)
									case 'data':
										return t.json(header)
									default:
										return t.text(header)
								}
							})
						}).then(() => {
							console.log(`...table '${table}' has been created`)
						})
					case 'troops':
						// return knex.schema.createTable('troops', (t) => {
						// 	t.increments('uid').primary()
						// 	headers.map(header => {
						// 		switch(header) {
						// 			case 'id':
						// 				t.unique(header).
						// 				break;
						// 			case 'kingdomId':
						// 			case 'colors':
						// 			case 'spellId':
						// 			case 'rareityId':
						// 			case 'maxArmor':
						// 			case 'maxLife':
						// 			case 'maxAttack':
						// 			case 'maxMagic':
						// 				t.integer(header)
						// 				break;
						// 			case 'description':
						// 			case 'imageUrl':
						// 			case 'pageUrl':
						// 				t.text(header)
						// 				break;
						// 			default:
						// 				t.string(header, 255)
						// 				break;
						// 		}
						// 	})
						// }).then(() => {
						// 	console.log('db has been created')
						// })

					case 'spells':
					case 'traits':
					case 'weapons':
					case 'traitstones':
					case 'classes': 
						
					default:
						return knex.schema.createTable(table, (t) => {
							t.increments('uid').primary
							headers.map(header => {
								t.text(header)
							})
						}).then(() => {
							console.log(`...table '${table}' has been created`)
						})
				}
			}
		})
	},



	// * working as of 9/20/18
	// * 
	populateTable: (table, data) => {
		// data: [{}]
		switch(table) {
			default:
				return knex.transaction(trx => {
					return Promise.map(data, (insertData, index) => {
						return trx.insert(insertData).into(table)
					})
				})
				.catch(e => {
					throw `knex error: \n ${e}`
				})
		}
	}

}
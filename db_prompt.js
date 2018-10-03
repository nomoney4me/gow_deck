const Promise = require('bluebird')
      , config = require('./config.js')
			, prompts = require('prompts')
			, fs = require('fs')
			, sqlite3 = require('sqlite3')
			, { getData, createTable, populateTable } = require('./db_builder.js')
			, { exec } = require('child_process')

let choices = () => {
	return Object.entries(config.db_selection).map((item, index) => {
		return item[1]
	}, [])
}

const ask = () => {
	return prompts(customPrompts).then(answers => {
		return Promise.try(() => {
			if(answers.confirm) return buildDB(answers.q1)
		})
	}).then(() => {
		return prompts({
			type:'confirm',
			message: 'Are you done?',
			name: 'done'
		}).then(answer => {
			if(!answer.done) return ask()
			else {
				Promise.try(() => {
					console.log('api server listening on 3000...')
				}).then(() => {
					return exec('nodemon server.js', (err, stdout, stderr) => {
						if(err) {
							throw err
						}else {
							console.log(stdout)
							console.log(stderr)
						}
					})
				})
			}
		})
	})
}

const buildDB = (dbs) => {
	return Promise.map(dbs, (dbname) => {
		switch(dbname) {
			case 'users':
				return createTable(dbname, ['username', 'timestamp', 'data'])
			default: 
				return Promise.try(() => {
					return getData(dbname, config.db_selection[dbname].url)
				}).then(data => {
					let headers = Object.entries(data[0]).map(item => item[0])
					return createTable(dbname, headers).then(() => { return data })
				})
				.then(data => {
					process.stdout.write(`populating '${dbname}' table...`)
					return populateTable(dbname, data)
				}).then(() => {
					console.log(`${dbname} is fully updated`)
				})
		}
		
	}).then(() => {
		console.log('everything is done')
	})
}

let customPrompts = [
	{	
		type: 'multiselect',
		name: 'q1',
		message: 'Pick a database to build',
		choices: choices
	},
	{
		type: 'confirm',
		name: 'confirm',
		message: 'Are you sure?'
	}
]


Promise.try(() => {
	if(!fs.existsSync(config.db_path)) {
		console.log('db file does not exist, creating...')
		let db = new sqlite3.Database(config.db_path)
	}
}).then(() => {
	return ask()
})
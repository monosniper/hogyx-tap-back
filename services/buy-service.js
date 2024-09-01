require('dotenv').config();
const UserModel = require('../models/user-model');
const {shop, servers} = require("../config");
const bot = require("../bot");
const {serverNames} = require("../config/servers");

class BuyService {
	async energy(tg_id) {
		const user = await UserModel.findOne({tg_id})
		const next_level = shop.energy[user.energy_level+1]

		if(user.balance >= next_level.cost) {
			user.energy_level++
			user.max_energy += next_level.value
			user.energy = user.max_energy
			user.balance -= next_level.cost
			user.last_user_online = new Date()
			user.save()
		}
	}

	async tap(tg_id) {
		const user = await UserModel.findOne({tg_id})
		const next_level = shop.tap[user.tap_level+1]

		if(user.balance >= next_level.cost) {
			user.tap_level++
			user.tap_amount += next_level.value
			user.balance -= next_level.cost
			user.last_user_online = new Date()
			user.save()
		}
	}

	async hour(tg_id) {
		const user = await UserModel.findOne({tg_id})
		const next_level = shop.hour[user.hour_level+1]

		if(user.balance >= next_level.cost) {
			user.hour_level++
			user.hour_amount += next_level.value
			user.balance -= next_level.cost
			user.last_user_online = new Date()
			user.save()
		}
	}

	async detail(tg_id, server_name, detail_name) {
		const user = await UserModel.findOne({tg_id})
		const server_index = user.servers.findIndex(({name}) => name === server_name)
		const detail_index = user.servers[server_index].details.findIndex(({name}) => name === detail_name)
		const detail = user.servers[server_index].details[detail_index]
		const next_level = detail.levels[detail.level + 1]

		if(user.balance >= next_level.price) {
			const newServers = JSON.parse(JSON.stringify(user.servers))
			newServers[server_index].details[detail_index].level++
			user.servers = newServers
			user.hour_amount += next_level.income
			user.balance -= next_level.price
			user.last_user_online = new Date()
			user.save()
		}
	}

	async server(tg_id, server_name) {
		const server = servers.find(({name}) => name === server_name)

		return await bot.sendInvoice(
			tg_id,
			serverNames[server_name],
			'Up to ' + server.max_income + 'HOG / hour',
			'payload',
			'',
			'XRT',
			[{label: serverNames[server_name], amount: server.price * 100}]
		)
	}
}


module.exports = new BuyService();
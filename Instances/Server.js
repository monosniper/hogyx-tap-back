const Detail = require("./Detail");

class Server {
	constructor (data) {
		const {
			name,
			is_buyed,
			price,
			details,
			income,
			max_income,
		} = data

		this.name = name
		this.is_buyed = is_buyed
		this.price = price
		this.details = details ? details.map(detail => new Detail(detail)) : []
		this.income = income
		this.max_income = max_income

		this.calculateIncome()
		this.calculateMaxIncome()
	}

	calculateIncome = () => {
		let income = 0;

		this.details.forEach((detail) => {
			income += detail.getIncome()
		})

		this.income = income;
	}

	calculateMaxIncome = () => {
		let income = 0;

		this.details.forEach((detail) => {
			income += detail.getMaxIncome()
		})

		this.max_income = income;
	}

	purchase = () => {
		this.is_buyed = true
	}
}

module.exports = Server;
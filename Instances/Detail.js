defaultLevels = [
	{
		income: 0,
		price: 0,
	},
	{
		income: 100,
		price: 50000,
	},
	{
		income: 150,
		price: 100000,
	},
	{
		income: 200,
		price: 200000,
	},
	{
		income: 300,
		price: 250000,
	},
	{
		income: 400,
		price: 280000,
	},
	{
		income: 500,
		price: 300000,
	},
	{
		income: 700,
		price: 400000,
	},
	{
		income: 900,
		price: 450000,
	},
	{
		income: 1200,
		price: 500000,
	},
	{
		income: 1500,
		price: 700000,
	},
	{
		income: 1800,
		price: 750000,
	},
	{
		income: 2000,
		price: 800000,
	},
	{
		income: 2500,
		price: 850000,
	},
	{
		income: 4000,
		price: 900000,
	},
	{
		income: 5000,
		price: 1000000,
	},
]

class Detail {
	constructor(data) {
		const {
			name,
			levels,
			level,
			coef,
		} = data

		this.name = name

		this.levels = levels ?? defaultLevels.map(({income, price}) => {
			return {
				income: income * coef[0],
				price: price * coef[1],
			}
		})

		this.level = level ?? 0
	}

	getMaxIncome = () => {
		let max = 0

		this.levels.forEach(({income}) => {
			max += income
		})

		return max
	}

	getIncome = () => {
		let income = 0

		for (let i = 0; i <= this.level; i++) {
			income += this.levels[i].income
		}

		return income
	}
}

module.exports = Detail;
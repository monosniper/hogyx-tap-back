const Server = require("../Instances/Server");
const Detail = require("../Instances/Detail");

export const serverNames = {
	start: 'Start',
	medium: 'Medium',
	max: 'Max',
	ultra: 'Ultra',
}

const servers = [
	new Server({
		name: 'start',
		is_buyed: true,
		details: [
			new Detail({ name: 'gpu',  coef: [5.5, 1] }),
			new Detail({ name: 'cpu',  coef: [5.5, 1] }),
			new Detail({ name: 'ram',  coef: [5.5, 1] }),
			new Detail({ name: 'cold', coef: [5.5, 1] }),
			new Detail({ name: 'port', coef: [5.5, 1] }),
			new Detail({ name: 'ssd',  coef: [5.5, 1] }),
		],
	}),
	new Server({
		name: 'medium',
		is_buyed: false,
		price: 1.99,
		details: [
			new Detail({ name: 'gpu',  coef: [7.8, 10] }),
			new Detail({ name: 'cpu',  coef: [7.8, 10] }),
			new Detail({ name: 'ram',  coef: [7.8, 10] }),
			new Detail({ name: 'cold', coef: [7.8, 10] }),
			new Detail({ name: 'port', coef: [7.8, 10] }),
			new Detail({ name: 'ssd',  coef: [7.8, 10] }),
		],
	}),
	new Server({
		name: 'max',
		is_buyed: false,
		price: 4.49,
		details: [
			new Detail({ name: 'gpu',  coef: [11.7, 50] }),
			new Detail({ name: 'cpu',  coef: [11.7, 50] }),
			new Detail({ name: 'ram',  coef: [11.7, 50] }),
			new Detail({ name: 'cold', coef: [11.7, 50] }),
			new Detail({ name: 'port', coef: [11.7, 50] }),
			new Detail({ name: 'ssd',  coef: [11.7, 50] }),
		],
	}),
	new Server({
		name: 'ultra',
		is_buyed: false,
		price: 8.99,
		details: [
			new Detail({ name: 'gpu',  coef: [18.8, 100] }),
			new Detail({ name: 'cpu',  coef: [18.8, 100] }),
			new Detail({ name: 'ram',  coef: [18.8, 100] }),
			new Detail({ name: 'cold', coef: [18.8, 100] }),
			new Detail({ name: 'port', coef: [18.8, 100] }),
			new Detail({ name: 'ssd',  coef: [18.8, 100] }),
		],
	}),
]

module.exports = servers
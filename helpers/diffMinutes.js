function diff_minutes(dt2, dt1) {
	if(!dt2 || !dt1) return null
	let diff = (dt2.getTime() - dt1.getTime()) / 1000;
	diff /= (60 * 60);
	return Math.abs(Math.round(diff * 60));
}

module.exports = diff_minutes;
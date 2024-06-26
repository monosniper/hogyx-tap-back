const {gifts} = require("../config");
module.exports = {
	start: (ref_code) => `
Welcome to HOGYX! Click on the coin and increase your balance 🤝
 
- Climb to the top of the leaderboard and get delicious rewards in the form of Airdrops. 🥇
- Most of the distribution of HOGYX (HOG) tokens will happen among the players here. 🪂
- Keep an eye on new tasks, because besides the token, you have a chance to get unique rewards. 🎁
             
Your referral link: https://t.me/hogyx_tap_bot/app?startapp=${ref_code}
`,
	new_ref: (name) => `🎉 Congratulations! 🎉 

➕ You have successfully invited 【${name}】!
🪙 ${gifts.friend.no_prem.coins} HOG and ${gifts.friend.no_prem.xcoins} X-HOG have been sent to you as a reward for the invitation! 
Invite your friends to our friendly community and get more rewards`,
}
const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const NotificationController = require('../controllers/notification-controller');
const TGMiddleware = require('../middlewares/tg-middleware');

const router = new Router();

router.post('/login', TGMiddleware, UserController.login);
router.patch('/taps', TGMiddleware, UserController.taps);
router.patch('/energy', TGMiddleware, UserController.energy);
router.patch('/update', TGMiddleware, UserController.update);
router.get('/me', TGMiddleware, UserController.me);

router.patch('/buy/energy', TGMiddleware, UserController.buyEnergy);
router.patch('/buy/tap', TGMiddleware, UserController.buyTap);
router.patch('/buy/hour', TGMiddleware, UserController.buyHour);

router.patch('/site-visited/:hogyx_user_id', UserController.siteVisited);
router.patch('/account-link/:hogyx_user_id', UserController.accountLink);

router.get('/leaders', TGMiddleware, UserController.getLeaders);

router.get('/notifications', TGMiddleware, NotificationController.getUnread);
router.patch('/notifications/:id', TGMiddleware, NotificationController.makeRead);

router.post('/channel-webhook', UserController.channelWebhook);

module.exports = router;
const Router = require('express').Router;
const BuyController = require('../controllers/buy-controller');
const UserController = require('../controllers/user-controller');
const NotificationController = require('../controllers/notification-controller');
const DevController = require('../controllers/dev-controller');
const TGMiddleware = require('../middlewares/tg-middleware');

const router = new Router();

router.post('/login', TGMiddleware, UserController.login);
router.patch('/taps', TGMiddleware, UserController.taps);
router.patch('/energy', TGMiddleware, UserController.energy);
router.patch('/update', TGMiddleware, UserController.update);
router.get('/me', TGMiddleware, UserController.me);

router.patch('/buy/energy', TGMiddleware, BuyController.energy);
router.patch('/buy/tap', TGMiddleware, BuyController.tap);
router.patch('/buy/hour', TGMiddleware, BuyController.hour);
router.patch('/buy/detail', TGMiddleware, BuyController.detail);
router.patch('/buy/server', TGMiddleware, BuyController.server);

router.patch('/site-visited', UserController.siteVisited);
router.patch('/account-link', UserController.accountLink);

router.get('/leaders', TGMiddleware, UserController.getLeaders);

router.get('/notifications', TGMiddleware, NotificationController.getUnread);
router.patch('/notifications/:id', TGMiddleware, NotificationController.makeRead);

router.post('/channel-webhook', UserController.channelWebhook);

router.get('/dev/set-servers', DevController.setServers);

module.exports = router;
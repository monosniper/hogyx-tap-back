const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const TGMiddleware = require('../middlewares/tg-middleware');

const router = new Router();

router.post('/login', TGMiddleware, UserController.login);
router.patch('/taps', TGMiddleware, UserController.taps);

module.exports = router;
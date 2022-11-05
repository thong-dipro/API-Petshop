const router = require('express').Router();
const typeCtrl = require('../controllers/typeCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router
  .route('/type')
  .get(typeCtrl.getTypes)
  .post(auth,authAdmin,typeCtrl.createType);

module.exports = router;
// hello mother fck

const router = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const tagCtrl = require("../controllers/tagCtrl");

router
  .route("/tags/")
  .get(tagCtrl.getTags)
  .post(auth, authAdmin, tagCtrl.addTag)
  .delete(auth, authAdmin, tagCtrl.deleteTag)
  .put(auth, authAdmin, tagCtrl.updateTag);

router.route("/tags/single").get(tagCtrl.getSingleTag);

module.exports = router;

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js')
const rules = require('../controllers/rules.js')
const { isLoggedIn, validateRule, isRuleAuthor } = require('../middleware')
const { storage } = require('../cloudinary')
const multer = require('multer');
const upload = multer({ storage });
//development only(never in production), upload to local storage
//const upload = multer({ dest: 'uploads/' });

router.route("/")
    .get(catchAsync(rules.showAllRules))
    .post(isLoggedIn, upload.array('gameImages'), (catchAsync(rules.postNewRule)))
//catchAsync(rules.postNewRule))
// router.get("/", catchAsync(rules.showAllRules));

// router.post("/", isLoggedIn, catchAsync(rules.postNewRule));

router.get("/new", isLoggedIn, rules.renderNewRuleForm);


router.get("/:id", catchAsync(rules.showOneRule));

router.get("/:id/rule/:ruleId/edit", isLoggedIn, catchAsync(rules.renderRuleEditForm));

router.put("/:id/rule/:ruleId", isLoggedIn, isRuleAuthor, upload.array('gameImages'), validateRule, catchAsync(rules.editRule));

router.delete("/:id/rule/:ruleId", isLoggedIn, catchAsync(rules.deleteRule));

router.get("/:id/add", isLoggedIn, catchAsync(rules.renderAddRuleForm));

//push new rule to rules array
router.patch("/:id", isLoggedIn, upload.array('gameImages'), validateRule, catchAsync(rules.addRuleToExistGame));

module.exports = router;
const Houserule = require('../models/houserules.js')
const Rule = require('../models/rule.js')
const { cloudinary } = require('../cloudinary')

module.exports.showAllRules = async (req, res) => {
    const houserules = await Houserule.find({}).populate({
        path: 'rules',
        populate: { path: 'author' }
    });
    res.render('rules/index', { houserules })
}


module.exports.postNewRule = async (req, res) => {
    const { gameTitle, rule } = req.body;
    let newgame = await Houserule.findOne({ gameTitle_lower: gameTitle.toLowerCase() })
    if (!newgame) {
        newgame = new Houserule({ gameTitle: gameTitle, gameTitle_lower: gameTitle.toLowerCase() })
    }
    // newgame.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const newrule = new Rule({ rule })
    newrule.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newrule.author = req.user._id
    newgame.rules.push(newrule)
    await newrule.save();
    await newgame.save();
    req.flash('success', 'Successfully submited a new rule');
    res.redirect('/rules')
}

module.exports.renderNewRuleForm = (req, res) => {
    res.render('rules/new',)
}

module.exports.showOneRule = async (req, res) => {
    const { id } = req.params;
    const houserule = await Houserule.findById(id).populate({
        path: 'rules',
        populate: { path: 'author' }
    });
    res.render('rules/show', { houserule })
}

module.exports.renderRuleEditForm = async (req, res) => {
    const { id, ruleId } = req.params;
    const houserule = await Houserule.findById(id);
    const rule = await Rule.findById(ruleId);
    res.render('rules/edit', { houserule, rule })
}

module.exports.editRule = async (req, res) => {
    const { id, ruleId } = req.params;
    const rule = await Rule.findById(ruleId)
    rule.rule = req.body.rule
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    rule.images.push(...imgs)
    rule.save()
    // console.log(req.body)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await rule.updateOne({
            $pull: {
                images: { filename: { $in: req.body.deleteImages } }

            }
        })
    }
    //const updatedHouserule = await Rule.findByIdAndUpdate(ruleid, { rule: req.body.rules })
    req.flash('success', 'Successfully updated this rule!');
    res.redirect(`/rules/${id}`)
}

module.exports.deleteRule = async (req, res) => {
    const { id, ruleId } = req.params;
    //1. pull rule reference from game, 2. then delete the rule itself
    await Houserule.findByIdAndUpdate(id, { $pull: { rule: ruleId } });
    await Rule.findByIdAndDelete(ruleId)
    req.flash('success', 'Successfully deleted');
    res.redirect(`/rules/${id}`)
}

module.exports.renderAddRuleForm = async (req, res) => {
    const { id } = req.params;
    const houserule = await Houserule.findById(id);
    res.render('rules/add', { houserule })
}

// module.exports.renderAddImagesForm = async (req, res) => {
//     const { id } = req.params;
//     const houserule = await Houserule.findById(id);
//     res.render('rules/addImages', { houserule })
// }

// module.exports.addImagesToExistGame = async (req, res) => {
//     const { id } = req.params;
//     const houserule = await Houserule.findById(id);
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
//     houserule.images.push(...imgs)
//     await houserule.save()
//     houserule.save();
//     //Houserule.findOneAndUpdate({ gameTitle: houserule.gameTitle }, { $push: { rules: newrules } });
//     res.redirect(`/rules/${id}`)
// }

module.exports.addRuleToExistGame = async (req, res) => {
    const { id } = req.params;
    const { rule } = req.body;
    const houserule = await Houserule.findById(id);
    const newrule = new Rule({ rule: rule })
    newrule.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newrule.author = req.user._id
    houserule.rules.push(newrule);
    newrule.save();
    houserule.save();
    req.flash('success', 'Successfully added a rule');
    //Houserule.findOneAndUpdate({ gameTitle: houserule.gameTitle }, { $push: { rules: newrules } });
    res.redirect(`/rules/${id}`)
}
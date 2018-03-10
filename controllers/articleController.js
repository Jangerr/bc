// Validate & Sanitize
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Async
var async = require('async');

// MongoDB Models
var Article = require('../models/article');
var User = require('../models/user');
var Source = require('../models/sources');
var Category = require('../models/category');

// Request Handler
let grabity = require('grabity');

exports.add = [

    // Validate that the name field is not empty.
    body('url', 'Bitte geben Sie einen richtigen Link ein.').isLength({ min: 5 }).exists().trim(),

    // Sanitize (trim and escape) the name field.
    //sanitizeBody('url').trim().escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('add-article', { title: "Artikel Link angekommen", link: req.body.url, errors: errors.array() });
            return
        }
        else {

            async.parallel({
                keys: function (callback) {
                    (async () => {
                        var it = await grabity.grabIt(req.body.url);
                        callback(null, it);
                    })();
                    
                },
                tags: function (callback) {
                    (async () => {
                        var tags = await grabity.grabTags(req.body.url);
                        callback(null, tags);
                    })();
                },
                ratio: function (callback) {
                    ratio = '1.5';
                    callback(null, ratio);
                },
                source: function (callback) {
                    var source = '5aa05fa0534e996f2068906d';
                    callback(null, source);
                },
                user: function (callback) {
                    var user = '5aa032c4b4f2282a68e9aa26';
                    callback(null, user);
                }
            }, function (err, results) {

                var article = {
                    "link": req.body.url,
                    "title": results.keys.title,
                    "description": results.keys.description,
                    "tags": results.tags.news_keywords,
                    "image": results.keys.image,
                    "ratio": results.ratio,
                    "source": results.source,
                    "user": results.user
                }

                var new_article = new Article({
                    link: req.body.url,
                    title: results.keys.title,
                    description: results.keys.description,
                    tags: results.tags.news_keywords,
                    image: results.keys.image,
                    ratio: results.ratio,
                    user: results.user,
                    source: results.source
                });
                console.log(new_article);

                new_article.save(function (err, new_article) {
                    if (err) console.error(err);
                    console.log("Artikel in Datenbank eingetragen");
                    res.send(new_article);
                });

                
            });
            
        }

    }
];
exports.index = function (req, res) {


    res.render('add-article', { title: "Neuen Artikel posten" });

    //// GET ARTICLE
    //Article.find({})
    //    .populate('user')
    //    .exec(function (err, articles) {
    //        if (err) console.error(err);
    //        console.log(articles);
    //        res.send(articles);
    //    });

    // POST ARTICLE
    //var new_article = new Article({
    //    link: 'https://cryptoplanet.de/deutschland-wird-die-nutzung-von-bitcoin-als-zahlungsmittel-nicht-besteuern-sagte-das-finanzministerium/',
    //    title: 'Deutschland wird die Nutzung von Bitcoin als Zahlungsmittel nicht besteuern, sagte das Finanzministerium',
    //    description: 'Die Nachricht, die am Dienstag ver&ouml;ffentlicht wurde, unterscheidet Deutschland von den USA, wo der Internal Revenue Service (IRS) Bitcoin als Eigentum f&uuml;r Steuerzwecke behandelt &ndash; was bedeutet, dass wenn ein Amerikaner eine Tasse Kaffee mit Bitcoin kauft, dies technisch als ein Verkauf von Eigentum und potentiell Subjekt zur Kapitalgewinnsteuer angesehen wird.',
    //    tags: 'Steuer,Besteuerung,Regulierung,Regierung,Deutschland,Finanzministerium,EU',
    //    image: 'https://cryptoplanet.de/wp-content/uploads/2018/03/bitcoin-1152x750.jpg',
    //    ratio: '1.536000000',
    //    user: '5aa032c4b4f2282a68e9aa26',
    //    default_image: 0,
    //    searchItems: 'asd',
    //    views: 0,
    //    newsletter_state: 0,
    //    approving_state: 0
    //});
    //console.log(new_article.title);

    //new_article.save(function (err, new_article) {
    //    if (err) console.error(err);
    //    console.log("COMPLETE");
    //    res.send("ES LÄUFT!");
    //});


    //// POST USER
    //var new_user = new User({
    //    email: 'gerrit.hillebrecht@hotmail.de',
    //    password: 'asd',
    //    admin_rights: 9
    //});

    //new_user.save(function (err, new_article) {
    //    if (err) throw err;

    //    // attempt to authenticate user
    //    User.getAuthenticated('gerrit.hillebrecht@hotmail.de', 'asd', function (err, user, reason) {
    //        if (err) throw err;

    //        // login was successful if we have a user
    //        if (user) {
    //            // handle login success
    //            console.log('login success');
    //            return;
    //        }

    //        // otherwise we can determine why we failed
    //        var reasons = User.failedLogin;
    //        switch (reason) {
    //            case reasons.NOT_FOUND:
    //            case reasons.PASSWORD_INCORRECT:
    //                // note: these cases are usually treated the same - don't tell
    //                // the user *why* the login failed, only that it did
    //                break;
    //            case reasons.MAX_ATTEMPTS:
    //                // send email or otherwise notify user that account is
    //                // temporarily locked
    //                break;
    //        }
    //    });

    //});


    //// POST Source
    //var new_source = new Source({
    //    name: 'handelsblatt',
    //    short_handle: 'handelsblatt',
    //    link: 'handelsblatt.de'
    //});
    //console.log(new_source.name);

    //new_source.save(function (err, new_source) {
    //    if (err) console.error(err);
    //    console.log("COMPLETE");
    //    res.send("ES LÄUFT!");
    //});

    //// POST Category
    //var new_category = new Category({
    //    name: 'Technologie',
    //    image: 'https://userscontent2.emaze.com/images/f632fc30-6a42-496d-a4ba-575cb2464c5f/af09ac0efa5490d254d2e5f2a9890cfa.jpg'
    //});
    //console.log(new_category);

    //new_category.save(function (err, new_source) {
    //    if (err) console.error(err);
    //    console.log("COMPLETE");
    //    res.send("ES LÄUFT!");
    //});


    //Article.find({}).exec(function (err, list_articles) {
    //    console.log(list_articles);
    //    res.render('add-article', { articles: list_articles, title: "hello" });
    //});
    
}
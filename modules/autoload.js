const parser = require('rss-url-parser');
let grabity = require('grabity');
var Article = require('../models/article');
var async = require('async');


setInterval(function () {

    console.log('Looking for news News');

    parser('https://news.google.com/news/rss/search/section/q/bitcoin/bitcoin?hl=de&gl=DE&ned=de').then(function (data) {

        for (var index = 0; index < data.length; index++) {
            (async () => {
                let item = index;
                let url = data[item].link;
                let keys = await grabity.grabIt(data[item].link);
                let tags = await grabity.grabTags(data[item].link);

                async.parallel({
                    title_count: function (callback) {
                        Article.count({ title: keys.title }, callback);
                    },
                    link_count: function (callback) {
                        Article.count({ link: url }, callback);
                    },
                    tags: function (callback) {
                        let tag_results = tags.news_keywords + ", " + tags.keywords;
                        callback(null, tag_results);
                    },
                    title: function (callback) {
                        callback(null, keys.title);
                    },
                    description: function (callback) {
                        callback(null, keys.description);
                    },
                    image: function (callback) {
                        callback(null, keys.image);
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
                    },
                    url: function (callback) {
                        callback(null, url);
                    },
                }, function (err, results) {

                    // Error
                    if (err) console.error(err);

                    // If not existing yet
                    if (!results.title_count && !results.link_count) {

                        var new_article = new Article({
                            link: results.url,
                            title: results.title,
                            description: results.description,
                            tags: results.tags,
                            image: results.image,
                            ratio: results.ratio,
                            user: results.user,
                            source: results.source,
                            automatic: 1,
                            approving_state: 1
                        });

                        new_article.save(function (err, new_article) {
                            if (err) console.error(err);
                            console.log("Artikel in Datenbank eingetragen");

                        });

                        if (item == data.length)
                            res.send("Alle eingetragen");
                    }
                });

            })();
        }

    });

}, 1000 * 60 * 10);
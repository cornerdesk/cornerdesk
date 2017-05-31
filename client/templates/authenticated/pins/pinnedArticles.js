import sanitizeHtml from 'sanitize-html';

Template.pinnedArticles.helpers({
    articles() {
        return Pins.find();
    },
    getImage(content) {
        return $('img', content).length > 0 ? $('img', content).prop('outerHTML') : '';
    },
    sanitizeText(content) {
        return sanitizeHtml(content, {
            transformTags: {
                'h1': sanitizeHtml.simpleTransform('h6'),
                'h2': sanitizeHtml.simpleTransform('h6'),
                'h3': sanitizeHtml.simpleTransform('h6'),
                'h4': sanitizeHtml.simpleTransform('h6'),
                'h5': sanitizeHtml.simpleTransform('h6'),
            }
        }).substring(0, 300) + '&hellip;';

    },
    getDetailsRoute(article) {
        return window.location.href + '/' + article._id;
    },
    canUserEdit() {
        let instance = Template.instance();
        return !!Meteor.userId() && FlowRouter.getParam('item').replace('@', '') === Meteor.users.findOne(Meteor.userId()).username;
    },
})

Template.pinnedArticles.onCreated(() => {
    let template = Template.instance();
    Tracker.autorun(() => {
        template.subscribe('pins', FlowRouter.getParam('item'));
    })
});

Template.pinnedArticles.onRendered(() => {
    // $('.articles-wrapper').perfectScrollbar({ suppressScrollX: true });
    // $('.articles-wrapper').on('mouseenter', () => {
    //     $('.articles-wrapper').perfectScrollbar('update');
    // });
});

Template.pinnedArticles.events({
    'click [name="add-article"]' (event, template) {
        let $input = template.$('[name="article-url"]');
        let url = $input.val();
        Meteor.call('addPinnedArticle', url, function(err, result) {
            if (!!err) {
                Bert.alert(err, 'danger');
            }
        });
        $input.val('');
    }
})
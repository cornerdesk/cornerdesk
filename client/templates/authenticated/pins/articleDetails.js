Template.articleDetails.helpers({
    article() {
        return Template.instance().article.get();
    }
})

Template.articleDetails.onCreated(() => {
    var template = Template.instance();
    template.article = new ReactiveVar();
    Tracker.autorun(() => {
        template.subscribe('pins', FlowRouter.getParam('item'));
        template.article.set(Pins.findOne(FlowRouter.getParam('article')));
    })
});
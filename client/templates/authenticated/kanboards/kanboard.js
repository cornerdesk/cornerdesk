import handleKanboardSwitch from '../../../modules/handle-kanboard-switch';

Template.kanboard.onCreated(() => {
    let template = Template.instance();
    handleKanboardSwitch(template);
});

Template.kanboard.helpers({
    isDirect() {
        return Template.instance().isDirect.get();
    },
    name() {
        return Template.instance().name.get();
    },
    lists() {
        return Kanlists.find({}, { sort: { order: 1 } });
    },
    canUserEdit() {
        let instance = Template.instance();
        return !instance.isDirect.get() || FlowRouter.getParam('board').replace('@', '') === Meteor.users.findOne(Meteor.userId()).username;
    },
    kanboard() {
        if (Template.instance().isDirect.get() === true) {
            return null;
        }
        return Kanboards.findOne(FlowRouter.getParam('board'));
    }
});

Template.kanboard.onRendered(() => {
    // Drag n drop of the lists
    $('.kanlists-container').sortable({
        tolerance: 'pointer',
        helper: 'clone',
        handle: '.kanlist-header',
        items: '.kanlist',
        placeholder: 'kanlist placeholder',
        distance: 7,
        start(evt, ui) {
            ui.placeholder.height(ui.helper.height());
        },
        stop() {
            $('.kanlists-container').find('.kanlist').each(
                (i, ui) => {
                    Meteor.call('updateList', Blaze.getData(ui)._id, {
                        $set: {
                            order: i,
                        },
                    }, (err) => {});
                }
            );
        },
    });

    Tracker.autorun(() => {});
});
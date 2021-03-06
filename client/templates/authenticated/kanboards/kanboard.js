import handleKanboardSwitch from '../../../modules/handle-kanboard-switch';

Template.kanboard.onCreated(() => {
    let template = Template.instance();
    handleKanboardSwitch(template);
});

Template.kanboard.helpers({
    isDirect() {
        return Template.instance().isDirect.get();
    },
    isPublic() {
        return !Template.instance().isDirect.get() && Kanboards.findOne(FlowRouter.getParam('item')).isPublic();
    },
    name() {
        return Template.instance().name.get();
    },
    lists() {
        return Kanlists.find({}, { sort: { order: 1 } });
    },
    canUserEdit() {
        let instance = Template.instance();
        return !instance.isDirect.get() || FlowRouter.getParam('item').replace('@', '') === Meteor.users.findOne(Meteor.userId()).username;
    },
    kanboard() {
        if (Template.instance().isDirect.get() === true) {
            return null;
        }
        return Kanboards.findOne(FlowRouter.getParam('item'));
    }
});

Template.kanboard.onRendered(() => {
    // Drag n drop of the lists
    $('.kanlists-container').sortable({
        tolerance: 'pointer',
        helper: 'clone',
        handle: '.list-header-grab-icon',
        items: '.kanlist',
        placeholder: 'kanlist placeholder',
        distance: 7,
        start(evt, ui) {
            // $('.trash-container').addClass('dragging');
            ui.placeholder.height(ui.helper.height());
        },
        stop(evt) {
            $('.kanlists-container').find('.kanlist').each(
                (i, ui) => {
                    let listId = Blaze.getData(ui)._id;
                    if (!!listId) {
                        Meteor.call('updateList', listId, {
                            $set: {
                                order: i,
                            },
                        }, (err) => {});
                    }
                }
            );
            // $('.trash-container').removeClass('dragging');
        },
    });

    Tracker.autorun(() => {});
});
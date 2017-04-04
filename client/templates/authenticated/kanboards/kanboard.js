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
    }
});

Template.kanboard.onRendered(() => {

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
                (i, list) => {
                    Meteor.call('updateList', Blaze.getData(list)._id, {
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
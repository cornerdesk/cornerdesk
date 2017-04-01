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
        return Kanlists.find({});
    }
});

Template.calendar.onRendered(() => {
    Tracker.autorun(() => {});
});
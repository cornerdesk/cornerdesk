Template.members.events({
    'click [name="add-member-button"]': (event, template) => {
        let container = template.find('#newMember');
        container.innerHTML = '';
        Blaze.render(Template.addMemberForm, container);
    },
    'click [name="new-member-form-close"]': (event, template) => {
        let container = template.find('#newMember');
        container.innerHTML = '';
        Blaze.render(Template.addMember, container);
    }
});

Template.members.helpers({
    // activeMembers() {
    //     return this.data.activeMembers();
    // }
});

Template.members.onCreated(() => {
    let template = Template.instance();
    template.activeMembers = new ReactiveVar();
    Tracker.autorun(() => {
        template.activeMembers.set(template.data.activeMembers());
    });
});

Template.members.onRendered(() => {

});
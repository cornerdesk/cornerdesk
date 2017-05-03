Template.members.events({
    'click [name="add-member-button"]': (event, template) => {
        let container = template.find('.newMember');
        container.innerHTML = '';
        Blaze.render(Template.addMemberForm, container);
    },
    'click [name="new-member-form-close"]': (event, template) => {
        let container = template.find('.newMember');
        container.innerHTML = '';
        Blaze.render(Template.addMember, container);
    }
});

Template.members.helpers({
    type() {
        return this.getType();
    },
    itemId() {
        return this._id;
    }
});

Template.smallMembers.helpers({
    type() {
        return this.getType();
    },
    itemId() {
        return this._id;
    }
});

Template.smallMembers.onCreated(() => {
    let template = Template.instance();
    template.activeMembers = new ReactiveVar();
    Tracker.autorun(() => {
        template.activeMembers.set(template.data.activeMembers());
    });
});
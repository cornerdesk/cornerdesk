Template.members.events({
    'click [name="add-member-button"]': (event, template) => {
        let container = template.find('.newMember');
        container.innerHTML = '';
        Blaze.renderWithData(Template.addMemberForm, template.data, container);
    },
    'click [name="new-member-form-close"]': (event, template) => {
        let container = template.find('.newMember');
        container.innerHTML = '';
        Blaze.renderWithData(Template.addMember, template.data, container);
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
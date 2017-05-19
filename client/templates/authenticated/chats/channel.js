import handleChannelSwitch from '../../../modules/handle-channel-switch';
import sortMessages from '../../../modules/sort-messages';
import handleMessageInsert from '../../../modules/handle-message-insert';

const getUsers = () => {
    return Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
}

Template.channel.onCreated(() => {
    let template = Template.instance();
    handleChannelSwitch(template);
});

Template.channel.onRendered(() => {
    // this.$('[name="message"]').mention({
    //     delimiter: '@',
    //     users: getUsers()
    // });
});

Template.channel.helpers({
    isLoading() {
        return Template.instance().loading.get();
    },
    isDirect() {
        return Template.instance().isDirect.get();
    },
    isPublic() {
        return !Template.instance().isDirect.get() && Channels.findOne({ name: FlowRouter.getParam('item') }).isPublic();
    },
    username() {
        return FlowRouter.getParam('item');
    },
    messages() {
        let messages = Messages.find({}, { sort: { timestamp: 1 } });
        if (messages) {
            return sortMessages(messages);
        }
    },
    channel() {
        if (Template.instance().isDirect.get() === true) {
            return null;
        }
        return Channels.findOne({ name: FlowRouter.getParam('item') });
    }
});

Template.channel.events({
    'keyup [name="message"]' (event, template) {
        handleMessageInsert(event, template);
    },
    'scroll #messages' (event, template) {
        setTimeout(() => {
            $('#messages').find('.message.unread').each(function(n) {

                var $this = $(this);

                if ($this.position().top + $this.height() > $('#messages').position().top && $this.position().top < $('#messages').position().top + $('#messages').height()) {
                    Meteor.call('readMessage', Blaze.getData($this.get(0))._id);
                    $(this).removeClass('unread');
                }
            });
        }, 1000)
    }
});
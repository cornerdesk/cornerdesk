import handleKanboardInsert from '../../../modules/handle-kanboard-insert';
import handleCalendarInsert from '../../../modules/handle-calendar-insert';
import handleChannelInsert from '../../../modules/handle-channel-insert';

Template.newBoardModal.events({
    'click #save': (event, template) => {
        handleKanboardInsert(event, template);
    }
});

Template.newCalendarModal.events({
    'click #save': (event, template) => {
        handleCalendarInsert(event, template);
    }
});

Template.newChannelModal.events({
    'click #save': (event, template) => {
        handleChannelInsert(event, template);
    }
});
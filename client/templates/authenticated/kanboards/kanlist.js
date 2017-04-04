Template.kanlist.helpers({
    tasks: () => {
        //return [{ title: 'premiere tache' }, { title: 'seconde tache' }];
        let instance = Template.instance();
        return instance.kantasks(instance.data._id);
    }
});

Template.kanlist.onCreated(() => {
    let template = Template.instance();
    Tracker.autorun(() => {
        template.showNewTaskForm = new ReactiveVar(false);
        template.subscribe('kanlist', template.data._id);
    });
    template.kantasks = (list) => {
        return Kantasks.find({ kanlist: list });
    };
});

Template.kanlist.onRendered(() => {
    var listBody = Template.instance().$('.kanlist-body');
    listBody.perfectScrollbar();
    listBody.on('mouseenter', () => {
        listBody.perfectScrollbar('update');
    });
});

Template.kanlist.events({
    'click .removeListBtn' (event, template) {
        if (FlowRouter.getParam('board').includes('@') && this.ownerId !== Meteor.userId()) {
            Bert.alert('You can\'t remove this list.', 'warning');
        }
        let listId = this._id;
        Meteor.call('removeList', listId, (err) => {
            if (err) {
                Bert.alert('An error occured while removing the list.', 'error');
                return;
            }
            Bert.alert('The list is now removed.', 'success');
        });
    },
    'click .createTaskButton' (event, template) {
        template.showNewTaskForm.set(true);
        let container = template.find('.new-task');
        container.innerHTML = '';
        Blaze.render(Template.newTaskForm, container);
    },
    'click [name="cancel-new-task-btn"]' (event, template) {
        template.showNewTaskForm.set(false);
        let container = template.find('.new-task');
        container.innerHTML = '';
        Blaze.render(Template.newTaskButton, container);
    },
    'click [name="save-new-task-btn"]' (event, template) {
        let title = template.find('[name="new-task-name"]').value;
        let boardId = FlowRouter.getParam('board');

        if (title === '') {
            Bert.alert('The title cannot be empty', 'warning');
            return;
        }

        var task = null;
        if (boardId.includes('@')) {
            let user = Meteor.users.findOne({ username: boardId.replace('@', '') });
            if (user._id === Meteor.userId()) {
                task = { title: title, kanlist: template.data._id };
            }
        } else {
            //TODO Gestion des membres
            task = { title: title, kanlist: template.data._id };
        }
        if (task === null) {
            Bert.alert('You don\'t have the rights to create a task', 'warning');
            return;
        }

        Meteor.call('insertTask', task, (error) => {
            if (error) {
                Bert.alert(error.reason, 'danger');
            }
            event.target.value = '';
            template.showNewTaskForm.set(false);
            let container = template.find('.new-task');
            container.innerHTML = '';
            Blaze.render(Template.newTaskButton, container);
        });


    }
});
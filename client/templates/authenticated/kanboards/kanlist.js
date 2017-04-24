Template.kanlist.helpers({
    tasks: () => {
        //return [{ title: 'premiere tache' }, { title: 'seconde tache' }];
        let instance = Template.instance();
        return instance.kantasks(instance.data._id);
    },
    canUserEdit: () => {
        let instance = Template.instance();
        return !instance.data.kanboard !== undefined || instance.data.ownerId === Meteor.userId();
    },
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

    // Drag n drop of the tasks
    const $tasks = Template.instance().$('.tasks-container');
    $tasks.sortable({
        connectWith: '.tasks-container',
        tolerance: 'pointer',
        appendTo: 'body',
        helper(evt, item) {
            return item.clone();
        },
        distance: 7,
        items: '.kantask-wrapper:not(.new-task)',
        scroll: false,
        placeholder: 'kantask-wrapper placeholder',
        start(evt, ui) {
            ui.placeholder.height(ui.helper.height());
        },
        receive(evt, ui) {
            let kanlist = ui.item.parents('.kanlist').get(0);
            let $listItems = $(kanlist).find('.kantask-wrapper');
            const itemIndex = $listItems.index(ui.item.get(0));
            const nbItems = $listItems.length;
            if (itemIndex === nbItems - 1) {
                $(kanlist).find('.new-task:eq(0)').insertAfter(ui.item.get(0));
            }
            const listId = Blaze.getData(kanlist)._id;

            const taskDomElement = ui.item.get(0);
            const task = Blaze.getData(taskDomElement);
            console.log('task id : ' + task._id);
            console.log('list id : ' + listId);
            Meteor.call('updateTask', task._id, { $set: { kanlist: listId } });
        },
    });
});

Template.kanlist.events({
    'click .removeListBtn' (event, template) {
        if (FlowRouter.getParam('item').includes('@') && this.ownerId !== Meteor.userId()) {
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
        let boardId = FlowRouter.getParam('item');

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
            let input = template.find('[name="new-task-name"]');
            input.value = '';
            $(input).parents('.form-group').get(0).className += " is-empty";
        });


    }
});
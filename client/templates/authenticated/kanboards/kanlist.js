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
    const $tasksLists = this.$('.tasks-container');
    $tasksLists.sortable({
        handle: '.kantask-grab-icon',
        connectWith: '.tasks-container, .trash-container',
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
            $('.content-wrapper').addClass('dragging');
            ui.placeholder.height(ui.helper.height());
            ui.placeholder.width(ui.helper.width());
            $(document).on('mousemove', function(event) {
                setTimeout(function() {

                    if (event.screenX < 50) {
                        window.scrollBy(-20, 0);
                    } else if (event.screenX > window.innerWidth - 50) {
                        window.scrollBy(20, 0);
                    }
                }, 100);
            })
        },
        stop(evt, ui) {
            $(document).off('mousemove');
            $('.content-wrapper').removeClass('dragging');
        },
        receive(evt, ui) {
            let kanlist = ui.item.parents('.kanlist').get(0);

            if (kanlist.id === 'kantrash') {
                const taskDomElement = ui.item.get(0);
                const task = Blaze.getData(taskDomElement);
                sweetAlert({
                        title: "Are you sure?",
                        text: "Do you really wan't to delete this task ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    (confirmation) => {
                        if (confirmation === false) {
                            $(ui.sender).sortable('cancel');
                            sweetAlert.close();
                            return;
                        }

                        Meteor.call('removeTask', task._id, () => { sweetAlert.close(); });
                    });
            } else {
                const listId = Blaze.getData(kanlist)._id;

                const taskDomElement = ui.item.get(0);
                const task = Blaze.getData(taskDomElement);
                if (listId !== task.kanlist) {
                    Meteor.call('updateTask', task._id, { $set: { kanlist: listId } });
                }
            }
        },
    });
});

Template.kanlist.events({
    'click .removeListBtn' (event, template) {
        if (FlowRouter.getParam('item').includes('@') && this.ownerId !== Meteor.userId()) {
            Bert.alert('You can\'t remove this list.', 'warning');
        }
        let listId = this._id;
        sweetAlert({
                title: "You are just about to delete this list",
                text: "Do you want to continue ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            (confirmation) => {
                sweetAlert.close();
                if (confirmation === false) {
                    return;
                }

                Meteor.call('removeList', listId, (err) => {
                    if (err) {
                        Bert.alert('An error occured while removing the list.', 'danger');
                        return;
                    }
                    Bert.alert('The list is now removed.', 'success');
                });
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

Template.kantrash.onRendered(() => {
    const $tasks = this.$('.trash-container');
    $tasks.droppable({
        handle: '.kantask-grab-icon',
        hoverClass: 'ui-state-active',
        tolerance: 'pointer',
        accept: function(event, ui) {
            return true;
        },
        drop: function(event, ui) {
            var obj;
            if ($(ui.helper).hasClass('ui-draggable') && $(ui.helper).hasClass('js-member')) {
                var container = $(ui.draggable).parent('.members');
                var memberId = $(ui.helper).data('user-id');
                // handle remove after confirm
                sweetAlert({
                        title: "Delete?",
                        text: "Do you really wan't to do this ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    (confirmation) => {
                        if (confirmation === false) {
                            $(ui.sender).droppable('cancel');
                            sweetAlert.close();
                            return;
                        }

                        Meteor.call('removeUserFrom',
                            container.data('type'),
                            container.data('id'),
                            memberId,
                            (err, result) => {
                                sweetAlert.close();
                                if (err) {
                                    Bert.alert('An error occurred', 'danger');
                                    return;
                                }
                                Bert.alert('Done', 'success');
                            }
                        );
                    });
            }
        }
    }).sortable({
        handle: '.kantask-grab-icon',
        connectWith: '.tasks-container, .trash-container',
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
            $('.content-wrapper').addClass('dragging');
            ui.placeholder.height(ui.helper.height());
        },
        stop(evt, ui) {
            $('.content-wrapper').removeClass('dragging');
        },
        receive(evt, ui) {
            const taskDomElement = ui.item.get(0);
            const task = Blaze.getData(taskDomElement);
            sweetAlert({
                    title: "Are you sure?",
                    text: "Do you really wan't to delete this task ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                (confirmation) => {
                    if (confirmation === false) {
                        $(ui.sender).sortable('cancel');
                        sweetAlert.close();
                        return;
                    }

                    Meteor.call('removeTask', task._id, () => { sweetAlert.close(); });
                });

        },
    });
});
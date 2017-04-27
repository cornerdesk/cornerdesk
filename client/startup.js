Modal.allowMultiple = true;

Meteor.startup(() => {
    Bert.defaults.style = 'growl-bottom-right';
    Bert.defaults.icons = {
        default: 'ti-comments-smiley',
        success: 'ti-face-smile',
        info: 'ti-info',
        warning: 'ti-alert',
        danger: 'ti-face-sad'
    };
});
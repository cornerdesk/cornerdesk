
Modal.allowMultiple = true;

Meteor.startup(() => {
    Bert.defaults.style = 'lined-top-right';
    //Bert.defaults.hideDelay = -1;
    Bert.icons = {
        default: 'ti-comments-smiley',
        success: 'ti-face-smile',
        info: 'ti-info',
        warning: 'ti-alert',
        danger: 'ti-face-sad'
    };
});
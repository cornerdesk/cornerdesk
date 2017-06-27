Template.colorPicker.onCreated(() => {

});

Template.colorPicker.onRendered(() => {
    let template = Template.instance(),
        datacontext = template.data;
    template.$('#' + datacontext.identifier).colorpicker({
        color: datacontext.color,
        format: 'hex',
        colorSelectors: {
            '#f44336': '#f44336', //red
            '#e91e63': '#e91e63', //pink
            '#9c27b0': '#9c27b0', //purple
            '#673ab7': '#673ab7', //deep-purple
            '#3f51b5': '#3f51b5', //indigo
            '#2196f3': '#2196f3', //blue
            '#03a9f4': '#03a9f4', //light-blue
            '#00bcd4': '#00bcd4', //cyan
            '#009688': '#009688', //teal
            '#4caf50': '#4caf50', //green
            '#8bc34a': '#8bc34a', //light-green
            '#cddc39': '#cddc39', //lime
            '#ffeb3b': '#ffeb3b', //yellow
            '#ffc107': '#ffc107', //amber
            '#ff9800': '#ff9800', //orange
            '#ff5722': '#ff5722', //deep-orange
            '#795548': '#795548', //brown
            '#9e9e9e': '#9e9e9e', //grey
            '#607d8b': '#607d8b', //blue-grey
            '#666666': '#666666',
        },
        template: '<div class="colorpicker dropdown-menu colorpicker-hidden colorpicker-horizontal colorpicker-right">' +
            '<div class="colorpicker-selectors" style="display: block;">' +
            '</div>',
        component: '.colorpicker-addon',
        horizontal: true
    }).on('changeColor', function(e) {
        var hexColor = e.color.toString('hex');
        $(e.target).css('color', hexColor);
        datacontext.color = hexColor;
    }).css('color', datacontext.color);
})
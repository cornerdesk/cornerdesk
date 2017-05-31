var fixedTop = false;

var mobile_menu_visible = 0,
    mobile_menu_initialized = false,
    toggle_initialized = false,
    bootstrap_nav_initialized = false,
    $sidebar,
    isWindows;

var param_sidebar_mini = false;

pdp = {
    misc: {
        navbar_menu_visible: 0,
        active_collapse: true,
        disabled_collapse_init: 0

    },
    initSidebarsCheck: function() {
        // Init navigation toggle for small screens
        if ($(window).width() <= 991) {
            if ($sidebar.length != 0) {
                pdp.initSidebarMenu();
            } else {
                pdp.initBootstrapNavbarMenu();
            }
        } else if (mobile_menu_initialized == true) {
            // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
            $sidebar_wrapper.find('.navbar-form').remove();
            $sidebar_wrapper.find('.nav-mobile-menu').remove();

            mobile_menu_initialized = false;
        }
    },

    initMinimizeSidebar: function() {
        $('#minimizeSidebar').click(function() {
            var $btn = $(this);

            if (pdp.misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-toggled'); //sidebar-mini for mini bar
                $btn.html('<i class="ti-menu"></i>');
                pdp.misc.sidebar_mini_active = false;

            } else {
                $('body').addClass('sidebar-toggled');
                $btn.html('<i class="ti-menu-alt"></i>');
                pdp.misc.sidebar_mini_active = true;
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function() {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function() {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    },

    initSidebarMenu: function() {
        $sidebar_wrapper = $('.sidebar-wrapper');

        if (!mobile_menu_initialized) {

            $navbar = $('nav').find('.navbar-collapse').first().clone(true);

            nav_content = '';
            mobile_menu_content = '';

            $navbar.children('ul').each(function() {

                content_buff = $(this).html();
                nav_content = nav_content + content_buff;
            });

            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

            $navbar_form = $('nav').find('.navbar-form').clone(true);

            $sidebar_nav = $sidebar_wrapper.find(' > .nav');

            // insert the navbar form before the sidebar list
            $nav_content = $(nav_content);
            $nav_content.insertBefore($sidebar_nav);
            $navbar_form.insertBefore($nav_content);

            $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function(event) {
                event.stopPropagation();

            });

            mobile_menu_initialized = true;
        } else {
            if ($(window).width() > 991) {
                // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                $sidebar_wrapper.find('.navbar-form').remove();
                $sidebar_wrapper.find('.nav-mobile-menu').remove();

                mobile_menu_initialized = false;
            }
        }

        if (!toggle_initialized) {
            $toggle = $('.navbar-toggle');

            $toggle.click(function() {

                if (mobile_menu_visible == 1) {
                    $('html').removeClass('nav-open');

                    $('.close-layer').remove();
                    setTimeout(function() {
                        $toggle.removeClass('toggled');
                    }, 400);

                    mobile_menu_visible = 0;
                } else {
                    setTimeout(function() {
                        $toggle.addClass('toggled');
                    }, 430);

                    main_panel_height = $('.main-panel')[0].scrollHeight;
                    $layer = $('<div class="close-layer"></div>');
                    $layer.css('height', main_panel_height + 'px');
                    $layer.appendTo(".main-panel");


                    setTimeout(function() {
                        $layer.addClass('visible');
                    }, 100);

                    $layer.click(function() {
                        $('html').removeClass('nav-open');
                        mobile_menu_visible = 0;

                        $layer.removeClass('visible');

                        setTimeout(function() {
                            $layer.remove();
                            $toggle.removeClass('toggled');

                        }, 400);
                    });

                    $('html').addClass('nav-open');
                    mobile_menu_visible = 1;

                }
            });

            toggle_initialized = true;
        }

    },

    initBootstrapNavbarMenu: debounce(function() {

        if (!bootstrap_nav_initialized) {
            $navbar = $('nav').find('.navbar-collapse').first().clone(true);

            nav_content = '';
            mobile_menu_content = '';

            //add the content from the regular header to the mobile menu
            $navbar.children('ul').each(function() {
                content_buff = $(this).html();
                nav_content = nav_content + content_buff;
            });

            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

            $navbar.html(nav_content);
            $navbar.addClass('off-canvas-sidebar');

            // append it to the body, so it will come from the right side of the screen
            $('body').append($navbar);

            $toggle = $('.navbar-toggle');

            $navbar.find('a').removeClass('btn btn-round btn-default');
            $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
            $navbar.find('button').addClass('btn-simple btn-block');

            $toggle.click(function() {
                if (mobile_menu_visible == 1) {
                    $('html').removeClass('nav-open');

                    $('.close-layer').remove();
                    setTimeout(function() {
                        $toggle.removeClass('toggled');
                    }, 400);

                    mobile_menu_visible = 0;
                } else {
                    setTimeout(function() {
                        $toggle.addClass('toggled');
                    }, 430);

                    $layer = $('<div class="close-layer"></div>');
                    $layer.appendTo(".wrapper-full-page");

                    setTimeout(function() {
                        $layer.addClass('visible');
                    }, 100);


                    $layer.click(function() {
                        $('html').removeClass('nav-open');
                        mobile_menu_visible = 0;

                        $layer.removeClass('visible');

                        setTimeout(function() {
                            $layer.remove();
                            $toggle.removeClass('toggled');

                        }, 400);
                    });

                    $('html').addClass('nav-open');
                    mobile_menu_visible = 1;

                }

            });
            bootstrap_nav_initialized = true;
        }
    }, 500),
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};

Template.sidebar.onCreated(() => {
    let template = Template.instance();
    template.subscribe('sidebar');
});

Template.sidebar.onRendered(() => {
    window_width = $(window).width();
    $sidebar = $('.sidebar');
    $('#sidebarMenu').perfectScrollbar();
    $('#sidebarMenu').on('mouseenter', function() {
        $('#sidebarMenu').perfectScrollbar('update');
    });
    $('#sidebarMobileMenu').perfectScrollbar();
    $('#sidebarMobileMenu').on('mouseenter', function() {
        $('#sidebarMobileMenu').perfectScrollbar('update');
    });
    pdp.initSidebarsCheck();
    pdp.initMinimizeSidebar();
});

Template.sidebar.helpers({
    currentChannel(name) {
        if (FlowRouter.getRouteName() === 'channel') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentCalendar(name) {
        if (FlowRouter.getRouteName() === 'calendar') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentBoard(name) {
        if (FlowRouter.getRouteName() === 'kanboard') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentPins() {
        if (FlowRouter.getRouteName() === 'pins') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentUsername() {
        let currentUser = Meteor.users.findOne({ _id: Meteor.userId() });
        return currentUser.username;
    },
    calendars() {
        let calendars = Calendars.find();
        if (calendars) {
            return calendars;
        }
    },
    channels() {
        let channels = Channels.find();
        if (channels) {
            return channels;
        }
    },
    hasUnreadMessages(channel) {
        return channel.hasUnreadMessages(Meteor.userId());
    },
    kanboards() {
        let kanboards = Kanboards.find();
        if (kanboards) {
            return kanboards;
        }
    },
    users() {
        let users = Meteor.users.find({ _id: { $ne: Meteor.userId() } });
        if (users) {
            return users;
        }
    },
    initials(name) {
        return name.first[0].toUpperCase() + name.last[0].toUpperCase()
    },
    fullName(name) {
        if (name) {
            return `${name.first} ${name.last}`;
        }
    }
});

Template.sidebar.events({
    'click [name="new-calendar-button"]': (event, template) => {
        Modal.show('newCalendarModal');

    },
    'click [name="new-channel-button"]': (event, template) => {
        Modal.show('newChannelModal');

    },
    'click [name="new-board-button"]': (event, template) => {
        Modal.show('newBoardModal');
    },
});
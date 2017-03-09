const authenticatedRoutes = FlowRouter.group( { name: 'authenticated' } );

authenticatedRoutes.route( '/' , {
  name: 'home',
  action() {
    BlazeLayout.render( 'default', { yield: 'home' } );
  }
});

authenticatedRoutes.route( '/messages/:channel', {
  name: 'channel',
  action() {
    BlazeLayout.render( 'default', { yield: 'channel' } );
  }
});

authenticatedRoutes.route( '/calendars/:calendar', {
  name: 'calendar',
  action() {
    BlazeLayout.render( 'default', { yield: 'calendar' } );
  }
});

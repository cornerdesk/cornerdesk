import setBrowserPolicies from './modules/set-browser-policies';
import seedDatabase from './modules/seed-database';

Meteor.startup(() => {
    setBrowserPolicies();
    seedDatabase();
    BrowserPolicy.content.allowOriginForAll('*.ngrok.io');
    BrowserPolicy.content.allowOriginForAll('blob:');
    BrowserPolicy.content.allowDataUrlForAll();
});
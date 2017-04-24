import seed from 'meteor/themeteorchef:seeder';

let _seedUsers = () => {
    Seed('users', {
        environments: ['development', 'staging', 'production'],
        data: [{
                username: 'admin',
                email: 'admin@admin.com',
                password: 'remotradmin',
                profile: {
                    name: { first: 'Remotr', last: 'Admin' }
                },
                roles: ['admin']
            },
            {
                username: 'bigguy1991',
                email: 'bigguy@admin.com',
                password: 'password',
                profile: {
                    name: { first: 'Carl', last: 'Winslow' }
                },
                roles: ['admin']
            }, {
                username: 'beetsfan123',
                email: 'doug@admin.com',
                password: 'password',
                profile: {
                    name: { first: 'Doug', last: 'Funnie' }
                },
                roles: ['admin']
            }
        ]
    });
};

let _seedChannels = () => {
    Seed('channels', {
        environments: ['development', 'staging', 'production'],
        data: [{ name: 'general', description: 'One channel to rule them all...', isPrivate: false }]
    });
};

export default function() {
    _seedUsers();
    _seedChannels();
}
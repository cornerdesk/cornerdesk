let _assignOwner = (list) => {
    list.ownerId = Meteor.userId();
};

let _insertList = (list) => {
    return Kanlists.insert(list);
};

export default function(list) {
    _assignOwner(list);

    _insertList(list);
}
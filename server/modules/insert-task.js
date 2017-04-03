let _assignOwnerAndDate = (task) => {
    task.ownerId = Meteor.userId();
    task.createdAt = new Date();
};

let _insertTask = (task) => {
    return Kantasks.insert(task);
};

export default function(task) {
    _assignOwnerAndDate(task);

    _insertTask(task);
}
let _updateTask = (taskId, modifiers) => {
    return Kantasks.update(taskId, modifiers);
};

export default function(taskId, modifiers) {
    _updateTask(taskId, modifiers);
}
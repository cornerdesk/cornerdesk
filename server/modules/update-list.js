let _updateList = (listId, modifiers) => {
    return Kanlists.update(listId, modifiers);
};

export default function(listId, modifiers) {
    _updateList(listId, modifiers);
}
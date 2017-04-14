Meteor.methods({
    insertBoard(board) {
        check(board, {
            name: String,
            description: String,
            isPrivate: Boolean,
        });

        return Kanboards.insert(board);
    },
});
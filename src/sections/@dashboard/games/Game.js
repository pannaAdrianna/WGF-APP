class Game {
    constructor(id, name, status, lastEditBy) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.last_edit_by = lastEditBy;
    }

    toString() {
        return this.name + ', ' + this.status + ', ' + this.last_edit_by;
    }
}

export default Game;

// Firestore data converter
export const gameConverter = {
    toFirestore: (game) => {
        return {
            id: game.id,
            name: game.name,
            status: game.status,
            lastEditBy: game.last_edit_by
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Game(data.id, data.name, data.status, data.lastEditBy);
    }
};

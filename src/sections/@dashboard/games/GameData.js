export default class GameData {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.status = data.status;
        this.last_edit_by = data.lastEditBy;
    }

    toString() {
        return this.name + ', ' + this.status + ', ' + this.last_edit_by;
    }
}

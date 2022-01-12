class StormDB {
  constructor(engine) {
    this.engine = engine;

    this.state = this.engine.init();
    this.pointers = [];
  }
}

//adding the other methods
Object.setPrototypeOf(StormDB.prototype, require("./methods/all.js"));

module.exports = StormDB;
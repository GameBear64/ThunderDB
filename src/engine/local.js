const fs = require("fs");

module.exports = class Engine {
  constructor(path, options = {}) {
    this.path = path;

    this.async = options.async || false;
  }

  init() {
    const exists = fs.existsSync(this.path);
    if (!exists) {
      fs.writeFileSync(this.path, JSON.stringify({}));
      return {};
    } else {
      return this.read();
    }
  }

  read() {
    let data = fs.readFileSync(this.path, "UTF-8");
    if (data === "") data = "{}";

    try {
      let json = JSON.parse(data);
      return json;
    } catch (error) {
      error.message =
        "Failed to load StormDB database file - invalid or corrupted format.";
      throw error;
    }
  }

  write(data) {
    // if async, return promise wrapper around async writefile
    if (this.async) {
      return new Promise(
        function (resolve, reject) {
          fs.writeFile(this.path, JSON.stringify(data, null, 2), function (error) {
            if (error) return reject(error);
            else resolve();
          });
        }.bind(this)
      );
    }

    fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    return null;
  }
};

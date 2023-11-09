"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
var typeorm_1 = require("typeorm");
exports.dataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
});

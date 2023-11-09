import { DataSource } from "typeorm"

export const dataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
})
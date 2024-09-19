import { DataSource, DataSourceOptions } from "typeorm";

export const ormConfig: DataSourceOptions = {
  type: "sqlite",
  entities: [`${__dirname}**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  database: "db.sqlite",
  synchronize: true,
  logging: true,
};

const dataSource = new DataSource(ormConfig);
export default dataSource;

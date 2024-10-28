import { DataSource, DataSourceOptions } from "typeorm";

import { Investment } from "./entities/Investment";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  url: "postgresql://postgres.gipqajasswwqqlqiwdyz:D_QASD-t!R!HhT5@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  synchronize: true, // Use false in production
  entities: [Investment],
} as DataSourceOptions);

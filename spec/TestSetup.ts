import { sql } from "kysely"
import db from "../Api/src/Database"

beforeEach(async () => {
  // Delete all rows in every table at the start of each test
  await sql`
do
$$
declare
  trunc_all_sql text;
begin
  SELECT 'truncate table ' || string_agg(format('%I.%I', table_schema, table_name), ',') into trunc_all_sql
  FROM information_schema.tables
  WHERE table_schema='public'
    AND table_type='BASE TABLE';

  execute trunc_all_sql;
end;
$$`.execute(db)
})

import sql from 'k6/x/sql';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// The second argument is the Spanner connection string, e.g.
// "projects/${PROJECT}/instances/${INSTANCE}/database/${DATABASE}"
const db = sql.open("spanner", "");

export function setup() {
  // We can't run DDL commands from our connection, so a the schema will
  // need to updated to add the required table using a tool like gcloud:
  // $ gcloud spanner database ddl update ${DATABASE} --instance ${INSTANCE} \
  //   --ddl-file spanner spanner-ddl.sql
}

export function teardown() {
  db.close();
}

export default function () {
  const keyval = randomString(8)
  db.exec("INSERT INTO keyvalues (key, value) VALUES(?, ?)", keyval, "k6-plugin-sql");

  let results = sql.query(db, "SELECT * FROM keyvalues WHERE key=?", keyval)
  for (const row of results) {
    console.log(`key: ${row.key}, value: ${row.value}`);
  }
}

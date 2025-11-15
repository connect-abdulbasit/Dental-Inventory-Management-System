import { Client, QueryResultRow } from "pg";

export async function query<T extends QueryResultRow = any>(sql: string, params: any[] = []): Promise<{ rows: T[] }> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const result = await client.query<T>(sql, params);
    return result;
  } finally {
    await client.end();
  }
}

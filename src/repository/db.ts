import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create and export the postgres connection
export const sql = postgres(databaseUrl, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
});

export interface Summary {
  id: number;
  url: string;
  summary: string;
}

export async function testConnection(): Promise<boolean> {
  try {
    const res = await sql`SELECT 1`;
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export async function saveSummary(
  url: string,
  summary: string,
): Promise<Summary> {
  const result = await sql<Summary[]>`
    INSERT INTO summaries (url, summary)
    VALUES (${url}, ${summary})
    RETURNING id, url, summary
  `;
  return result[0];
}

// Export a function to close the connection gracefully
export async function closeConnection(): Promise<void> {
  await sql.end();
  console.log('Database connection closed');
}

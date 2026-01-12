import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';

// 1. Define strict types for SQL parameters (No 'any')
type Primitive = string | number | boolean | null | Date;
type SqlParam = Primitive | Primitive[];

// 2. Singleton Setup for Next.js (Prevents connection exhaustion in HMR/Serverless)
// We extend the global interface so TypeScript doesn't complain about adding properties to globalThis
declare global {
  // eslint-disable-next-line no-var
  var _postgresPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Necessary for Supabase Transaction Pooler
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close clients after 30 seconds of inactivity
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// 3. Create or reuse the pool
const pool = global._postgresPool || new Pool(poolConfig);

// In development, save the pool to the global object to prevent recreation
if (process.env.NODE_ENV !== 'production') {
  global._postgresPool = pool;
}

// 4. The Wrapper
export const db = {
  /**
   * A strictly typed wrapper around pool.query.
   * @param text The SQL query string
   * @param params The array of parameters (strictly typed, no any)
   * @returns A Promise resolving to the QueryResult
   */
  query: async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: SqlParam[]
  ): Promise<QueryResult<T>> => {
    const start = Date.now();
    try {
      const res = await pool.query<T>(text, params);
      
      // Optional: Log long-running queries in production
      const duration = Date.now() - start;
      if (duration > 5000) {
        console.warn(`[Slow Query] ${duration}ms: ${text}`);
      }
      
      return res;
    } catch (error) {
      console.error('[Database Error]', { text, error });
      throw error;
    }
  },

  /**
   * Helper to get a single client for transactions
   */
  getClient: async () => {
    const client = await pool.connect();
    // Monkey patch the query method to track usage or add logging if needed
    // or just return the raw client
    return client;
  }
};
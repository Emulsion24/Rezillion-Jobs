import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';

// 1. Strict Types (Avoids 'any')
type Primitive = string | number | boolean | null | Date;
type SqlParam = Primitive | Primitive[];

// 2. Singleton Interface to handle Next.js Hot Reloading
declare global {
  // eslint-disable-next-line no-var
  var _postgresPool: Pool | undefined;
}

// 3. Lazy Configuration Helper
// This prevents "DATABASE_URL is undefined" errors during 'npm run build'
const getPoolConfig = (): PoolConfig => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  return {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
    max: 20, // Max number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Fail if connection takes longer than 5s
  };
};

// 4. Singleton Pool Getter
const getPool = (): Pool => {
  // Re-use existing pool if it exists (Development HMR)
  if (global._postgresPool) {
    return global._postgresPool;
  }

  // Create a new pool
  const config = getPoolConfig();
  const pool = new Pool(config);

  // Save to global object in development to prevent connection exhaustion
  if (process.env.NODE_ENV !== 'production') {
    global._postgresPool = pool;
  }

  return pool;
};

// 5. The Exported Wrapper
export const db = {
  /**
   * Strictly typed query wrapper.
   * @param text The SQL query string
   * @param params The array of parameters
   */
  query: async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: SqlParam[]
  ): Promise<QueryResult<T>> => {
    const start = Date.now();
    const pool = getPool(); // Initialize pool only when needed

    try {
      const res = await pool.query<T>(text, params);
      
      // Performance: Log slow queries (> 5 seconds)
      const duration = Date.now() - start;
      if (duration > 5000) {
        console.warn(`[Slow Query] ${duration}ms: ${text}`);
      }
      
      return res;
    } catch (error) {
      // Log the error with the query that caused it for debugging
      console.error('[Database Error]', { text, error });
      throw error;
    }
  },

  /**
   * Get a raw client (Useful for Transactions: BEGIN / COMMIT / ROLLBACK)
   */
  getClient: async () => {
    const pool = getPool();
    const client = await pool.connect();
    return client;
  }
};
import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DATABASE, type Database } from './database.provider';

type TenantTransaction = Parameters<Parameters<Database['transaction']>[0]>[0];

@Injectable()
export class TenantTransactionService {
  constructor(@Inject(DATABASE) private readonly database: Database) {}

  /** Tenant IDs must come from trusted server-side authentication only. */
  async withTenant<T>(
    tenantId: string,
    operation: (transaction: TenantTransaction) => Promise<T>,
  ): Promise<T> {
    return this.database.transaction(async (transaction) => {
      await transaction.execute(
        sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
      );
      return operation(transaction);
    });
  }
}

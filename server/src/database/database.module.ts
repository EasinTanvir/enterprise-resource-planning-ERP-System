import { Global, Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL, databaseProviders } from './database.provider';
import { TenantTransactionService } from './tenant-transaction.service';

@Global()
@Module({
  providers: [...databaseProviders, TenantTransactionService],
  exports: [...databaseProviders, TenantTransactionService],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}
  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

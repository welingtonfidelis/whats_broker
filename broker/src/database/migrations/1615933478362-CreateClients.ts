import {
  MigrationInterface, QueryRunner, Table, TableIndex,
} from 'typeorm';

export class CreateClients1615654510694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(new Table({
      name: 'clients',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'number',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'end_point',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'bot_key',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'active',
          type: 'boolean',
          isNullable: false,
          default: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_CLIENT_NAME',
      columnNames: ['name'],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_CLIENT_CREATED_AT',
      columnNames: ['created_at'],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_CLIENT_NUMBER',
      columnNames: ['number'],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_CLIENT_BOT_KEY',
      columnNames: ['bot_key'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('clients', 'IDX_CLIENT_NAME');
    await queryRunner.dropIndex('clients', 'IDX_CLIENT_CREATED_AT');
    await queryRunner.dropIndex('clients', 'IDX_CLIENT_NUMBER');
    await queryRunner.dropIndex('clients', 'IDX_CLIENT_BOT_KEY');
    await queryRunner.dropTable('clients');
    await queryRunner.query('DROP EXTENSION "uuid-ossp"');
  }
}

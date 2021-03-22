import {
  MigrationInterface, QueryRunner, Table, TableIndex,
} from 'typeorm';
import { hashSync } from 'bcrypt';

const defaultAdminName = process.env.DEFAULT_ADMIN_NAME;
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

export class CreateUsers1616363425311 implements MigrationInterface {
  name?: string;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
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
          name: 'password',
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
          name: 'role',
          type: 'enum',
          isNullable: false,
          enum: ['admin', 'manager', 'agent'],
        },
        {
          name: 'client_id',
          type: 'varchar',
          isNullable: true,
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
      foreignKeys: [
        {
          name: 'FKClient',
          referencedTableName: 'clients',
          referencedColumnNames: ['id'],
          columnNames: ['client_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_USER_NAME',
      columnNames: ['name'],
    }));

    await queryRunner.createIndex('clients', new TableIndex({
      name: 'IDX_USER_EMAIL',
      columnNames: ['email'],
    }));

    await queryRunner
      .manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          name: defaultAdminName,
          email: defaultAdminEmail,
          password: hashSync(defaultAdminPassword, 10),
          role: 'admin',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('clients', 'IDX_USER_NAME');
    await queryRunner.dropIndex('clients', 'IDX_USER_EMAIL');
    await queryRunner.dropTable('users');
  }
}

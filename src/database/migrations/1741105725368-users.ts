import { User } from '@/users/user.entity';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

export class Users1741105725368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_name',
            type: 'varchar(30)',
          },
          {
            name: 'password',
            type: 'text',
          },
          {
            name: 'first_name',
            type: 'varchar(50)',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar(50)',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_date',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    const foreignKey = new TableForeignKey({
      columnNames: ['role_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'roles',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryRunner.createForeignKey('users', foreignKey);

    const saltOrRounds = 10;

    const mainUser = {
      id: uuid(),
      role_id: 'bef1e78b-95d4-41bf-81de-0e71d02533a5',
      is_active: true,
      user_name: 'admin',
      password: await bcrypt.hash('1234', saltOrRounds),
      created_date: new Date(),
      first_name: 'Admin',
    };

    await queryRunner.manager.insert(User, mainUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

import { Roles } from '@/roles/roles.entity';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class Roles1741103213580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar(30)',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'varchar(255)',
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

    const mainRoles = [
      {
        id: "bef1e78b-95d4-41bf-81de-0e71d02533a5",
        name: 'Admin',
        is_active: true,
        crerated_date: new Date(),
        created_by: 'system',
        updated_by: null,
        updated_date: null,
      },
      {
        id: "15d6a627-5ce1-4090-a2d3-37a1dc920bdf",
        name: 'Member',
        is_active: true,
        crerated_date: new Date(),
        created_by: 'system',
        updated_by: null,
        updated_date: null,
      },
    ];

    await queryRunner.manager.insert(Roles, mainRoles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}

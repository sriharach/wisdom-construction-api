import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ServiceCategoriesHouse1741172264314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'service_categories_house',
              columns: [
                {
                  name: 'id',
                  type: 'uuid',
                  isPrimary: true,
                  default: 'gen_random_uuid()',
                },
                {
                  name: 'name',
                  type: 'varchar(50)',
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
          )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('service_categories_house');
    }

}

import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
    up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.createTable('groups', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            group_name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
        await queryInterface.createTable('group_memberships', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'groups', key: 'id' }
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            }
        });
        await queryInterface.createTable('documents', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            file_path: {
                type: DataTypes.STRING,
                allowNull: false
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'groups', key: 'id' }
            }
        });
    },
    down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.dropTable('groups');
        await queryInterface.dropTable('group_memberships');
        await queryInterface.dropTable('documents');
    }
};

export = migration;
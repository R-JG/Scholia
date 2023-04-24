import { DataTypes, QueryInterface } from 'sequelize';

export const migration = {
    up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.dropTable('documents');
        await queryInterface.createTable('group_documents', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: false
            },
            group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'groups', key: 'id' }
            },
            document_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            file_path: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
    },
    down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.dropTable('group_documents');
        await queryInterface.createTable('documents', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: false
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
    }
};
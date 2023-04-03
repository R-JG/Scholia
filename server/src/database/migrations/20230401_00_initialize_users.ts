import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
    up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })
    },
    down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.dropTable('users');
    }
};

export = migration;
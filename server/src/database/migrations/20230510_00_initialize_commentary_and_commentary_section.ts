import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
    up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.createTable('commentaries', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
            document_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'group_documents', key: 'id' }
            },
            commentary_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            introduction: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            conclusion: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        });
        await queryInterface.createTable('commentary_sections', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            commentary_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'commentaries', key: 'id' }
            },
            page_number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            page_coordinate_top: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            page_coordinate_bottom: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        });
    },
    down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
        await queryInterface.dropTable('commentaries');
        await queryInterface.dropTable('commentary_sections');
    }
};

export = migration;
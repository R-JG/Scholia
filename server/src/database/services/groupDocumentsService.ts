import { Op } from 'sequelize';
import GroupDocument from '../models/GroupDocument';
import { NewGroupDocument, GroupDocumentModel } from '../../typeUtils/types';

const createOne = async (newDocument: NewGroupDocument): Promise<GroupDocumentModel> => {
    return await GroupDocument.create(newDocument);
};

const getAllByGroup = async (groupIds: string[]): Promise<GroupDocumentModel[]> => {
    return await GroupDocument.findAll({ where: { groupId: { [Op.in]: groupIds } } });
};

const getOneById = async (documentId: string): Promise<GroupDocumentModel | null> => {
    return await GroupDocument.findByPk(documentId);
};

export default { createOne, getAllByGroup, getOneById };
import GroupDocument from '../models/GroupDocument';
import { NewGroupDocument, GroupDocumentModel } from '../../typeUtils/types';

const createOne = async (newDocument: NewGroupDocument): Promise<GroupDocumentModel> => {
    return await GroupDocument.create(newDocument);
};

const getAll = async (groupId: string): Promise<GroupDocumentModel[]> => {
    return await GroupDocument.findAll({ where: { groupId } });
};

const getOneById = async (documentId: string): Promise<GroupDocumentModel | null> => {
    return await GroupDocument.findByPk(documentId);
};

export default { createOne, getAll, getOneById };
import GroupDocument from '../models/GroupDocument';
import { NewGroupDocument, GroupDocumentModel } from '../../typeUtils/types';

const createOne = async (newDocument: NewGroupDocument): Promise<GroupDocumentModel> => {
    return await GroupDocument.create(newDocument);
};

const getAll = async (groupId: string): Promise<GroupDocumentModel[]> => {
    return await GroupDocument.findAll({ where: { groupId } });
};

export default { createOne, getAll };
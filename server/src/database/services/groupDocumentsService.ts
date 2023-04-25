import GroupDocument from '../models/GroupDocument';
import { NewGroupDocument, GroupDocumentModel } from '../../typeUtils/types';

const createOne = async (newDocument: NewGroupDocument): Promise<GroupDocumentModel> => {
    return await GroupDocument.create(newDocument);
};

export default { createOne };
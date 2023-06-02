import { Request, Response, NextFunction } from 'express';
import fsp from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
import { THUMBNAIL_DIR_FILE_PATH } from '../serverUtils/config';
import { logError } from '../serverUtils/logger';
import { UserModel, NewGroupDocument, GroupDocumentInfo, GroupDocumentModel } from '../typeUtils/types';
import { parseQueryParams } from '../typeUtils/validation';
import groupDocumentsService from '../database/services/groupDocumentsService';
import groupsService from '../database/services/groupsService';

const createThumbnailPDF = async (documentFilePath: string, documentId: number): Promise<void> => {
    try {
        const documentData = new Uint8Array(await fsp.readFile(documentFilePath));
        const uploadedDocument = await PDFDocument.load(documentData);
        const newDocument = await PDFDocument.create();
        const [firstPage] = await newDocument.copyPages(uploadedDocument, [0]);
        newDocument.addPage(firstPage);
        const thumbnailDocument = Buffer.from(await newDocument.save());
        await fsp.writeFile(
            `${THUMBNAIL_DIR_FILE_PATH}/${documentId}.pdf`, 
            thumbnailDocument
        );
    } catch (error) {
        logError(error);
    };
};

const createOne = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        if (!request.file) {
            response.status(500).json({ error: 'error in processing file' });
            return;
        };
        const authenticatedUser: UserModel = response.locals.authenticatedUser;
        const groupId: string = request.params.groupId;
        const groupMemberIds: number[] = await groupsService.getAllMemberIds(groupId);
        const userIsMember: boolean = groupMemberIds.includes(authenticatedUser.id);
        if (!userIsMember) {
            response.status(403).json({ 
                error: 'user does not have sufficient membership to add a document to this group' 
            });
        };
        const uploadedFile = request.file;
        const documentName: string = uploadedFile.originalname.replace(/\.pdf/gi, '');
        const newDocument: NewGroupDocument = {
            groupId,
            documentName,
            filePath: uploadedFile.path
        };
        const addedDocument = await groupDocumentsService.createOne(newDocument);
        const addedDocumentInfo: GroupDocumentInfo = {
            id: addedDocument.id,
            groupId: addedDocument.groupId,
            documentName: addedDocument.documentName
        };
        await createThumbnailPDF(uploadedFile.path, addedDocument.id);
        response.json(addedDocumentInfo);
    } catch (error) {
        next(error);
    };
};

const getAllDocumentInfoByGroup = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void>  => {
    try {
        const groupIdQueryParams: string[] = parseQueryParams(request.query.groupId);
        const groupDocuments: GroupDocumentModel[] = await groupDocumentsService.getAllByGroup(
            groupIdQueryParams
        );
        const groupDocumentsInfo: GroupDocumentInfo[] = groupDocuments.map(document => ({
            id: document.id,
            groupId: document.groupId,
            documentName: document.documentName
        }));
        response.json(groupDocumentsInfo);
    } catch (error) {
        next(error); 
    };
};

const getSingleDocumentInfo = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const documentId: string = request.params.documentId;
        const groupDocument: GroupDocumentModel | null = await groupDocumentsService.getOneById(documentId);
        if (!groupDocument) {
            response.status(404).json({ error: 'document not found' });
            return;
        };
        const groupDocumentInfo: GroupDocumentInfo = {
            id: groupDocument.id,
            groupId: groupDocument.groupId,
            documentName: groupDocument.documentName
        };
        response.json(groupDocumentInfo);
    } catch (error) {
        next(error);
    };
};

const getSingleDocumentFile = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const documentId: string = request.params.documentId;
        const groupDocument: GroupDocumentModel | null = await groupDocumentsService.getOneById(documentId);
        if (!groupDocument) {
            response.status(404).json({ error: 'document not found' });
            return;
        };
        response.sendFile(groupDocument.filePath);
    } catch (error) {
        next(error);
    };
};

const getSingleDocumentThumbnail = async (
        request: Request, response: Response, next: NextFunction
    ): Promise<void> => {
    try {
        const documentId: string = request.params.documentId;
        const thumbnailFilePath: string = `${THUMBNAIL_DIR_FILE_PATH}/${documentId}.pdf`;
        response.sendFile(thumbnailFilePath);
    } catch (error) {
        next(error);
    };
};

export default { 
    createOne, 
    getAllDocumentInfoByGroup, 
    getSingleDocumentInfo, 
    getSingleDocumentFile, 
    getSingleDocumentThumbnail 
};
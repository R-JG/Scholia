import axios from 'axios';
import { GroupEntry, Group } from '../typeUtils/types';
import { parseGroup, parseGroupArray } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/groups';

const createGroup = async (newGroupData: GroupEntry, token: string): Promise<Group | null> => {
    try {
        const response = await axios.post(
            baseUrl,
            newGroupData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const createdGroup: Group = parseGroup(response.data);
        return createdGroup;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const getGroupsByUser = async (token: string): Promise<Group[]> => {
    try {
        const response = await axios.get(
            baseUrl, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersGroups: Group[] = parseGroupArray(response.data);
        return usersGroups;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const getGroupsByName = async (token: string, searchTerm: string): Promise<Group[]> => {
    try {
        const response = await axios.get(
            `${baseUrl}/search/${searchTerm}`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const groupsResult: Group[] = parseGroupArray(response.data);
        return groupsResult;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const joinGroupById = async (token: string, groupId: number): Promise<Group | null> => {
    try {
        const response = await axios.post(
            `${baseUrl}/join/${groupId}`, 
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const joinedGroup: Group = parseGroup(response.data);
        return joinedGroup;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { createGroup, getGroupsByUser, getGroupsByName, joinGroupById };
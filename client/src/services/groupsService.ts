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

export default { createGroup, getGroupsByUser };
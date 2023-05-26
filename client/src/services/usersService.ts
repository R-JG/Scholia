import axios from 'axios';
import { UserEntry, User } from '../typeUtils/types';
import { parseUser, parseUserArray, parseBoolean } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/users';

const createUser = async (newUserData: UserEntry): Promise<User | null> => {
    try {
        const response = await axios.post(baseUrl, newUserData);
        const createdUser: User = parseUser(response.data);
        return createdUser;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const searchByUsername = async (searchTerm: string, token: string): Promise<User[]> => {
    try {
        const response = await axios.get(
            `${baseUrl}/search/${searchTerm}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersResult: User[] = parseUserArray(response.data);
        return usersResult;
    } catch (error) {
        console.error(error);
        return [];
    };
};

const checkIfUserExists = async (searchTerm: string): Promise<boolean | null> => {
    try {
        const response = await axios.get(`${baseUrl}/verify/${searchTerm}`);
        const result: boolean = parseBoolean(response.data);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { createUser, searchByUsername, checkIfUserExists };
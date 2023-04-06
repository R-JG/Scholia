import axios from 'axios';
import { UserEntry, CreatedUser } from '../typeUtils/types';
import { parseCreatedUser } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/users';

const createUser = async (newUserData: UserEntry): Promise<CreatedUser | null> => {
    try {
        const response = await axios.post(baseUrl, newUserData);
        const createdUser: CreatedUser = parseCreatedUser(response.data);
        return createdUser;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { createUser };
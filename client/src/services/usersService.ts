import axios from 'axios';
import { UserEntry } from '../typeUtils/types';

const baseUrl: string = '/api/v1/users';

const createUser = async (newUserData: UserEntry) => {
    try {
        const response = await axios.post(baseUrl, newUserData);
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

export default { createUser };
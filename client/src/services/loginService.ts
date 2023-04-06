import axios from 'axios';
import { UserEntry, UserToken } from '../typeUtils/types';
import { parseUserToken } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/login';

const login = async (loginData: UserEntry): Promise<UserToken | null> => {
    try {
        const response = await axios.post(baseUrl, loginData);
        const userToken = parseUserToken(response.data);
        return userToken;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { login };
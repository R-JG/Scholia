import axios from 'axios';
import { UserEntry, LoggedInUser } from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/login';

const login = async (loginData: UserEntry): Promise<LoggedInUser | null> => {
    try {
        const response = await axios.post(baseUrl, loginData);
        const loggedInUser = parseLoggedInUser(response.data);
        return loggedInUser;
    } catch (error) {
        console.error(error);
        return null;
    };
};

export default { login };
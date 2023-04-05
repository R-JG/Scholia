import axios from 'axios';
import { UserEntry } from '../typeUtils/types';

const baseUrl: string = '/api/v1/login';

const login = async (loginData: UserEntry) => {
    try {
        const response = await axios.post(baseUrl, loginData);
        return response.data;
    } catch (error) {
        console.error(error);
    };
};

export default { login };
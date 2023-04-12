import axios from 'axios';
import { GroupEntry } from '../typeUtils/types';

const baseUrl: string = '/api/v1/groups';

const createGroup = async (newGroupData: GroupEntry, token: string) => {
    const response = await axios.post(
        baseUrl,
        newGroupData,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(response.data);
};

export default { createGroup };
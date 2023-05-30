import axios from 'axios';
import { HttpsAgent } from 'agentkeepalive';

const agent = new HttpsAgent({
    keepAlive: true, 
    timeout: 60000,
    freeSocketTimeout: 30000
});

const axiosInstance = axios.create({ httpsAgent: agent });

export default axiosInstance;
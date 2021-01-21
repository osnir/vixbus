import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://sistemas.es.gov.br/webservices/ceturb/onibus/api'
});

export default Api;
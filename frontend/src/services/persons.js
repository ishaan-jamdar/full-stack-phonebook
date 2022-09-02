import axios from 'axios';
const baseUrl = '/api/entries';

const getAll = () => axios.get(baseUrl).then(response => response.data);

const create = newPerson => axios.post(baseUrl, newPerson).then(response => response.data);

const update = (id, newPerson) => axios.put(baseUrl + `/${id}`, newPerson).then(response => response.data);

const remove = id => axios.delete(baseUrl + `/${id}`);

const functions = {getAll, create, update, remove}

export default functions;

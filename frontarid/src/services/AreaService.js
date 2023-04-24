import axios from 'axios';

const API_URL = 'http://44.197.13.101:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

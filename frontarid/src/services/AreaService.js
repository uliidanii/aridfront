import axios from 'axios';

const API_URL = 'http://44.204.79.85:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

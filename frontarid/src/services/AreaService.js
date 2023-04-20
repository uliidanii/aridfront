import axios from 'axios';

const API_URL = 'http://54.88.92.181:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

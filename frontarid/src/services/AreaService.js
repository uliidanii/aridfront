import axios from 'axios';

const API_URL = 'http://3.230.179.252:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

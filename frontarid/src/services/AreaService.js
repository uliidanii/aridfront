import axios from 'axios';

const API_URL = 'http://54.210.56.185:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

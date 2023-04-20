import axios from 'axios';

const API_URL = 'http://52.90.241.214:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

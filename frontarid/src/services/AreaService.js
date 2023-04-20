import axios from 'axios';

const API_URL = 'http://3.83.153.165:8080';

const AreaService = {
  registrarArea: (area) => {
    return axios.post(`${API_URL}/areas`, area);
  },
};

export default AreaService;

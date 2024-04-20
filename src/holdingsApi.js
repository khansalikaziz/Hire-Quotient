import axios from 'axios';

const BASE_URL = 'https://canopy-frontend-task.now.sh/api/holdings';

export const fetchHoldings = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};
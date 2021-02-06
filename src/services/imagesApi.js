import axios from 'axios';

const API_KEY = '19125225-7dee0ee7ebb4766682ccd7b12';
const BASE_URL = 'https://pixabay.com/api';

const fetchImage = async (searchQuery, page) => {
  const response = await axios.get(
    `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=8&key=${API_KEY}`,
  );
  return response.data;
};
export default fetchImage;

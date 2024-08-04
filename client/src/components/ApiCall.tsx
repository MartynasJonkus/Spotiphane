import axios from 'axios';

export const generateLithophane = async (songLink: string) => {
  const response = await axios.post(
    'http://localhost:5000/generate_lithophane',
    {
      song_url: songLink,
      frame_width: 10,
      min_thickness: 0.6,
      max_thickness: 3.0,
      max_width: 100.0,
    },
    {
      responseType: 'blob',
    }
  );
  return window.URL.createObjectURL(new Blob([response.data]));
};

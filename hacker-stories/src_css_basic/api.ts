import axios from "axios";

const BASE_URL = "https://hn.algolia.com/api/v1/";

export interface Stories {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

export interface StoriesUI {
  data:  Stories[];
  page: number;
  totalPages: number;
}

export interface StoriesResponse {
  hits: Stories[];
  page: number;
  nbPages: number;
}

export const getAsyncStories = (query: string): Promise<StoriesUI> => {
  const getUrl = `${BASE_URL}search?query=${query}`;
  return new Promise((resolve, reject) => {
    const asyncFetch = async () => {
      try {
        const response = await axios.get<StoriesResponse>(getUrl)
        if (response.status == 200) {
          resolve({
            data: response.data.hits,
            page: response.data.page,
            totalPages: response.data.nbPages
          });
        } else {
          reject(`Invalid response: ${response.status}`);
        }
      }
      catch (error) {
        reject('Unexpected error')
      }
    };

    asyncFetch();
  });
};

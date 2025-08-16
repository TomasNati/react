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
  data: {
    stories: Stories[];
  };
}

export interface StoriesResponse {
  hits: Stories[];
}

export const getAsyncStories = (query: string): Promise<StoriesUI> => {
  const getUrl = `${BASE_URL}search?query=${query}`;
  return new Promise((resolve, reject) => {
    const asyncFetch = async () => {
      const response = await axios.get<StoriesResponse>(getUrl)
      if (response.status == 200) {
        resolve({
          data: {
            stories: response.data.hits,
          },
        });
      } else {
        reject(`Invalid response: ${response.status}`);
      }
    };

    asyncFetch();
  });
};

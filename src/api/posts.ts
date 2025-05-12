export interface Post {
  id: number;
  message: string;
  time: number;
  likes: {count: number};
  comments: {count: number};
  reposts: {count: number};
  views: {count: number};
  user: {
    firstName: string;
    lastName: string;
    photo: {xs: string};
  };
  photos?: Array<{photo: {xs: {src: string}}}>;
  url: string;
}

export const fetchPosts = async (
  token: string,
  offset: number,
  limit: number,
): Promise<Post[]> => {
  const response = await fetch(
    `https://api.lo.ink/v1/posts/feed?count=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.message || 'Ошибка при получении постов';
    const errorCode = data?.error?.code;
    throw {message: errorMessage, code: errorCode};
  }

  return data?.data?.items ?? [];
};

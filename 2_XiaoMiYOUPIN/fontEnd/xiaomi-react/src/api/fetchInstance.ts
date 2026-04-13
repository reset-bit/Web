import { removeCookie } from 'typescript-cookie';

interface FetchInstanceProps {
  baseUrl: string;
  method?: 'POST' | 'GET';
  data?: unknown;
  token?: string;
}

export const fetchInstance = async (props: FetchInstanceProps) => {
  const { baseUrl, method = 'GET', data, token } = props;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = token;
  }

  const response = await fetch(`http://localhost:3000/${baseUrl}`, {
    method: method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  const json = await response.json();
  switch (json.code) {
    case 200:
      return json.data;
    case 401:
      removeCookie('token');
      throw new Error(json.msg);
    case 199:
    case 404:
    case 500:
      throw new Error(json.msg);
  }
};

const API_BASE_URL = 'https://dummyjson.com';

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = {
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};


const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (!query) {
    return url;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
};


const apiClient = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { query, signal, method = 'GET', body } = options;
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  


  if (!response.ok) {
    if (response.status === 400 || response.status === 401) {
      throw new Error('Неверный логин или пароль');

    } else {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }
  }


  return response.json() as Promise<T>;
};

export { apiClient };


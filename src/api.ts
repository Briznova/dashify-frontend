import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const session = {
  token: () => localStorage.getItem('dashify_token'),
  refresh: () => localStorage.getItem('dashify_refresh'),
  set: (accessToken: string, refreshToken?: string) => {
    if (!accessToken.trim()) throw new Error('Authentication response did not contain an access token.');
    localStorage.setItem('dashify_token', accessToken);
    if (refreshToken) localStorage.setItem('dashify_refresh', refreshToken);
  },
  school: (id: string, name: string) => {
    localStorage.setItem('dashify_school', id);
    localStorage.setItem('dashify_school_name', name);
  },
  clear: () => {
    ['dashify_token', 'dashify_refresh', 'dashify_school', 'dashify_school_name'].forEach((key) => localStorage.removeItem(key));
  },
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function schoolMembershipDetails(membership: unknown): { id: string; name: string } {
  const school = asRecord(asRecord(membership)?.school);
  const id = school?.id;
  if (!school || typeof id !== 'string' || !uuidPattern.test(id)) {
    throw new globalThis.Error('This school entry is missing a valid school UUID. Refresh the list or contact your administrator.');
  }
  return {
    id,
    name: typeof school.name === 'string' && school.name.trim() ? school.name : 'School',
  };
}

api.interceptors.request.use((config) => {
  const accessToken = session.token();
  if (accessToken) config.headers.set('Authorization', ['Bearer', accessToken].join(' '));
  else config.headers.delete('Authorization');
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      session.clear();
      if (location.pathname !== '/login') location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const msg = (error: any) => {
  const message = error?.response?.data?.message;
  return Array.isArray(message) ? message.join(', ') : message || error?.message || 'Request failed';
};
export const arr = (data: any): any[] => {
  data = data?.data && Object.keys(data).length < 4 ? data.data : data;
  return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : Array.isArray(data?.results) ? data.results : [];
};
export const unwrap = (data: any) => data?.data && Object.keys(data).length < 4 ? data.data : data;

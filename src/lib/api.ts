const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── Core fetch wrapper ────────────────────────────────────────────────────

async function request<T>(base: string, method: string, path: string, token?: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? `Request failed (${res.status})`);
  return data as T;
}

function call<T>(method: string, path: string, token?: string, body?: unknown): Promise<T> {
  return request<T>(API, method, path, token, body);
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  phone: string;
  phoneVerified: boolean;
  email?: string;
  emailVerified: boolean;
  name?: string;
  state?: string;
  city?: string;
  country?: string;
  gender?: string;
  category?: string;
  dob?: string;
  profilePic?: string;
  alternatePhone?: string;
  theme?: 'light' | 'dark';
  enableEmailLogin: boolean;
  emailLoginVerified: boolean;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteProfileBody {
  name: string;
  state: string;
  city?: string;
  email?: string;
  country?: string;
  gender?: string;
  category?: string;
  dob?: string;
  profilePic?: string;
  alternatePhone?: string;
  theme?: 'light' | 'dark';
}

export interface UpdateProfileBody {
  name?: string;
  profilePic?: string;
  alternatePhone?: string;
  gender?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  category?: string;
  theme?: 'light' | 'dark';
}

// ─── Auth endpoints ─────────────────────────────────────────────────────────

export interface LoginResponse {
  user: UserProfile & { firebaseUid: string };
  session: { id: string; deviceId: string; isActive: boolean };
}

export const loginOrRegister = (token: string, body?: {
  deviceId?: string;
  deviceType?: string;
  deviceName?: string;
}) =>
  call<LoginResponse>('POST', '/auth/login', token, body ?? {});

export const getCurrentUser = (token: string) =>
  call<UserProfile>('GET', '/auth/me', token);

export const logoutDevice = (token: string, deviceId?: string) =>
  call<{ message: string }>('POST', '/auth/logout', token, deviceId ? { deviceId } : {});

export interface SessionData {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: string;
  deviceName?: string;
  ipAddress?: string;
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
}

export const getSessions = (token: string) =>
  call<{ sessions: SessionData[]; currentDeviceId?: string }>('GET', '/auth/sessions', token);

export const logoutRemote = (token: string, deviceIds?: string[]) =>
  call<{ message: string; loggedOutCount: number }>(
    'POST', '/auth/logout-remote', token, deviceIds ? { deviceIds } : {},
  );

// ─── Profile endpoints ─────────────────────────────────────────────────────

export const completeProfile = (token: string, body: CompleteProfileBody) =>
  call<{ message: string; profile: UserProfile; profileComplete: boolean }>(
    'POST', '/profile/complete', token, body,
  );

export const getProfile = (token: string) =>
  call<UserProfile>('GET', '/profile', token);

export const updateProfile = (token: string, body: UpdateProfileBody) =>
  call<{ message: string; profile: UserProfile; profileComplete: boolean }>(
    'PATCH', '/profile/update', token, body,
  );

export const getProfileCompletionStatus = (token: string) =>
  call<{
    isComplete: boolean;
    completionPercentage: number;
    completedFields: string[];
    missingFields: string[];
    requiredFields: string[];
  }>('GET', '/profile/completion-status', token);

// ─── Email endpoints ────────────────────────────────────────────────────────

export const sendEmailUpdateOtp = (token: string, newEmail: string) =>
  call<{ message: string; email: string; emailVerified: boolean; verificationSent: boolean }>(
    'POST', '/profile/email/update', token, { newEmail },
  );

export const verifyEmailOtp = (token: string, email: string, code: string) =>
  call<{ message: string; email: string; emailVerified: boolean; verificationSent: boolean }>(
    'POST', '/profile/email/verify', token, { email, code },
  );

export const resendEmailVerification = (token: string, email: string) =>
  call<{ message: string; email: string }>(
    'POST', '/profile/email/resend-verification', token, { email },
  );

// ─── Email login endpoints ──────────────────────────────────────────────────

export const enableEmailLogin = (token: string, email: string, password: string) =>
  call<{ message: string; enableEmailLogin: boolean; email: string; verificationRequired: boolean }>(
    'POST', '/profile/email-login/enable', token, { email, password },
  );

export const verifyEmailLogin = (token: string, email: string, code: string) =>
  call<{ message: string; enableEmailLogin: boolean; email: string; verificationRequired: boolean }>(
    'POST', '/profile/email-login/verify', token, { email, code },
  );

export const updatePassword = (token: string, currentPassword: string, newPassword: string) =>
  call<{ message: string; timestamp: string }>(
    'POST', '/profile/password/update', token, { currentPassword, newPassword },
  );

export const disableEmailLogin = (token: string) =>
  call<{ message: string; enableEmailLogin: boolean }>(
    'DELETE', '/profile/email-login/disable', token,
  );

// ─── Blog types ─────────────────────────────────────────────────────────────

export interface BlogAuthor {
  id: string;
  name: string;
  tag?: string;
  bio?: string;
  avatarUrl?: string;
  expertise?: string;
  socialLinks?: { id: string; platform: string; url: string }[];
}

export interface BlogFAQ {
  id: string;
  question: string;
  answer: string;
  blogId: string;
}

export interface Blog {
  id: string;
  title: string;
  description?: string;
  content?: string;
  slug?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  tags: string[];
  author: BlogAuthor;
  faqs?: BlogFAQ[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Blog endpoints (public GET, auth for mutations) ────────────────────────

export const getBlogs = (params?: {
  page?: number;
  limit?: number;
  tag?: string;
  authorId?: string;
  search?: string;
}) => {
  const q = new URLSearchParams();
  if (params?.page)     q.set('page',     String(params.page));
  if (params?.limit)    q.set('limit',    String(params.limit));
  if (params?.tag)      q.set('tag',      params.tag);
  if (params?.authorId) q.set('authorId', params.authorId);
  if (params?.search)   q.set('search',   params.search);
  const qs = q.toString();
  return call<BlogListResponse>('GET', `/blogs${qs ? `?${qs}` : ''}`);
};

export const getBlogBySlug = (slug: string) =>
  call<Blog>('GET', `/blogs/by-slug/${encodeURIComponent(slug)}`);

export const getBlogById = (id: string) =>
  call<Blog>('GET', `/blogs/${id}`);

// ─── Counselling types ─────────────────────────────────────────────────────

export interface CounsellingQuota {
  id: string;
  name: string;
  short_name: string;
  tooltip_content: string | null;
  tooltip_content_html: string | null;
  master_quota: string;
}

export interface CounsellingApiBody {
  id: string;
  key: string | null;
  name: string;
  counselling_type: string;
  state: string;
  website_goto: string;
  website_registration: string;
  website_prospectus: string;
  is_pinned: boolean;
  allotment_sessions: string[];
  closing_rank_sessions: string[];
  seat_matrix_sessions: string[];
  fee_stipend_bond_sessions: string[];
  quotas: CounsellingQuota[];
}

export interface CounsellingApiOption {
  id: string;
  value: string;
  label: string;
  desc?: string;
  icon?: string;
  bodies: CounsellingApiBody[];
}

// ─── Counselling endpoints (public) ───────────────────────────────────────

export const getCounsellingOptions = () =>
  call<CounsellingApiOption[]>('GET', '/counselling');

// ─── Choice list types ─────────────────────────────────────────────────────

export interface ChoiceListSummary {
  id: string;
  name: string;
  caunselling: string;
  detailsCount: number;
  createdAt: string;
}

export interface ChoiceListDetail {
  id: string;
  name: string;
  caunselling: string;
  institute: string;
  course: string;
  quota: string;
  catagory: string;
  insertAt: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChoiceListFull {
  id: string;
  userId: string;
  name: string;
  caunselling: string;
  details: ChoiceListDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ChoiceListsResponse {
  choiceLists: ChoiceListSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Choice list endpoints (all require auth) ──────────────────────────────

export const getChoiceLists = (token: string, params?: { page?: number; limit?: number; search?: string }) => {
  const q = new URLSearchParams();
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  if (params?.search) q.set('search', params.search);
  const qs = q.toString();
  return request<ChoiceListsResponse>(API, 'GET', `/choice-lists${qs ? `?${qs}` : ''}`, token);
};

export const getChoiceList = (token: string, id: string) =>
  request<ChoiceListFull>(API, 'GET', `/choice-lists/${id}`, token);

export const createChoiceList = (token: string, body: { name: string; caunselling: string }) =>
  request<ChoiceListFull>(API, 'POST', '/choice-lists', token, body);

export const updateChoiceList = (token: string, id: string, body: { name?: string; caunselling?: string }) =>
  request<ChoiceListFull>(API, 'PATCH', `/choice-lists/${id}`, token, body);

export const deleteChoiceList = (token: string, id: string) =>
  request<{ message: string }>(API, 'DELETE', `/choice-lists/${id}`, token);

export const addChoiceListDetail = (
  token: string,
  choiceListId: string,
  body: { name: string; caunselling: string; institute: string; course: string; quota: string; catagory: string; insertAt: number },
) => request<ChoiceListDetail>(API, 'POST', `/choice-lists/${choiceListId}/details`, token, body);

export const deleteChoiceListDetail = (token: string, detailId: string) =>
  request<{ message: string }>(API, 'DELETE', `/choice-lists/details/${detailId}`, token);

export const reorderChoiceListDetails = (token: string, choiceListId: string, orderedIds: string[]) =>
  request<{ message: string }>(API, 'PATCH', `/choice-lists/${choiceListId}/reorder`, token, { orderedIds });

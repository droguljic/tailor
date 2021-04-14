import api from '@/api/auth';

export const login = ({ commit }, credentials) => {
  return api.login(credentials)
    .then(({ data: { user, authData } }) => commit('setAuth', { user, authData }));
};

export const logout = ({ commit }) => {
  return api.logout()
    .then(() => commit('resetAuth'));
};

export const changePassword = (_, { currentPassword, newPassword }) => {
  return api.changePassword(currentPassword, newPassword);
};

export const forgotPassword = (_, { email }) => api.forgotPassword(email);

export const fetchUserInfo = ({ commit }) => {
  return api.getUserInfo()
    .then(({ data: { user, authData } }) => commit('setAuth', { user, authData }))
    .catch(() => commit('resetAuth'));
};

export const updateInfo = ({ commit }, userData) => {
  return api.updateUserInfo(userData)
    .then(({ data: { user } }) => commit('setUser', user));
};

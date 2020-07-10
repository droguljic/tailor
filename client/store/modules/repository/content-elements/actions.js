import calculatePosition from 'utils/calculatePosition.js';
import generateActions from '@/store/helpers/actions';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const {
  add,
  api,
  fetch,
  get,
  remove,
  reset,
  save,
  setEndpoint,
  update
} = generateActions();
const baseUrl = process.env.API_PATH;
const feed = new SSEClient();

const Events = {
  Create: 'contentElement:create',
  Update: 'contentElement:update',
  Delete: 'contentElement:delete'
};

const subscribe = ({ dispatch, rootState, commit }) => {
  const { repositoryId } = rootState.route.params;
  const token = rootState.auth.token;
  const params = { repositoryId, token };
  const url = urlJoin(baseUrl, api.url('/subscribe'));
  feed
    .connect(url, { params })
    .subscribe(Events.Create, item => api.setCid(item) || dispatch('add', item))
    // .subscribe(Events.Update, item => commit('save', item))
    // .subscribe(Events.Update, item => dispatch('save', item))
    .subscribe(Events.Delete, item => commit('remove', item));
};

const insert = ({ dispatch }, { element, context }) => {
  return dispatch('save', { ...element, position: calculatePosition(context) });
};

const reorder = ({ commit }, { element, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { element, position });
  return api.post(`${element.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...element, ...data }));
};

export {
  add,
  get,
  fetch,
  insert,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  subscribe,
  update
};

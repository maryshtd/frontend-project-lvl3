import 'bootstrap';
import './scss/index.scss';

import i18n from 'i18next';
import { setLocale } from 'yup';
import initView from './view.js';
import resources from './locales/index.js';
import handleAddingFeed, { updateRss } from './handlers.js';

const app = async () => {
  const state = {
    rssLinks: [],
    viewedPosts: [],
    feeds: [],
    posts: [],
    error: '',
    formState: 'filling',
    lng: 'ru',
  };

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: state.lng,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18nInstance.t('errors.alreadyExists'),
      },
      string: {
        url: () => i18nInstance.t('errors.invalidUrl'),
        matches: () => i18nInstance.t('errors.invalidRSS'),
      },
    });
  });

  const elements = {
    rssInput: document.querySelector('#url-input'),
    feedsPlaceholder: document.querySelector('.feeds'),
    postsPlaceholder: document.querySelector('.posts'),
    feedbackPlaceholder: document.querySelector('.feedback'),
    form: document.querySelector('.rss-form'),
    modalWindow: document.getElementById('modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalBtn: document.querySelector('.full-article'),
  };

  const watchedState = initView(state, elements, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    handleAddingFeed(e, watchedState, i18nInstance);
  });

  updateRss(state);
};

export default app;

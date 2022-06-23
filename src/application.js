import 'bootstrap';
import './scss/index.scss';
import onChange from 'on-change';
import i18n from 'i18next';
import { setLocale } from 'yup';
import { render, renderErrors, removeFeedback } from './view.js';
import resources from './locales/index.js';
import handleAddingFeed from './handlers.js';

const app = async () => {
  const state = {
    rssLinks: [],
    feeds: [],
    posts: [],
    error: '',
    formState: 'filling',
    updateState: 'filling',
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
      },
    });
  });

  const elements = {
    rssInput: document.querySelector('#url-input'),

    feedsPlaceholder: document.querySelector('.feeds'),
    postsPlaceholder: document.querySelector('.posts'),
    feedbackPlaceholder: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'formState':
        if (value === 'loading') {
          removeFeedback(elements);
        }
        if (value === 'loaded') {
          render(watchedState, elements);
        }
        if (value === 'failed') {
          renderErrors(watchedState, elements);
        }
        break;
      case 'updateState':
        break;
      default:
        break;
    }
  });
  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    handleAddingFeed(e, watchedState);
  });
};

export default app;

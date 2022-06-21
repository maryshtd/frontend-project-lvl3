import 'bootstrap';
import './scss/index.scss';
import onChange from 'on-change';
import { string } from 'yup';
import axios from 'axios';
import parseFeed from './rssParser.js';
import { render, renderFail, removeFeedback } from './view.js';

const app = () => {
  const state = {
    rssLinks: [],
    feeds: [],
    posts: [],
    errors: [],
    formState: 'filling',
    updateState: 'filling',
  };

  const elements = {
    rssInput: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    feedsPlaceholder: document.querySelector('.feeds'),
    postsPlaceholder: document.querySelector('.posts'),
    feedbackPlaceholder: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'formState':
        if (value === 'filling') {
          removeFeedback(elements);
        }
        if (value === 'loaded') {
          render(state, elements);
        }
        if (value === 'failed') {
          renderFail(state, elements);
        }
        break;
      case 'updateState':
        break;
      default:
        break;
    }
  });
  const rssSchema = string().url().notOneOf(state.rssLinks).matches(/[a-z].rss/);
  elements.rssInput.addEventListener('change', () => {
    watchedState.formState = 'filling';
    console.log(state);
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { rssInput } = elements;
    const link = rssInput.value;
    rssSchema.validate(link).then(() => {
      state.rssLinks.push(link);
      console.log(state);
      axios
        .get(link)
        .then((response) => {
          const domparser = new DOMParser();
          const xmlFeed = domparser.parseFromString(response.data, 'application/xml');
          const { feed, posts } = parseFeed(xmlFeed);
          state.feeds.push(feed);
          posts.forEach((item) => state.posts.push(item));
          watchedState.formState = 'loaded';
        })
        .catch(() => {
          state.errors.push('Network error');
          watchedState.formState = 'failed';
        });
    }).catch((err) => {
      state.errors.push(err.errors);
      watchedState.formState = 'failed';
    });
  });
};

app();

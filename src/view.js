/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const createFeedsSection = (elements, i18nInstance) => {
  const { feedsPlaceholder } = elements;
  feedsPlaceholder.innerHTML = '';
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  feedsPlaceholder.append(feedsCard);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  feedsCard.append(cardBody);

  const header = document.createElement('h2');
  header.classList.add('card-title', 'h4');
  header.textContent = i18nInstance.t('screenTexts.feeds');
  cardBody.append(header);

  return feedsCard;
};

const createPostsSection = (elements, i18nInstance) => {
  const { postsPlaceholder } = elements;
  postsPlaceholder.innerHTML = '';
  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');
  postsPlaceholder.append(postsCard);
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  postsCard.append(cardBody);

  const header = document.createElement('h2');
  header.classList.add('card-title', 'h4');
  header.textContent = i18nInstance.t('screenTexts.feeds');
  cardBody.append(header);

  return postsCard;
};

const renderFeeds = (state, elements, i18nInstance) => {
  const feedsCard = createFeedsSection(elements, i18nInstance);
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  state.feeds.forEach((feed) => {
    const feedListEl = document.createElement('li');
    feedListEl.classList.add('list-group-item', 'border-0', 'rounded-0');

    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    feedListEl.append(feedHeader, feedDescription);
    feedList.append(feedListEl);
  });
  feedsCard.appendChild(feedList);
};

const addPostLink = (state, post) => {
  const postLink = document.createElement('a');
  const isRead = state.viewedPosts.filter((item) => item === post.id);
  if (isRead.length > 0) {
    postLink.classList.remove('fw-bold');
    postLink.classList.add('fw-normal');
  } else {
    postLink.classList.add('fw-bold');
  }
  postLink.setAttribute('href', post.link);
  postLink.setAttribute('target', '_blank');
  postLink.setAttribute('data-id', post.id);
  postLink.setAttribute('rel', 'noopener noreferrer');
  postLink.textContent = post.title;

  return postLink;
};

const addViewButton = (state, post) => {
  const viewButton = document.createElement('button');
  viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  viewButton.setAttribute('type', 'button');
  viewButton.setAttribute('data-id', post.id);
  viewButton.setAttribute('data-bs-toggle', 'modal');
  viewButton.setAttribute('data-bs-target', '#modal');
  viewButton.textContent = 'Просмотр';
  viewButton.addEventListener('click', () => {
    state.viewedPosts.push(post.id);
  });
  return viewButton;
};

const showModal = (state, elements, viewedIds) => {
  const { modalTitle, modalBody, modalBtn } = elements;
  // getting last viewed id
  const id = viewedIds[viewedIds.length - 1];
  // getting post by id
  const post = state.posts.filter((item) => item.id === id)[0];
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalBtn.setAttribute('href', post.link);
};

const renderPosts = (state, elements, i18nInstance) => {
  const postCard = createPostsSection(elements, i18nInstance);
  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  state.posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const postLink = addPostLink(state, post);
    postElement.append(postLink);
    const viewButton = addViewButton(state, post, elements);
    postElement.append(viewButton);
    postList.append(postElement);
  });
  postCard.append(postList);
};

const renderErrors = (state, elements, i18nInstance) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.classList.add('text-danger');
  feedbackPlaceholder.textContent = i18nInstance.t(state.error);
};

const renderSuccess = (elements, i18nInstance) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.classList.add('text-success');
  feedbackPlaceholder.textContent = i18nInstance.t('success');
};

const removeFeedback = (elements) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.textContent = '';
};

const renderFeed = (state, elements, i18nInstance) => {
  const { rssInput } = elements;
  rssInput.value = '';
  renderFeeds(state, elements, i18nInstance);
  renderPosts(state, elements, i18nInstance);
};

const switchFormState = (formState, elements, watchedState, i18nInstance) => {
  switch (formState) {
    case 'loading':
      removeFeedback(elements);
      break;
    case 'loaded':
      renderFeed(watchedState, elements, i18nInstance);
      renderSuccess(elements, i18nInstance);
      break;
    case 'failed':
      renderErrors(watchedState, elements, i18nInstance);
      break;
    default:
      throw new Error('Unknown state');
  }
};

export default (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'formState':
        switchFormState(value, elements, watchedState, i18nInstance);
        break;
      case 'posts':
        renderFeed(watchedState, elements, i18nInstance);
        break;
      case 'viewedPosts':
        showModal(watchedState, elements, value);
        renderFeed(watchedState, elements, i18nInstance);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

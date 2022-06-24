/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const renderFeedsSection = (elements) => {
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
  header.textContent = 'Фиды';
  cardBody.append(header);

  return feedsCard;
};

const renderPostsSection = (elements) => {
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
  header.textContent = 'Посты';
  cardBody.append(header);

  return postsCard;
};

const renderFeeds = (state, elements) => {
  const feedsCard = renderFeedsSection(elements);
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

const renderPostLink = (state, post) => {
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

const renderViewButton = (state, post, elements) => {
  const viewButton = document.createElement('button');
  viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  viewButton.setAttribute('type', 'button');
  viewButton.setAttribute('data-id', post.id);
  viewButton.setAttribute('data-bs-toggle', 'modal');
  viewButton.setAttribute('data-bs-target', '#modal');
  viewButton.textContent = 'Просмотр';
  viewButton.addEventListener('click', () => {
    const { modalTitle, modalBody, modalBtn } = elements;
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    modalBtn.setAttribute('href', post.link);
    state.viewedPosts.push(post.id);
  });
  return viewButton;
};

const renderPosts = (state, elements) => {
  const postCard = renderPostsSection(elements);
  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  state.posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const postLink = renderPostLink(state, post);
    postElement.append(postLink);
    const viewButton = renderViewButton(state, post, elements);
    postElement.append(viewButton);
    postList.append(postElement);
  });
  postCard.append(postList);
};

const renderErrors = (state, elements) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.classList.add('text-danger');
  feedbackPlaceholder.textContent = state.error;
};

const renderSuccess = (state, elements, i18nInstance) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.classList.add('text-success');
  feedbackPlaceholder.textContent = i18nInstance.t('success');
};

const removeFeedback = (elements) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.textContent = '';
};

const renderFeed = (state, elements) => {
  const { rssInput } = elements;
  rssInput.value = '';
  renderFeeds(state, elements);
  renderPosts(state, elements);
};

export default (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'formState':
        if (value === 'loading') {
          removeFeedback(elements);
        }
        if (value === 'loaded') {
          renderFeed(watchedState, elements);
          renderSuccess(watchedState, elements, i18nInstance);
        }
        if (value === 'failed') {
          renderErrors(watchedState, elements);
        }
        break;
      case 'posts':
        renderFeed(watchedState, elements);
        break;
      case 'viewedPosts':
        renderFeed(watchedState, elements);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

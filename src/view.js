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

const renderPostLink = (post) => {
  const postLink = document.createElement('a');
  postLink.classList.add('fw-bold');
  postLink.setAttribute('href', post.link);
  postLink.setAttribute('target', '_blank');
  postLink.setAttribute('data-id', post.id);
  postLink.setAttribute('rel', 'noopener noreferrer');
  postLink.textContent = post.title;

  return postLink;
};

const renderViewButton = (post) => {
  const viewButton = document.createElement('button');
  viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  viewButton.setAttribute('type', 'button');
  viewButton.setAttribute('data-id', post.id);
  viewButton.setAttribute('data-bs-toggle', 'modal');
  viewButton.setAttribute('data-bs-target', '#modal');
  viewButton.textContent = 'Просмотр';
  return viewButton;
};

const renderPosts = (state, elements) => {
  const postCard = renderPostsSection(elements);
  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  state.posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const postLink = renderPostLink(post);
    postElement.append(postLink);
    const viewButton = renderViewButton(post);
    postElement.append(viewButton);
    postList.append(postElement);
  });
  postCard.append(postList);
};

const renderFail = (state, elements) => {
  const { feedbackPlaceholder } = elements;
  [...feedbackPlaceholder.textContent] = state.errors;
};

const removeFeedback = (elements) => {
  const { feedbackPlaceholder } = elements;
  feedbackPlaceholder.textContent = '';
};

const render = (state, elements) => {
  const { rssInput } = elements;
  rssInput.value = '';
  renderFeeds(state, elements);
  renderPosts(state, elements);
};

export { render, renderFail, removeFeedback };

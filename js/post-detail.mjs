import postApi from './api/postApi.js';
import utils from './utils.js';
const renderPost = (post) => {
  const heroElement = document.querySelector('#postHeroImage');
  if (heroElement) {
    heroElement.style.backgroundImage = `url(${post.imageUrl})`;
  }

  const postTitleElement = document.querySelector('#postDetailTitle');
  if (postTitleElement) {
    postTitleElement.textContent = post.title;
  }

  const postAuthorElement = document.querySelector('#postDetailAuthor');
  if (postAuthorElement) {
    postAuthorElement.textContent = post.author;
  }

  const postTimeElement = document.querySelector('#postDetailTimeSpan');
  if (postTimeElement) {
    postTimeElement.textContent = `- ${utils.formatDate(post.updatedAt)}`;
  }

  const descriptionElement = document.querySelector('#postDetailDescription');
  if (descriptionElement) {
    descriptionElement.textContent = post.description;
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  try {
    const post = await postApi.get(postId);
    renderPost(post);
  } catch (error) {
    console.log(error);
  }
})();

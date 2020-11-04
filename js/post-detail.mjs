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
    document.querySelector('#loader-wrapper').setAttribute('hidden', '');
  } catch (error) {
    console.log(error);
  }

  const editElement = document.querySelector('#goToEditPageLink');
  if (editElement) {
    editElement.href = `/add-edit-post.html?id=${postId}`;
    editElement.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
})();

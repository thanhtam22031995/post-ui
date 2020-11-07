import postApi from './api/postApi.js';
import utils from './utils.js';

const renderPost = (post) => {
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);

  utils.setTextByElementId('postDetailTitle', post.title);

  utils.setTextByElementId('postDetailAuthor', post.author);

  utils.setTextByElementId('postDetailTimeSpan', `- ${utils.formatDate(post.updatedAt)}`);

  utils.setTextByElementId('postDetailDescription', post.description);
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  try {
    const post = await postApi.get(postId);
    renderPost(post);

    const loading = document.querySelector('#loader-wrapper');
    if (loading) {
      loading.setAttribute('hidden', '');
    }
  } catch (error) {
    console.log(error);
  }

  const editElement = document.querySelector('#goToEditPageLink');
  if (editElement) {
    editElement.href = `/add-edit-post.html?id=${postId}`;
    editElement.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
})();

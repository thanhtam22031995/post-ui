import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';
import utils from './utils.js';

const setFormValues = (post) => {
  utils.setTextByElementId('postDetailTitle', post.title);

  utils.setValueByElementId('postTitle', post.title);

  utils.setValueByElementId('postAuthor', post.author);

  utils.setValueByElementId('postDescription', post.description);

  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
};

const handleChangeImage = () => {
  const randomId = 1 + Math.trunc(Math.random() * 1000);

  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  const element = document.querySelector('#postHeroImage');
  if (element) {
    element.style.backgroundImage = `url(${imageUrl})`;

    const imageElement = document.querySelector('#fakeImg');
    if (imageElement) {
      imageElement.setAttribute('hidden', '');
      imageElement.src = imageUrl;
      imageElement.onerror = function () {
        handleChangeImage();
      };
    }
  }
};

const getFormValues = () => {
  const formvalues = {
    title: utils.getValueByElementId('postTitle'),
    author: utils.getValueByElementId('postAuthor'),
    description: utils.getValueByElementId('postDescription'),
    imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
  };

  return formvalues;
};
const validateForm = () => {
  let isValid = true;

  const titleElement = document.querySelector('#postTitle');
  const title = titleElement.value;
  if (!title) {
    titleElement.classList.add('is-invalid');
    isValid = false;
  }

  const authorElement = document.querySelector('#postAuthor');
  const author = authorElement.value;
  if (!author) {
    authorElement.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
};

const handleFormSubmit = async (postId) => {
  const formValues = getFormValues();

  console.log(formValues);
  const isValid = validateForm(formValues);

  if (!isValid) return;
  try {
    if (postId) {
      formValues.id = postId;
      await postApi.update(formValues);

      alert('Update post successfully');
    } else {
      const newPost = await postApi.add(formValues);
      window.location = `add-edit-post.html?id=${newPost.id}`;

      alert('Add new post successfully');
    }
  } catch (error) {
    console.log("Can't update data", error);
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const isEditMode = !!postId;
  const loading = document.querySelector('#loader-wrapper');

  if (isEditMode) {
    try {
      const post = await postApi.get(postId);
      setFormValues(post);

      loading.setAttribute('hidden', '');

      const goDetailElement = document.querySelector('#goToDetailPageLink');
      if (goDetailElement) {
        goDetailElement.href = `./post-detail.html?id=${postId}`;
        goDetailElement.innerHTML = '<i class="far fa-eye"></i> View post detail';
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    handleChangeImage();

    loading.setAttribute('hidden', '');
  }

  const changeBackgroundButton = document.querySelector('#postChangeImage');
  if (changeBackgroundButton) {
    changeBackgroundButton.addEventListener('click', handleChangeImage);
  }

  const formElement = document.querySelector('#postForm');
  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      handleFormSubmit(postId);
      e.preventDefault();
    });
  }
})();

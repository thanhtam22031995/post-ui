import axiosClient from "./axiosClient.js";

const postApi = {
  getAll(params) {
    const url = "/posts";
    return axiosClient.get(url, { params });
  },

  get(postId) {
    const url = `/posts/${postId}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = "/posts";
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
// console.log(postApi);

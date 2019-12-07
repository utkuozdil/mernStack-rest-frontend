import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { findErrors, findErrorsExtended } from "../../util/error";
import {
  postPath,
  statusPath,
  updatePostPath,
  createPostPath
} from "../../util/path";
import * as actions from "../action/Feed";
import * as constant from "../constant/Feed";

export function* fetchStatusHandler(action) {
  const { token } = action;
  try {
    const responseJSON = yield axios.get(statusPath, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    findErrors(responseJSON, "fetching status failed");
    const responseData = responseJSON.data;
    const data = {
      status: responseData.status
    };
    yield put(actions.fetchStatusSuccess(data));
  } catch (error) {
    yield put(actions.fetchStatusFail(error));
  }
}

export function* updateStatusHandler(action) {
  const { status, token } = action;
  try {
    const responseJSON = yield axios.patch(
      statusPath,
      JSON.stringify({ status: status }),
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    findErrorsExtended(responseJSON, "updating status failed");
    const responseData = responseJSON.data;
    const data = {
      status: responseData.status
    };
    yield put(actions.updateStatusSuccess(data));
  } catch (error) {
    yield put(actions.updateStatusFail(error));
  }
}

export function* loadPostsHandler(action) {
  const { page, token } = action;
  try {
    const data = yield* loadPosts(page, token);
    yield put(actions.loadPostsSuccess(data));
  } catch (error) {
    yield put(actions.loadPostsFail(error));
  }
}

export function* createPostHandler(action) {
  const { id, formData, token, page } = action;
  try {
    let responseJSON;
    if (id)
      responseJSON = yield axios.put(updatePostPath + id, formData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
    else
      responseJSON = yield axios.post(createPostPath, formData, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

    findErrorsExtended(responseJSON, "creating or updating posts failed");

    const data = yield* loadPosts(page, token);
    yield put(actions.createPostSuccess(data));
  } catch (error) {
    yield put(actions.createPostFail(error));
  }
}

export function* deletePostHandler(action) {
  const { token, page, postId } = action;

  try {
    const responseJSON = yield axios.delete(updatePostPath + postId, {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    findErrorsExtended(responseJSON, "deleting posts failed");
    const data = yield* loadPosts(page, token);
    yield put(actions.deletePostSuccess(data));
  } catch (error) {
    yield put(actions.deletePostFail(error));
  }
}

function* loadPosts(page, token) {
  const responseJSON = yield axios.get(postPath + page, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  findErrors(responseJSON, "fetching posts failed");
  const responseData = responseJSON.data;
  const data = {
    posts: responseData.posts.map(item => {
      return { ...item, imagePath: item.imageUrl };
    }),
    totalPosts: responseData.totalItems,
    postsLoading: false
  };
  return data;
}

export default function* feedHandler() {
  yield takeLatest(constant.FETCH_STATUS, fetchStatusHandler);
  yield takeLatest(constant.UPDATE_STATUS, updateStatusHandler);
  yield takeLatest(constant.LOAD_POSTS, loadPostsHandler);
  yield takeLatest(constant.CREATE_POST, createPostHandler);
  yield takeLatest(constant.DELETE_POST, deletePostHandler);
}

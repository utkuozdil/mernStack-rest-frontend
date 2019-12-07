import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { findErrors } from "../../util/error";
import { imagePath, singlePostPath } from "../../util/path";
import * as actions from "../action/SinglePost";
import * as constant from "../constant/SinglePost";

export function* fetchSinglePostHandler(action) {
  try {
    const { postId, token } = action;
    const responseJSON = yield axios.get(singlePostPath + postId, {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    findErrors(responseJSON, "fetching post failed");
    const responseData = responseJSON.data;
    const data = {
      title: responseData.post.title,
      author: responseData.post.creator.name,
      image: imagePath + responseData.post.imageUrl,
      date: new Date(responseData.post.createdAt).toLocaleDateString("en-US"),
      content: responseData.post.content
    };
    yield put(actions.fetchSinglePostSuccess(data));
  } catch (error) {
    yield put(actions.fetchSinglePostFail(error));
  }
}

export default function* singlePostHandler() {
  yield takeLatest(constant.FETCH_SINGLE_POST, fetchSinglePostHandler);
}

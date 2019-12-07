import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { findErrors, findValidationErrors } from "../../util/error";
import { loginPath, signupPath } from "../../util/path";
import * as actions from "../action/Auth";
import * as constant from "../constant/Auth";

export function* loginHandler(action) {
  const { email, password } = action;
  try {
    const responseJSON = yield axios.post(
      loginPath,
      JSON.stringify({
        email: email,
        password: password
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    findValidationErrors(responseJSON);
    findErrors(responseJSON, "login failed");
    const responseData = responseJSON.data;

    localStorage.setItem("token", responseData.token);
    localStorage.setItem("userId", responseData.userId);
    const remainingMilliseconds = 4 * 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    localStorage.setItem("expiryDate", expiryDate.toISOString());

    const data = {
      isAuth: true,
      token: responseData.token,
      authLoading: false,
      userId: responseData.userId,
      autoLogout: remainingMilliseconds
    };

    yield put(actions.loginSuccess(data));
  } catch (error) {
    yield put(actions.loginFail(error));
  }
}

export function* logoutHandler(action) {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");

    const data = {
      isAuth: false,
      token: null
    };

    yield put(actions.logoutSuccess(data));
  } catch (error) {
    yield put(actions.logoutFail(error));
  }
}

export function* signupHandler(action) {
  const { email, name, password, history } = action;
  try {
    const responseJSON = yield axios.put(
      signupPath,
      JSON.stringify({
        email: email,
        password: password,
        name: name
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    findValidationErrors(responseJSON);
    findErrors(responseJSON, "user creation failed");

    const data = {
      isAuth: false,
      authLoading: false
    };

    history.replace("/");

    yield put(actions.signupSuccess(data));
  } catch (error) {
    yield put(actions.signupFail(error));
  }
}

export default function* authHandler() {
  yield takeLatest(constant.LOGIN, loginHandler);
  yield takeLatest(constant.LOGOUT, logoutHandler);
  yield takeLatest(constant.SIGNUP, signupHandler);
}

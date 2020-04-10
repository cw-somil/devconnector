import axios from "axios"
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
} from "./types"
import { setAlert } from "./alert"
import setAuthToken from "../utils/setAuthToken"

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"))
  }

  try {
    const res = await axios.get("api/auth")
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

export const login = ({ email, password }) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const logUser = { email, password }
    const body = JSON.stringify(logUser)
    const res = await axios.post("api/auth", body, config)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    errors.forEach((error) => dispatch(setAlert(error.msg, "danger")))

    dispatch({
      type: LOGIN_FAILED,
    })
  }
}

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  })
}
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    const newUser = { name, email, password }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const data = JSON.stringify(newUser)
    const res = await axios.post("/api/users", data, config)

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 3000)))
    }

    dispatch({
      type: REGISTER_FAILED,
    })
  }
}

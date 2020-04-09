import axios from "axios"
import { REGISTER_SUCCESS, REGISTER_FAILED } from "./types"
import { setAlert } from "./alert"

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

import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router";
import { login } from "../../api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { hideLoader, showLoader } from "../../../slice/loaderSlice";
import { setToken } from "../../../slice/userSlice";

export default function Login() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dispatch = useDispatch();
  const response = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitting) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
      if (response) {
        if (response.success) {
          toast.success("Successfully logged in");
          dispatch(setToken(response.token));
          navigate("/");
        } else {
          toast.error(response.error);
        }
      }
    }
  }, [isSubmitting, response]);

  return (
    <div className="container">
      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <Form method="POST" autoComplete="off">
            <input type="email" placeholder="Email" name="email" required />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Password"
              name="password"
            />
            <button disabled={isSubmitting}>Login</button>
          </Form>
        </div>
        <div className="card_terms">
          <span>
            Don't have an account yet?
            <Link to="/signup">Signup Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  try {
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    const response = await login(formData);
    return response;
  } catch (error) {
    return error.cause;
  }
}

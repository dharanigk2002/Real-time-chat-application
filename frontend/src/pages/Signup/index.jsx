import {
  Form,
  Link,
  Navigate,
  useActionData,
  useNavigation,
} from "react-router";
import { signup } from "../../api/auth";
import toast from "react-hot-toast";

export default function Signup() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const response = useActionData();
  if (response?.success) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <div className="card">
        <div className="card_title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <Form method="POST" autoComplete="off">
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
              />
            </div>
            <input type="email" placeholder="Email" name="email" required />
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              minLength={8}
            />
            <button disabled={isSubmitting}>Sign Up</button>
          </Form>
        </div>
        <div className="card_terms">
          <span>
            Already have an account?
            <Link to="/login">Login Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const { firstName, lastName, email, password } = Object.fromEntries(data);
  try {
    const response = await signup({ firstName, lastName, email, password });
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(error.message);
    return error.cause;
  }
}

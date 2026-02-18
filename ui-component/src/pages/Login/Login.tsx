import React, { useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { navigateTo } from "../../services/navigateUtil";
import { spinnerContext } from "../../components/Spinner/spinnerContext";
import { signIn } from "../../services/service";

const Login = () => {
  // State variables to manage the user input for username and password
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Prevents double submission if user clicks login button multiple times
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accessing login function from AuthContext
  const { login } = useContext<any>(AuthContext);

  // Accessing setShowSpinner to control the spinner visibility during login
  const { setShowSpinner } = useContext(spinnerContext);

  // Handle form submission when user tries to log in
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSubmitting) return; // guard against double clicks
    setIsSubmitting(true);
    try {
      setShowSpinner(true);
      const response = await signIn(userName, password);
      login(response.data);
    } catch (error) {
      navigateTo("/login");
    } finally {
      setShowSpinner(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Modal styling to create a login popup */}
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(18, 19, 19, 0.85)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h4 className="mb-3 text-center">LOGIN</h4>
              <div className="row justify-content-center">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">
                      User Name
                    </label>
                    <input
                      className="form-control"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
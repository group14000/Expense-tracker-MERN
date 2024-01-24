// Import necessary dependencies
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

// LoginPage component
const LoginPage = ({ onLogin }) => {
  const { state, setField, resetForm } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      if (response.ok) {
        console.log("Login successful!");
        resetForm();
        onLogin(); // Call the login handler to set the login state
        navigate("/expenses"); // Redirect to the protected route
      } else {
        const responseData = await response.json();
        alert(`Login failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </label>

        <label className="block mb-2">
          Password:
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          New User?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

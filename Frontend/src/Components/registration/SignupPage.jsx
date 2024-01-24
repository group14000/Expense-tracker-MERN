import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const { state, setField, resetForm } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
          confirmPassword: state.confirmPassword,
        }),
      });

      if (response.ok) {
        console.log("Signup successful!");
        resetForm();
        alert("Signup successful!");
      } else {
        const responseData = await response.json();
        alert(`Signup failed: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </label>

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

        <label className="block mb-2">
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          Already Have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

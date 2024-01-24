import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Navbar component
const Navbar = () => {
  // Destructuring values from the useUser hook
  const { resetForm, setLoggedOut, isLoggedIn } = useUser();

  // Function to handle logout
  const handleLogout = () => {
    // Add any necessary logout logic here
    // For now, reset the user form and set the user as logged out
    resetForm();
    setLoggedOut();
  };

  // useEffect hook for any side effects (e.g., authentication logic)
  useEffect(() => {
    // Replace the following line with your actual authentication logic
    // For example, if you have a global authentication state:
    // const isLoggedIn = authService.isAuthenticated();
    // or if using context:
    // const isLoggedIn = authContext.isAuthenticated();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // JSX for the Navbar component
  return (
    <nav className="bg-gray-800 p-4">
      {/* Navigation links */}
      <ul className="flex justify-center items-center space-x-4 text-white">
      <li>
          <Link to="*" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/expenses" className="hover:text-gray-300">
            Expenses
          </Link>
        </li>
        <li>
          <Link to="/add-expenses" className="hover:text-gray-300">
            Add New Expense
          </Link>
        </li>
        {/* Conditional rendering based on isLoggedIn state */}
        {isLoggedIn ? (
          <li>
            {/* Logout button */}
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </li>
        ) : (
          <li>
            {/* Register link */}
            <Link to="/login" className="hover:text-gray-300">
              Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

// Export the Navbar component as the default export
export default Navbar;

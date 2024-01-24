import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isLoggedIn: false, // New field for tracking authentication status
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_FORM":
      return initialState;
    case "SET_LOGGED_IN":
      return { ...state, isLoggedIn: true };
    case "SET_LOGGED_OUT":
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setField = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const setLoggedIn = () => {
    dispatch({ type: "SET_LOGGED_IN" });
  };

  const setLoggedOut = () => {
    dispatch({ type: "SET_LOGGED_OUT" });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        setField,
        resetForm,
        isLoggedIn: state.isLoggedIn,
        setLoggedIn,
        setLoggedOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };

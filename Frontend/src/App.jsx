import { useState } from "react";
import AddExpensesForm from "./components/expenses/AddExpensesForm";
import ExpenseList from "./components/expenses/ExpenseList";
import Navbar from "./components/navbar/Navbar";
import LoginPage from "./components/registration/LoginPage";
import SignupPage from "./components/registration/SignupPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/footer/Footer";
import HomePage from "./components/homepage/HomePage";
import RazorpayButton from "./components/payment/RazorpayButton";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {isLoggedIn ? (
          <>
            <Route path="/add-expenses" element={<AddExpensesForm />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/payment" element={<RazorpayButton />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

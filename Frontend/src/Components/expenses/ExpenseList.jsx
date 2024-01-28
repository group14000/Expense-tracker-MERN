// ExpenseList.js (frontend)
import { useState, useEffect } from "react";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);

  useEffect(() => {
    fetch(`http://localhost:3001/api/get-expenses?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      });
  }, [currentPage]); // Add currentPage as a dependency

  const handleDeleteExpense = (expenseId) => {
    fetch(`http://localhost:3001/api/delete-expense/${expenseId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setExpenses((prevExpenses) =>
            prevExpenses.filter((expense) => expense._id !== expenseId)
          );
        } else {
          console.error("Error deleting expense:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Expense List</h2>

        {loading ? (
          <p className="text-gray-600">Loading expenses...</p>
        ) : (
          <div>
            <ul className="list-none p-0">
              {expenses.map((expense) => (
                <li
                  key={expense._id}
                  className="bg-gray-100 rounded-md p-4 mb-4"
                >
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {expense.expenseDescription}
                  </p>
                  <p className="text-base text-gray-600 mb-2">
                    ${expense.amountSpent}
                  </p>
                  <p className="text-base text-gray-600 mb-2">
                    {expense.expenseCategory}
                  </p>
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {[
                ...Array(Math.ceil(expenses.length / expensesPerPage)).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`mr-2 px-3 py-1 rounded-md ${
                    currentPage === number + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;

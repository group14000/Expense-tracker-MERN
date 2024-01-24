import { useState } from "react";

const AddExpensesForm = () => {
  const [amountSpent, setAmountSpent] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountSpent,
          expenseDescription,
          expenseCategory,
          expenseDate,
        }),
      });

      if (response.ok) {
        console.log("Expense added successfully");

        setAmountSpent("");
        setExpenseDescription("");
        setExpenseCategory("");
        setExpenseDate("");

        alert("Expense added successfully!");
      } else {
        const errorText = await response.text();
        setError(`Error adding expense: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding expense:", error.message);
      setError(`Error adding expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white p-6 rounded-md shadow-md"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amountSpent"
        >
          Money Spent:
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          id="amountSpent"
          value={amountSpent}
          onChange={(e) => setAmountSpent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="expenseDescription"
        >
          Expense Description:
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          id="expenseDescription"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="expenseCategory"
        >
          Expense Category:
        </label>
        <select
          className="w-full p-2 border rounded-md"
          id="expenseCategory"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="expenseDate"
        >
          Expense Date:
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="date"
          id="expenseDate"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        {error && <div className="text-red-500">{error}</div>}
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AddExpensesForm;

import axios from "axios";
import useSWR, { mutate } from "swr";
import { useMemo, useState } from "react";

import InvestmentForm from "@/components/InvestorForm";
import { fetcher } from "@/pages/utils";
import { Investment } from "@/db/entities/Investment";

const HomePage = () => {
  const { data: investments, error }: { data: Investment[] } = useSWR("/api/investments", fetcher);

  const [errorMessage, setErrorMessage] = useState("");
  const [investmentId, setInvestmentId] = useState<string | null>(null);

  const handleEdit = (investment: Investment) => setInvestmentId(investment.id);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/investments/${id}`);
      await mutate("/api/investments");

      setErrorMessage("");
    } catch {
      setErrorMessage("Failed to delete investment.");
    }
  };

  const { totalAmount, totalValuation } = useMemo(
    () =>
      (investments || []).reduce(
        (acc, i) => {
          acc.totalAmount += i.amount;
          acc.totalValuation += i.valuation;

          return acc;
        },
        {
          totalAmount: 0,
          totalValuation: 0,
        },
      ),
    [investments],
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-10">
      <h1 className="text-3xl font-bold text-center mb-8">Venture Portfolio Tracker</h1>

      {error && <div className="text-red-500 font-bold">{error.message || "Failed to fetch investments"}</div>}

      {!error && (
        <>
          <InvestmentForm investmentId={investmentId} resetInvestmentId={() => setInvestmentId(null)} />

          <h2 className="text-xl font-semibold text-gray-800 mt-8">Summary</h2>
          <div>
            <div>
              <span className="font-semibold">Total Amount: </span>
              {totalAmount}
            </div>
            <div>
              <span className="font-semibold">Total Valuation: </span>
              {totalValuation}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mt-8">Investments List</h2>
          <div className="overflow-x-auto mt-4">
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Company</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Amount</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Round</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Date</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Valuation</th>
                  <th className="px-4 py-2 text-left text-gray-600 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments?.map((investment: Investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{investment.companyName}</td>
                    <td className="px-4 py-2 border-b">${investment.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{investment.roundType}</td>
                    <td className="px-4 py-2 border-b">{new Date(investment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">${investment.valuation.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(investment.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

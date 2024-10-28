import axios from "axios";
import { useFormik } from "formik";
import * as Joi from "joi";
import { FC, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import moment from "moment";

import { Investment } from "@/db/entities/Investment";
import { fetcher } from "@/pages/utils";

const schema = Joi.object({
  id: Joi.string(),
  companyName: Joi.string().min(1).required(),
  amount: Joi.number().greater(0).required(),
  roundType: Joi.string().min(1).required(),
  date: Joi.string().required(),
  valuation: Joi.number().greater(0).required(),
});

const fields = [
  {
    name: "Company Name",
    property: "companyName",
    type: "text",
  },
  {
    name: "Amount",
    property: "amount",
    type: "number",
  },
  {
    name: "Round Type",
    property: "roundType",
    type: "text",
  },
  {
    name: "Date",
    property: "date",
    type: "date",
  },
  {
    name: "Valuation",
    property: "valuation",
    type: "number",
  },
];

const defaultValues = {
  companyName: "",
  amount: 0,
  roundType: "",
  date: "",
  valuation: 0,
} as Investment;

interface IInvestmentForm {
  investmentId: string | null;
  resetInvestmentId: () => void;
}

const InvestmentForm: FC<IInvestmentForm> = ({ investmentId, resetInvestmentId }) => {
  const { data: investments } = useSWR("/api/investments", fetcher);

  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setValues, resetForm, handleSubmit, handleChange, values, errors, touched } = useFormik<Investment>({
    initialValues: defaultValues,
    validate: async (values) => {
      const { error } = schema.validate(values);
      if (error) {
        return { [error.details[0].path[0]]: error.details[0].message };
      }
    },
    onSubmit: async (values) => {
      try {
        if (investmentId) {
          await axios.put(`/api/investments/${investmentId}`, values);
        } else {
          await axios.post("/api/investments", values);
        }

        await mutate("/api/investments");

        reset();
      } catch {
        setErrorMessage("Failed to save investment.");
      }
    },
  });

  useEffect(() => {
    if (investmentId) {
      setShowForm(true);

      const investment = investments.find((i) => i.id === investmentId);

      setValues({ ...investment, date: moment(investment.date).format("YYYY-MM-DD") as Date });
    }
  }, [investmentId, investments, setValues]);

  const reset = () => {
    setShowForm(false);
    resetForm();
    setErrorMessage("");
    resetInvestmentId();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{!investmentId ? "Add" : "Edit"} Investment</h2>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div className="flex flex-col" key={field.property}>
              <label className="text-gray-700">{field.name}</label>
              <input
                type={field.type}
                name={field.property}
                onChange={handleChange}
                value={values[field.property]}
                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {touched[field.property] && errors[field.property] && (
                <p className="text-red-500 text-sm">{errors[field.property]}</p>
              )}
            </div>
          ))}

          <div className="flex space-x-2">
            <button
              onClick={reset}
              type="button"
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              {!investmentId ? "Add" : "Edit"} Investment
            </button>
          </div>

          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </form>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          type="button"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
        >
          Add Investment
        </button>
      )}
    </div>
  );
};

export default InvestmentForm;

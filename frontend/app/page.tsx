"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    sepal_length: "",
    sepal_width: "",
    petal_length: "",
    petal_width: "",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sepal_length: parseFloat(form.sepal_length),
          sepal_width: parseFloat(form.sepal_width),
          petal_length: parseFloat(form.petal_length),
          petal_width: parseFloat(form.petal_width),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-fadeIn">

      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-[380px] transform transition-all duration-500 hover:scale-[1.02]">

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🌸 Iris Predictor
        </h1>

        <div className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key.replace("_", " ")}
              value={(form as any)[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-900 placeholder-gray-500 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 p-3 rounded-xl outline-none transition"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {result && (
          <div className="mt-6 text-center animate-fadeIn">
            <p className="text-xl font-semibold text-gray-800">
              {result.prediction}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>

      {/* Simple animation style */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </main>
  );
}
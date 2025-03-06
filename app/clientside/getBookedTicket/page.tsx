'use client';
import { useState, ChangeEvent } from "react";
import Link from "next/link";
export default function GetBookedTicketPage() {
  const [bookedTicketId, setBookedTicketId] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBookedTicketId(e.target.value);
  };

  const handleSubmit = async () => {
    if (!bookedTicketId.trim()) {
      setError("Booking ID is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(`https://localhost:7035/api/v1/get-booked-ticket/${encodeURIComponent(bookedTicketId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors", // Ensures request follows cross-origin rules
      });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.detail || "API error");
      }
      const result = await res.json();
      setResponse(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-gray-300 to-gray-100 text-gray-900">
      <header className="w-full py-4 px-8 bg-white shadow-md flex justify-between items-center fixed top-0 left-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800">Acceloka</h1>
        <nav>
          <ul className="flex gap-6 text-gray-700">
            <li><Link href="/">Home</Link></li>
            <li><Link href="#">Support</Link></li>
            <li><Link href="/clientside/getAvailableTicket">Get Available Ticket</Link></li>
            <li><Link href="/clientside/bookTicket">Book Ticket</Link></li>
            <li><Link href="#">Get Booked Ticket</Link></li>
            <li><Link href="/clientside/revokeTicket">Revoke Ticket</Link></li>
            <li><Link href="/clientside/editBookedTicket">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="max-w-xl mx-auto p-4 border rounded shadow-md mt-32 bg-white">
        <h2 className="text-lg font-bold mb-4">Get Booked Ticket</h2>
        <input
          className="w-full p-2 border rounded mb-2 bg-white"
          type="text"
          placeholder="Booking ID"
          value={bookedTicketId}
          onChange={handleInputChange}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded mt-4"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {response && <pre className="mt-2 p-2 border rounded bg-gray-100 overflow-auto">{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}

'use client'
import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function RevokeTicket() {
  const [bookedTicketId, setBookedTicketId] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!bookedTicketId || !ticketCode || quantity <= 0) {
      setError("All fields are required and quantity must be greater than zero.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:7035/api/v1/revoke-ticket/${bookedTicketId}/${ticketCode}/${quantity}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      console.log("Raw API Response:", res);

      const text = await res.text();
      const result = text ? JSON.parse(text) : {};
      
      console.log("API Response Data:", result);

      if (!res.ok) {
        throw new Error(result.detail || `API error: ${res.status}`);
      }

      setResponse(result);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
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
            <li><Link href="/clientside/getBookedTicket">Get Booked Ticket</Link></li>
            <li><Link href="#">Revoke Ticket</Link></li>
            <li><Link href="/clientside/editBookedTicket">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="max-w-xl mx-auto p-4 border rounded shadow-md mt-32 bg-white">
        <h2 className="text-lg font-bold mb-4">Revoke Ticket</h2>
        <input className="w-full p-2 border rounded mb-2 bg-white" type="text" placeholder="Booking ID" value={bookedTicketId} onChange={(e) => setBookedTicketId(e.target.value)} />
        <input className="w-full p-2 border rounded mb-2 bg-white" type="text" placeholder="Ticket Code" value={ticketCode} onChange={(e) => setTicketCode(e.target.value)} />
        <input className="w-full p-2 border rounded mb-2 bg-white" type="number" placeholder="Quantity to Revoke" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
        <button className="w-full p-2 bg-red-500 text-white rounded mt-4" onClick={handleSubmit} disabled={isLoading}>Submit</button>
        {isLoading && <p className="text-gray-500 mt-2">Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {response && <pre className="mt-2 p-2 border rounded bg-gray-100 overflow-auto">{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}

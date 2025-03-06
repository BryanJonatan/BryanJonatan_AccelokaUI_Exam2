'use client'
import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function BookTicketPage() {
  const [bookingRequests, setBookingRequests] = useState([
    { ticketCode: "", quantity: 1 }
  ]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedRequests = [...bookingRequests];
  
    updatedRequests[index] = {
      ...updatedRequests[index],
      [name]: name === "quantity" ? (value ? parseInt(value) : 1) : value,
    };
  
    setBookingRequests(updatedRequests);
  };

  const addRequestField = () => {
    setBookingRequests([...bookingRequests, { ticketCode: "", quantity: 1 }]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
  
    try {
      const res = await fetch("https://localhost:7035/api/v1/book-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRequests }),
      });
  
      const result = await res.json();
      console.log("Parsed Response:", result);
  
      if (!res.ok || !result.bookings || result.bookings.length === 0) {
        throw new Error("No bookings returned. Check API logic.");
      }
  
      setResponse(result);
    } catch (err: any) {
      console.error("Fetch Error:", err);
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
            <li><Link href="#">Book Ticket</Link></li>
            <li><Link href="/clientside/getBookedTicket">Get Booked Ticket</Link></li>
            <li><Link href="/clientside/revokeTicket">Revoke Ticket</Link></li>
            <li><Link href="/clientside/editBookedTicket">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="max-w-xl mx-auto p-4 border rounded shadow-md mt-32 bg-white">
        <h2 className="text-lg font-bold mb-4">Book Ticket</h2>
        {bookingRequests.map((request, index) => (
          <div key={index} className="mb-4">
            <input
              className="w-full p-2 border rounded mb-2 bg-white"
              type="text"
              name="ticketCode"
              placeholder="Ticket Code"
              value={request.ticketCode}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              className="w-full p-2 border rounded mb-2 bg-white"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={request.quantity}
              onChange={(e) => handleInputChange(index, e)}
              min={1}
            />
          </div>
        ))}
        <button className="w-full p-2 bg-gray-500 text-white rounded mb-2" onClick={addRequestField}>Add More</button>
        <button className="w-full p-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Submit</button>
        {isLoading && <p className="text-gray-500 mt-2">Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {response && <pre className="mt-2 p-2 border rounded bg-gray-100 overflow-auto">{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}
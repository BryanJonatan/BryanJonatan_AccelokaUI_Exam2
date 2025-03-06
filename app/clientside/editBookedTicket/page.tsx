'use client'
import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function EditBookedTicketPage() {
  const [formData, setFormData] = useState({
    bookedTicketId: "",
    updates: [{ ticketCode: "", quantity: 1 }],
  });
  
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updates = [...prev.updates];
      updates[index] = { ...updates[index], [field]: value };
      return { ...prev, updates };
    });
  };

  const addUpdateField = () => {
    setFormData((prev) => ({ ...prev, updates: [...prev.updates, { ticketCode: "", quantity: 1 }] }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
  
    if (!formData.bookedTicketId) {
      setError("Booked Ticket ID is required.");
      setIsLoading(false);
      return;
    }
  
    if (formData.updates.length === 0) {
      setError("At least one update is required.");
      setIsLoading(false);
      return;
    }
  
    const payload = formData.updates;
  
    console.log(" Sending Payload:", JSON.stringify(payload, null, 2));
  
    try {
      const res = await fetch(
        `https://localhost:7035/api/v1/edit-booked-ticket/${formData.bookedTicketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), 
        }
      );
  
      console.log(" Raw API Response:", res);
  
      const result = await res.json();
  
      console.log(" API Response Data:", result);
  
      if (!res.ok) {
        throw new Error(result.detail || `API error: ${res.status}`);
      }
  
      setResponse(result);
    } catch (err: any) {
      console.error(" Fetch Error:", err.message);
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
            <li><Link href="/clientside/revokeTicket">Revoke Ticket</Link></li>
            <li><Link href="#">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="max-w-xl mx-auto p-4 border rounded shadow-md mt-20 bg-white">
        <h2 className="text-lg font-bold mb-4">Edit Booked Ticket</h2>
        <input className="w-full p-2 border rounded mb-2 bg-white" type="text" name="bookedTicketId" placeholder="Booking ID" onChange={handleInputChange} />
        <div>
          {formData.updates.map((update, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input className="w-full p-2 border rounded bg-white" type="text" placeholder="Ticket Code" value={update.ticketCode} onChange={(e) => handleUpdateChange(index, "ticketCode", e.target.value)} />
              <input className="w-full p-2 border rounded bg-white" type="number" placeholder="New Quantity" value={update.quantity} onChange={(e) => handleUpdateChange(index, "quantity", Number(e.target.value))} />
            </div>
          ))}
          <button className="w-full p-2 bg-gray-500 text-white rounded mt-2" onClick={addUpdateField}>Add More</button>
        </div>
        <button className="w-full p-2 bg-blue-500 text-white rounded mt-4" onClick={handleSubmit}>Submit</button>
        {isLoading && <p className="text-gray-500 mt-2">Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {response && <pre className="mt-2 p-2 border rounded bg-gray-100 overflow-auto">{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}
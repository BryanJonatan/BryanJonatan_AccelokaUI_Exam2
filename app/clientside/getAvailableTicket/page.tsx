'use client'
import { useState, ChangeEvent } from "react";
import Link from "next/link";

interface Ticket {
  categoryName: string;
  ticketCode: string;
  ticketName: string;
  eventDateRange?: { minimum: string; maximum: string };
  price: number;
  availableQuota: number;
}

export default function TicketFetcher() {
  const [data, setData] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categoryName: "",
    ticketCode: "",
    ticketName: "",
    price: "",
    eventDateMin: "",
    eventDateMax: "",
    orderBy: "",
    order: ""
  });
  const [manualInput, setManualInput] = useState<{ eventDateMin: boolean; eventDateMax: boolean }>({
    eventDateMin: false,
    eventDateMax: false,
  });

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchFilteredData = async () => {
    setIsLoading(true);
    setError(null);
    setData([]);

    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    console.log("Fetching: ", `https://localhost:7035/api/v1/get-available-ticket${queryString}`);

    try {
      const res = await fetch(`https://localhost:7035/api/v1/get-available-ticket${queryString}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      setError("Failed to fetch data");
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
            <li><Link href="#">Get Available Ticket</Link></li>
            <li><Link href="/clientside/bookTicket">Book Ticket</Link></li>
            <li><Link href="/clientside/getBookedTicket">Get Booked Ticket</Link></li>
            <li><Link href="/clientside/revokeTicket">Revoke Ticket</Link></li>
            <li><Link href="/clientside/editBookedTicket">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>
      
      <div className="max-w-xl mx-auto p-4 border rounded shadow-md mt-32 bg-white">
        <h2 className="text-lg font-bold mb-4">Search Available Tickets</h2>
        <input className="w-full p-2 border rounded mb-2" type="text" name="categoryName" placeholder="Category Name" onChange={handleFilterChange} />
        <input className="w-full p-2 border rounded mb-2" type="text" name="ticketCode" placeholder="Ticket Code" onChange={handleFilterChange} />
        <input className="w-full p-2 border rounded mb-2" type="text" name="ticketName" placeholder="Ticket Name" onChange={handleFilterChange} />
        <input className="w-full p-2 border rounded mb-2" type="number" name="price" placeholder="Max Price" onChange={handleFilterChange} />
        
        <div className="flex gap-2">
          <input className="w-full p-2 border rounded mb-2" type={manualInput.eventDateMin ? "text" : "date"} name="eventDateMin" placeholder="Event Date Min" onChange={handleFilterChange} />
          <button className="p-2 bg-gray-500 text-white rounded" onClick={() => setManualInput(prev => ({ ...prev, eventDateMin: !prev.eventDateMin }))}>Switch</button>
        </div>
        
        <div className="flex gap-2">
          <input className="w-full p-2 border rounded mb-2" type={manualInput.eventDateMax ? "text" : "date"} name="eventDateMax" placeholder="Event Date Max" onChange={handleFilterChange} />
          <button className="p-2 bg-gray-500 text-white rounded" onClick={() => setManualInput(prev => ({ ...prev, eventDateMax: !prev.eventDateMax }))}>Switch</button>
        </div>
        
        <input className="w-full p-2 border rounded mb-2" type="text" name="orderBy" placeholder="Order By (e.g., price, ticketName)" onChange={handleFilterChange} />
        <input className="w-full p-2 border rounded mb-2" type="text" name="order" placeholder="Order (asc/desc)" onChange={handleFilterChange} />
        
        <button className="w-full p-2 bg-blue-500 text-white rounded" onClick={fetchFilteredData}>Search</button>
      </div>
      
      {isLoading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mt-4 w-full">
        {data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((ticket, index) => (
              <li key={index} className="border p-2 rounded shadow-md">
                <p><strong>Category:</strong> {ticket.categoryName}</p>
                <p><strong>Ticket Code:</strong> {ticket.ticketCode}</p>
                <p><strong>Ticket Name:</strong> {ticket.ticketName}</p>
                <p><strong>Event Date:</strong> {ticket.eventDateRange?.minimum} - {ticket.eventDateRange?.maximum}</p>
                <p><strong>Price:</strong> ${ticket.price}</p>
                <p><strong>Quota:</strong> {ticket.availableQuota}</p>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="text-center text-gray-600">No tickets found.</p>
        )}
      </div>
    </div>
  );
}
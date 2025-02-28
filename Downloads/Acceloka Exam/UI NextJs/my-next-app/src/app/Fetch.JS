import { useEffect, useState } from "react";
import axios from "axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/get-available-ticket").then((response) => {
      setTickets(response.data.Data);
    });
  }, []);

  return (
    <div>
      <h1>Available Tickets</h1>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.TicketCode}>{ticket.TicketName}</li>
        ))}
      </ul>
    </div>
  );
}

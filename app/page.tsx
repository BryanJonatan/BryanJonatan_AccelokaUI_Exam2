'use client'
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

const sliderImages = [
  "/Background/plane.jpg",
  "/Background/cruiser.jpg",
  "/Background/cinema.jpg",
  "/Background/Bus.jpeg"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  } );

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-gray-300 to-gray-100 text-gray-900">
      <header className="w-full py-4 px-8 bg-white shadow-md flex justify-between items-center fixed top-0 left-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800">Acceloka</h1>
        <nav>
          <ul className="flex gap-6 text-gray-700">
            <li><Link href="#">Home</Link></li>
            <li><Link href="#">Support</Link></li>
            <li><Link href="/clientside/getAvailableTicket">Get Available Ticket</Link></li>
            <li><Link href="/clientside/bookTicket">Book Ticket</Link></li>
            <li><Link href="/clientside/getBookedTicket">Get Booked Ticket</Link></li>
            <li><Link href="/clientside/revokeTicket">Revoke Ticket</Link></li>
            <li><Link href="/clientside/editBookedTicket">Edit Booked Ticket</Link></li>
          </ul>
        </nav>
      </header>

      <div className="w-full max-w-6xl mt-20 h-[50vh] flex items-center justify-center overflow-hidden rounded-lg shadow-lg relative">
        <Image 
          src={sliderImages[currentImage]} 
          alt="Slider Image" 
          layout="fill" 
          objectFit="cover" 
          className="rounded-lg transition-opacity duration-1000"
        />
      </div>

      <main className="w-full max-w-6xl px-8 py-12 bg-white shadow-lg rounded-lg mt-8 text-gray-900">
        <Section title="Get Available Ticket">
          <div className="flex justify-center">
            <APIcard 
              APItitle="Get Available Ticket" 
              APIdescription="Check your ticket that you need" 
              href="/clientside/getAvailableTicket" 
            />
          </div>
        </Section>

        <Section title="Book Ticket">
          <div className="flex justify-center">
            <APIcard 
              APItitle="Book Ticket" 
              APIdescription="Book your ticket and enjoy the fun!" 
              href="/clientside/bookTicket" 
            />
          </div>
        </Section>

        <Section title="Get Booked Ticket">
          <div className="flex justify-center">
            <APIcard 
              APItitle="Get Booked Ticket" 
              APIdescription="View all your booked tickets here" 
              href="/clientside/getBookedTicket" 
            />
          </div>
        </Section>

        <Section title="Revoke Ticket">
          <div className="flex justify-center">
            <APIcard 
              APItitle="Revoke Ticket" 
              APIdescription="Revoke your unwanted ticket here!" 
              href="/clientside/revokeTicket" 
            />
          </div>
        </Section>

        <Section title="Edit Booked Ticket">
          <div className="flex justify-center">
            <APIcard 
              APItitle="Edit Booked Ticket" 
              APIdescription="Add more to your ticket quantity after purchase. The more, the merrier!" 
              href="/clientside/editBookedTicket" 
            />
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="grid gap-6 md:grid-cols-1 place-items-center">{children}</div>
    </section>
  );
}

function APIcard({ APItitle, APIdescription, href }: { APItitle: string; APIdescription: string; href: string }) {
  return (
    <Link 
      href={href} 
      className="block p-6 border rounded-lg hover:border-gray-600 transition-colors bg-gray-200 shadow-md w-full max-w-sm text-center"
    >
      <h3 className="text-lg font-semibold text-gray-900">{APItitle}</h3>
      <p className="text-gray-700">{APIdescription}</p>
    </Link>
  );
}

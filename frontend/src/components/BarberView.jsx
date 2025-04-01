import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io('http://localhost:4000');

function BarberView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };
    
    fetchAppointments();

    socket.on('new-appointment', () => {
        console.log('📡 New appointment received!');
        fetchAppointments();
    });

    return () => socket.off('new-appointment');
    
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📋 Today's Appointments</h1>
      <ul>
        {appointments.map((appt) => {
          const dt = new Date(appt.datetime);
          return (
            <li key={appt._id} style={{ marginBottom: "0.5rem" }}>
              <strong>{dt.toLocaleDateString()}</strong> at{" "}
              <strong>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              {appt.clientName && ` — ${appt.clientName}`}
              {appt.phone && ` (${appt.phone})`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BarberView;

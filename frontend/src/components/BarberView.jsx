import { useState, useEffect } from "react";

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
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
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

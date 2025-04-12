import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

function BarberView() {
  const [appointments, setAppointments] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      }
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

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

    socket.on("new-appointment", () => {
      console.log("📡 New appointment received!");
      fetchAppointments();
    });

    return () => socket.off("new-appointment");
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📋 Today's Appointments</h1>
      <ul>
        {appointments.map((appt) => {
          const dt = new Date(appt.datetime);
          return (
            <li
              key={appt._id}
              style={{
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
                position: "relative",
                paddingRight: "2rem",
              }}
              onMouseEnter={() => setHoveredId(appt._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <strong>{dt.toLocaleDateString()}</strong> at{" "}
              <strong>
                {dt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              {appt.clientName && ` — ${appt.clientName}`}
              {appt.phone && ` (${appt.phone})`}
              {hoveredId === appt._id && (
                <button
                  onClick={() => handleDelete(appt._id)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  🗑
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BarberView;

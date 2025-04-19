import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

function BarberView() {
  const [appointments, setAppointments] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = async (id) => {
    const confirmationDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmationDelete) return;

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

  const onComplete = async (id) => {
    const confirmCompletion = window.confirm('Mark this appointment as completed?');
    if(!confirmCompletion) return;

    try {
      console.log('in process')
    } catch (error) {
      console.error('in the catch', error);
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


  const filteredAppointments = appointments.filter((appt) => {
    if (!filterDate) return true;
    const apptDate = new Date(appt.datetime).toISOString().split("T")[0];
    return apptDate === filterDate;
  });
  
  return (
    <div style={{
      background: "#111",
      color: "#fff",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
    }}>
      <h1>📋 Today's Appointments</h1>
      {appointments.length === 0 && (
      <p style={{ color: "#999", textAlign: "center", marginTop: "1rem" }}>
        No appointments booked yet.
      </p>
      )}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        Filter by date:{" "}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ padding: "0.4rem", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </label>
      
      {filteredAppointments.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", marginTop: "1rem" }}>
        No appointments for this day.
      </p>
      )}

      <ul>
        {filteredAppointments
        .map((appt) => {
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
              onClick={() => setSelectedId(appt._id === selectedId ? null : appt._id)}
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
              {selectedId === appt._id && (
                <>
                <button
                  onClick={() => handleDelete(appt._id)}
                  style={{
                    position: "absolute",
                    right: "50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                > 🗑 </button>

                <button onClick={() => onComplete(appt._id)} style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}>✅</button>

                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BarberView;

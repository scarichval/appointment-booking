import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const BASE_URL = "http://192.168.2.182:4000";

const socket = io(`${BASE_URL}`);


function BarberView() {
  const [appointments, setAppointments] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = async (id) => {
    const confirmationDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmationDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
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
    const confirmCompletion = window.confirm(
      "Mark this appointment as completed?"
    );
    if (!confirmCompletion) return;

    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: true }),
      });

      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === id ? updated : appt))
        );
      }
    } catch (error) {
      console.error("Error completing appointment", error);
    }


  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/appointments`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  useEffect(() => {
    
    fetchAppointments();

    socket.on("new-appointment", () => {
      console.log("📡 New appointment received!");
      fetchAppointments();
    });

    socket.on("appointment-deleted", () => {
      console.log("🗑 Appointment deleted!");
      fetchAppointments();
    });

    socket.on("appointment-completed", () => {
      console.log("Appointment completed!");
      fetchAppointments();
    })

    return () => {
      socket.off("new-appointment");
      socket.off("appointment-deleted");
      socket.off("appointment-completed");
    }
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    if (!filterDate) return true;
    const apptDate = new Date(appt.datetime).toISOString().split("T")[0];
    return apptDate === filterDate;
  });

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",       // ✅ largeur max lisible
        margin: "0 auto",         // ✅ centrage horizontal
        overflowX: "hidden",      // ✅ empêche débordement
        minHeight: "100vh",       // 📱 assure hauteur complète
      }}
    >
      <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "1.5rem" }}>
        📋 Today's Appointments
      </h1>
  
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
          style={{
            padding: "0.4rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            fontSize: "16px",
          }}
        />
      </label>
  
      {filteredAppointments.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", marginTop: "1rem", fontSize: "16px" }}>
          No appointments for this day.
        </p>
      )}
  
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredAppointments.map((appt) => {
          const dt = new Date(appt.datetime);
          return (
            <li
              key={appt._id}
              style={{
                marginBottom: "1rem",
                fontSize: "1.1rem",
                position: "relative",
                padding: "1rem",
                paddingRight: "5.5rem", // espace pour les boutons
                background: "#222",
                borderRadius: "8px",
                overflow: "hidden",     // 🚫 évite dépassement
                opacity: appt.isCompleted ? 0.5 : 1,
              }}
              onClick={() =>
                setSelectedId(appt._id === selectedId ? null : appt._id)
              }
            >
              <div>
                <strong>{dt.toLocaleDateString()}</strong> at{" "}
                <strong>
                  {dt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
                {appt.clientName && ` — ${appt.clientName}`}
                {appt.phone && ` (${appt.phone})`}
                {appt.isCompleted && (
                  <em style={{ marginLeft: "0.5rem", color: "#ccc" }}>
                    (Completed)
                  </em>
                )}
              </div>
  
              {selectedId === appt._id && (
                <>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    style={{
                      position: "absolute",
                      right: "2.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "20px",
                      top: "calc(50% - 10px)"
                    }}
                  >
                    🗑
                  </button>
  
                  {!appt.isCompleted && (
                    <button
                      onClick={() => onComplete(appt._id)}
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "green",
                        cursor: "pointer",
                        fontSize: "20px",
                        top: "calc(50% - 10px)"
                      }}
                    >
                      ✅
                    </button>
                  )}
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

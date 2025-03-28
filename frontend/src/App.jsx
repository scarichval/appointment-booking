import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const generateTimeSlots = () => {
  const slots = [];
  let start = 9 * 60; // 9:00 AM
  let end = 18 * 60; // 6:00 PM

  while (start < end) {
    const h = String(Math.floor(start / 60)).padStart(2, "0");
    const m = String(start % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    start += 30;
  }

  return slots;
};

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

function App() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datetime = new Date(`${date}T${time}`);
    const newAppt = {
      datetime,
      clientName,
      phone,
    };

    try {
      const response = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppt),
      });

      if (response.status === 409) {
        setErrorMessage(
          "This time slot is already taken. Please choose another."
        );
        return;
      }

      const savedAppt = await response.json();
      setAppointments((prev) => [...prev, savedAppt]);

      setDate("");
      setClientName("");
      setPhone("");
    } catch (error) {
      console.error("Error creating appointment", error);
    }
  };

  // USEEFFECT !
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const selectedDate = new Date(date + "T00:00"); // force timezone offset
  const bookedTimes = appointments
    .filter((appt) => isSameDay(new Date(appt.datetime), selectedDate))
    .map((appt) => new Date(appt.datetime).toTimeString().slice(0, 5));

  console.log("Selected date as Date obj:", selectedDate.toString());
  console.log("BookedTimes: ", bookedTimes);

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      <h1
        style={{ fontSize: "3rem", textAlign: "center", marginBottom: "2rem" }}
      >
        Appointments
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select a time slot</option>
          {generateTimeSlots().map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={bookedTimes.includes(slot)}
            >
              {slot} {bookedTimes.includes(slot) ? "Booked" : "Available"}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Client name"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#fff",
            color: "#111",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add appointment
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
        {appointments.map((appt, index) => {
          const dt = new Date(appt.datetime);
          return (
            <li
              key={appt._id || index}
              style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}
            >
              {appt.clientName ? <strong>{appt.clientName}</strong> : null} -{" "}
              {dt.toLocaleDateString()} at{" "}
              {dt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

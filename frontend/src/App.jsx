import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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


      if(response.status === 409){
        setErrorMessage('This time slot is already taken. Please choose another.');
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

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >

      {errorMessage && (<p style={{ color:'red', textAlign: 'center'}}>{errorMessage}</p>)}
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
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
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
              {appt.clientName ? <strong>{appt.clientName}</strong> : null} - {dt.toLocaleDateString()} at {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!email || !consent) {
      alert("Please enter email and accept consent");
      return;
    }

    await axios.post(
      `http://localhost:5000/api/events/${selectedEvent._id}/lead`,
      { email, consent }
    );

    window.location.href = selectedEvent.originalUrl;
  };


  

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", background: "#f7f7f7" }}>
      <h1>Sydney Events</h1>

      <button
  onClick={() => (window.location.href = "/dashboard")}
  style={{
    marginBottom: "20px",
    padding: "8px 12px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Go to Dashboard
</button>
      <GoogleLogin
  onSuccess={async (credentialResponse) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/google",
      { token: credentialResponse.credential }
    );

    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  }}
  onError={() => {
    console.log("Login Failed");
  }}
/>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {events.map((event) => (
          <div
            key={event._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{event.title}</h3>
            <p>Status: {event.status}</p>

            <button
              onClick={() => setSelectedEvent(event)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              GET TICKETS
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "30px", borderRadius: "10px" }}>
            <h3>Enter Email to Continue</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />

            <div>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label style={{ marginLeft: "5px" }}>
                I agree to receive updates
              </label>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
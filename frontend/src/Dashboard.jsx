import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchEvents = () => {
    axios
      .get("https://sydney-events-platform-tldk.onrender.com/api/events")
      .then((res) => setEvents(res.data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImport = async (id) => {
    await axios.patch(
      `https://sydney-events-platform-tldk.onrender.com/api/events/${id}/import`,
      {
        importedBy: "Admin",
        importNotes: "Imported via dashboard",
      }
    );

    fetchEvents();
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "#2ecc71";
      case "updated":
        return "#f39c12";
      case "inactive":
        return "#e74c3c";
      case "imported":
        return "#3498db";
      default:
        return "#999";
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="updated">Updated</option>
          <option value="inactive">Inactive</option>
          <option value="imported">Imported</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f2f6" }}>
            <tr>
              <th style={{ padding: "15px", textAlign: "left" }}>Title</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "15px", textAlign: "left" }}>City</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "15px" }}>{event.title}</td>

                <td style={{ padding: "15px" }}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      background: getStatusColor(event.status),
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {event.status}
                  </span>
                </td>

                <td style={{ padding: "15px" }}>{event.city}</td>

                <td style={{ padding: "15px" }}>
                  {event.status !== "imported" && (
                    <button
                      onClick={() => handleImport(event._id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#2d3436",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Import
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
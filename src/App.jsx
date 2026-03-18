import { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const now = new Date().toISOString();

    fetch(
      `https://app.zetkin.org/api/orgs/1276/actions?filter=start_time>=${now}`
    )
      .then((res) => res.json())
      .then((data) => {
        // sortieren nach Datum
        const sorted = data.data.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );

        setEvents(sorted);
      });
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Events</h1>

      {events.map((event) => {
        const start = new Date(event.start_time);

        const date = start.toLocaleDateString("de-AT", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

        const time = start.toLocaleTimeString("de-AT", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            {/* Bild */}
            {event.cover_file?.url && (
              <img
                src={event.cover_file.url}
                alt=""
                style={{ width: "100%", borderRadius: "6px" }}
              />
            )}

            <h2>{event.title}</h2>

            <p>
              <strong>
                {date} – {time}
              </strong>
            </p>

            <p>{event.location?.title || "Online"}</p>

            {event.info_text && (
              <p style={{ opacity: 0.8 }}>
                {event.info_text.slice(0, 120)}...
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;

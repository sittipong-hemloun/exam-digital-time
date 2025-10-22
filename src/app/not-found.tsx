export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>404</h1>
      <p>Page Not Found</p>
    </div>
  );
}

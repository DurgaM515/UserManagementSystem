import { useState } from "react";

export default function ExportDropdown() {
  const [showExport, setShowExport] = useState(false);

  const handleExport = async (type: string) => {
    setShowExport(false);

    try {
      const res = await fetch(`http://127.0.0.1:8000/export/${type}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setShowExport(true)}
      onMouseLeave={() => setShowExport(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        className="btn-style"
        onClick={() => setShowExport(!showExport)}
      >
        Export ▾
      </button>

      {showExport && (
        <div className={`dropdown-menu ${showExport ? "show" : ""}`}>
            <div onClick={() => handleExport("csv")}>CSV</div>
            <div onClick={() => handleExport("json")}>JSON</div>
            <div onClick={() => handleExport("xml")}>XML</div>
            <div onClick={() => handleExport("txt")}>TXT</div>
            <div onClick={() => handleExport("sql")}>SQL</div>
        </div>
      )}
    </div>
  );
}
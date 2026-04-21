import { useState } from "react";
import type { ColumnKey } from "../types/userColumns";
import { columnConfig } from "../types/userColumns";

type Props = {
  selectedColumns: ColumnKey[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<ColumnKey[]>>;
};

export default function ColumnsDropdown( {selectedColumns, setSelectedColumns}: Props ) {
  const [showColumns, setShowColumns] = useState(false);
  const handleToggle = (key: ColumnKey) => {
    setSelectedColumns((prev) =>
      prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key]
    );
  };


  return (
    <div
      className="dropdown"
      onMouseEnter={() => setShowColumns(true)}
      onMouseLeave={() => setShowColumns(false)}
    >
    <button
        className="btn-style"
        onClick={() => setShowColumns(!showColumns)}
    >
    Columns ▾
    </button>
    {showColumns && (
    <div className="dropdown-menu show">
      {columnConfig.map((col) => (
        <label key={col.key} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedColumns.includes(col.key)}
            onChange={() => handleToggle(col.key)}
          />
          {col.label}
        </label>
      ))}
    </div>
  )}
    </div>
  );
}

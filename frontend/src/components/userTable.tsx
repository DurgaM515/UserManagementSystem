import {  useEffect, useState } from "react";
import { deleteUser } from "../api";
import { User } from "../types";
import { FaEye, FaEdit, FaTrash  } from "react-icons/fa";
import AddUserModal from "./AddUserModal";
import useUsers from "../hooks/useUsers";
import { columnConfig } from "../types/userColumns";
import type { ColumnKey } from "../types/userColumns";
import deleteIcon from "../assets/delete1.png";
import editIcon from "../assets/edit.png";
import viewIcon from "../assets/view.png";
import dpic from "../assets/dp.jpg";


type Props = {
  refresh: boolean;
  columns: ColumnKey[];
  searchTerm: string;
  onNotify?: (message: string) => void;
};

export default function UserTable({ refresh, columns, searchTerm, onNotify }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const { filteredUsers, loadUsers } = useUsers({ refresh, searchTerm });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, rowsPerPage]);


  const visibleColumns = columnConfig.filter((col) =>
    columns.includes(col.key)
  );
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast)

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  
    if (!confirmDelete) return;
    await deleteUser(id);
    loadUsers(); // refresh table after delete
    onNotify?.("User deleted successfully");
  };

  const TrashIcon = FaTrash as unknown as React.FC;
  const EyeIcon = FaEye as unknown as React.FC;
  const EditIcon = FaEdit as unknown as React.FC;

  return (
    <><table className="styled-table">
      <thead>
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {currentUsers.length > 0 ? (
        currentUsers.map((u) => (
          <tr key={u.id}>
            {visibleColumns.map((col) => (
              <td key={col.key}>
        {col.key === "username" ? (
       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={u.profile_image ? `http://127.0.0.1:8000/${u.profile_image}` : dpic}
          alt={u.username}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span>{u.username}</span>
      </div>) :col.key === "is_active" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className={`status ${u.is_active ? "active" : "inactive"}`}>
              <span className="checkbox-icon">
                {u.is_active ?  "✓" : "✕"}
              </span>
              {u.is_active ? " Active" : " Inactive"}
              </span>
          </div>
          ) : (
          (u as any)[col.key]
        )}
      </td>
    ))}

      <td>
        <div style={{ display: "flex", gap: "8px" }}>
              <img src={editIcon} 
          className="edit-icon" 
          onClick={() => {
          setSelectedUser(u);
          setShowEdit(true);
        }}
        />
    
      <img src={viewIcon} 
          className="action-icon" 
          onClick={() => {
          setSelectedUser(u);
          setShowView(true)
          }} />
          <img
        src={deleteIcon}
        alt="delete"
        className="action-icon"
        onClick={() => handleDelete(u.id)}
      />

      </div>
      </td>
    </tr>
      ))
      ) : (
    <tr>
      <td colSpan={visibleColumns.length + 1} style={{ textAlign: "center" }}>
        No users found
      </td>
    </tr>
  )}
      </tbody>
    </table>

  {/* LEFT: Info text */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    flexWrap: "wrap",
    gap: "14px",
  }}
>
  <div
    style={{
      fontSize: "14px",
      color: "#4b5563",
      fontWeight: 500,
    }}
  >
    Showing {filteredUsers.length === 0 ? 0 : indexOfFirst + 1} to{" "}
    {Math.min(indexOfLast, filteredUsers.length)} of {filteredUsers.length} entries
  </div>

  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
    <button
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
      style={{
        borderRadius: "8px",
        border: "1px solid #dbe3f0",
        background: currentPage === 1 ? "#f3f4f6" : "white",
        color: currentPage === 1 ? "#9ca3af" : "#2563eb",
        fontWeight: 600,
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
      }}
    >
      &lt;&lt; First
    </button>

    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      style={{
        borderRadius: "8px",
        border: "1px solid #dbe3f0",
        background: currentPage === 1 ? "#f3f4f6" : "white",
        color: currentPage === 1 ? "#9ca3af" : "#2563eb",
        fontWeight: 600,
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
      }}
    >
      &lt; Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        style={{
          minWidth: "24px",
          height: "24px",
          borderRadius: "10px",
          border: currentPage === i + 1 ? "none" : "1px solid #dbe3f0",
          background: currentPage === i + 1 ? "#2563eb" : "white",
          color: currentPage === i + 1 ? "white" : "#2563eb",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: currentPage === i + 1 ? "0 4px 10px rgba(37, 99, 235, 0.25)" : "none",
        }}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages || totalPages === 0}
      style={{
        borderRadius: "8px",
        border: "1px solid #dbe3f0",
        background: currentPage === totalPages || totalPages === 0 ? "#f3f4f6" : "white",
        color: currentPage === totalPages || totalPages === 0 ? "#9ca3af" : "#2563eb",
        fontWeight: 600,
        cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
      }}
    >
      Next &gt;&gt;
    </button>
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      fontWeight: 600,
      color: "#374151",
    }}
  >
    <span style={{ letterSpacing: "0.2px" }}>Rows per page:</span>
    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        outline: "none",
        fontSize: "14px",
        fontWeight: 600,
        color: "#1f2937",
        background: "white",
        cursor: "pointer",
      }}
    >
      <option value={4}>4</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
    </select>
  </div>
</div>
{showEdit && selectedUser && (
  <AddUserModal
    user={selectedUser}
    onClose={() => setShowEdit(false)}
    onSave={() => {
      loadUsers();
      onNotify?.("User updated successfully");
    }}
  />
)}
{showView && selectedUser && (
  <>
    <div className="overlay" onClick={() => setShowView(false)}></div>

    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered  modal-sm">
        <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">User Details</h5>
        <button type="button"className="btn-close btn-close-white" onClick={() => setShowView(false)}></button>
      </div>

      <div className="modal-body">
        <p><b>ID:</b> {selectedUser.id}</p>
        <p><b>Username:</b> {selectedUser.username}</p>
        <p><b>Full Name:</b> {selectedUser.full_name}</p>
        <p><b>Role:</b> {selectedUser.role}</p>
        <p><b>Status:</b> <span className={selectedUser.is_active ? "text-success" : "text-danger"}>
          {selectedUser.is_active ? "Active" : "Inactive"}</span></p>
      </div>
    </div>
    </div>
    </div>
  </>
)}
</>
);
}

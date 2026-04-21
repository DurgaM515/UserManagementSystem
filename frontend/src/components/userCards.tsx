import { useState } from "react";
import { deleteUser } from "../api";
import { User } from "../types";
import AddUserModal from "./AddUserModal";
import useUsers from "../hooks/useUsers";
import type { ColumnKey } from "../types/userColumns";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete1.png";

type Props = {
  refresh: boolean;
  columns: ColumnKey[];
  searchTerm: string;
  onNotify?: (message: string) => void;
};

export default function UserCards({refresh,columns,searchTerm,onNotify,}: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const { filteredUsers, loadUsers } = useUsers({ refresh, searchTerm });

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    await deleteUser(id);
    loadUsers();
    onNotify?.("User deleted successfully");
  };

  const groupedUsers = {
    Admin: filteredUsers.filter((u) => u.role === "Admin"),
    Editor: filteredUsers.filter((u) => u.role === "Editor"),
    User: filteredUsers.filter((u) => u.role === "User"),
  };

  return (
    <>
      <div className="row g-4">
        {Object.entries(groupedUsers).map(([role, roleUsers]) => (
          <div className="col-lg-4 col-md-6" key={role}>
            <div className="role-panel h-100">
              <div className="role-panel-header">
                <h5 className="role-title mb-0">{role}</h5>
                <span className="role-count">{roleUsers.length}</span>
              </div>

              <div className="d-flex flex-column gap-3 mt-3">
                {roleUsers.length > 0 ? (
                  roleUsers.map((user) => (
                    <div key={user.id} className="user-card-modern">

                  <div className="user-form-grid mt-3">

                    {columns.includes("id") && (
                      <div className="form-row">
                        <span className="label">ID</span>
                        <span className="value">{user.id}</span>
                      </div>
                    )}

                    {columns.includes("username") && (
                      <div className="form-row">
                        <span className="label">Username</span>
                        <span className="value">@{user.username}</span>
                      </div>
                    )}

                    {columns.includes("full_name") && (
                      <div className="form-row">
                        <span className="label">Full Name</span>
                        <span className="value">{user.full_name}</span>
                      </div>
                    )}

                    {columns.includes("role") && (
                      <div className="form-row">
                        <span className="label">Role</span>
                        <span className="value">{user.role}</span>
                      </div>
                    )}

                    {columns.includes("is_active") && (
                      <div className="form-row">
                        <span className="label">Status</span>
                        <span
                          className={`status-pill ${
                            user.is_active ? "status-active" : "status-inactive"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    )}

                  </div>

                      <div className="user-card-actions mt-3">
                        <img
                          src={editIcon}
                          alt="edit"
                          className="edit-icon"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEdit(true);
                          }}
                        />

                        <img
                          src={deleteIcon}
                          alt="delete"
                          className="action-icon"
                          onClick={() => handleDelete(user.id)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-role-card">No users</div>
                )}
              </div>
            </div>
          </div>
        ))}
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
    </>
  );
}
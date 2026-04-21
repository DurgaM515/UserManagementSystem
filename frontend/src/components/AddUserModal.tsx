import { useEffect, useState } from "react";
import { createUser, updateUser  } from "../api";
import Alert from '@mui/material/Alert';

export default function AddUserModal({ user, onClose, onSave }: any) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    role: "Admin",
    is_active: true,
  });
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        full_name: user.full_name || "",
        role: user.role || "Admin",
        is_active: user.is_active ?? true,
      });
    } else {
      setForm({
        username: "",
        full_name: "",
        role: "Admin",
        is_active: true,
      });
    }
  }, [user]);
  const [errorMsg, setErrorMsg] = useState("");
  
  const handleSubmit = async () => {
    try {
      if (!form.username.trim() || !form.full_name.trim() || !form.role.trim()) {
        setErrorMsg("Please fill all required fields");
        return;
      } else if (form.username.length < 4) {
        setErrorMsg("Username must be at least 4 characters");
        return;
      } else if (/\s/.test(form.username)) {
        setErrorMsg("Username should not contain spaces");
        return;
      }
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("full_name", form.full_name);
      formData.append("role", form.role);
      formData.append("is_active", String(form.is_active));

      if (profileImage  instanceof File) {
        formData.append("profile_image", profileImage);
      }

      if (user) {
        await updateUser(user.id, formData);
      } else {
        await createUser(formData);
      }
      onSave();
      onClose();
    } catch (error: any) {
    const detail =
      error?.response?.data?.detail ||
      error?.message;

    setErrorMsg(
      typeof detail === "string"
        ? detail
        : "Unable to save user. Please try again."
    );
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "450px",width: "90%",margin: "auto",padding: "8px"}}>
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {user ? "Edit User" : "Add User"}
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">

              {errorMsg && (
                <Alert severity="error" className="mb-3">
                  {errorMsg}
                </Alert>
              )}
                <label>Username *</label>
                <input
                  className="form-control"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                <label>Full Name *</label>
                <input
                  className="form-control"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
                <label>Role *</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>User</option>
                </select>

                <label>Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileImage(e.target.files?.[0] || null)
                  }
                />

                {profileImage && (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="preview"
                    className="profile-preview"
                  />
                )}

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                <label className="form-check-label ms-2">Active</label>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
  }
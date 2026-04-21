import { useState } from "react";
import UserTable from "../components/userTable";
import AddUserModal from "../components/AddUserModal";
import Header from "../components/Header";
import ExportDropdown from "../components/ExportDropdown";
import ColumnsDropdown from "../components/columnsDropdown";
import UserCards from "../components/userCards";
import print from "../assets/print.jpg";
import useNotifications from "../hooks/useNotifications";
import type { ColumnKey } from "../types/userColumns";
import "../App.css";
import {  FaThLarge, FaSync  } from "react-icons/fa";
import { FiExternalLink, FiMaximize2 } from "react-icons/fi";


export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card" | "grid">("table");
  const [selectedColumns, setSelectedColumns] = useState<ColumnKey[]>([
    "id",
    "username",
    "full_name",
    "role",
    "is_active",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const CardIcon = FaThLarge as unknown as React.FC;
  const RefreshIcon = FaSync as unknown as React.FC;
  const ExternalLinkIcon = FiExternalLink as unknown as React.FC;
  const MaximizeIcon = FiMaximize2 as unknown as React.FC;
  const { notifications, setNotifications, addNotification } = useNotifications();
  const handleOpenNewTab = () => {
    window.open("/users", "_blank");
  };
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
    <Header notificationCount={notifications.filter((n) => !n.isRead).length} notifications={notifications} setNotifications={setNotifications}/>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 className="mb-0">Users</h3>
            <small className="text-muted"> User Management System </small>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px"}}>
          <button className="btn-style-add-record" onClick={() => setShowModal(true)}>
            + Add Record
          </button>
          <button className="edit-icon" onClick={handleOpenNewTab}>
            <ExternalLinkIcon />
          </button>

          <button className="edit-icon" onClick={handleFullScreen}>
            <MaximizeIcon />
          </button>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <button className="btn-style-add-record" onClick={() => setShowModal(true)}>
            + Add Record
        </button>
        <ExportDropdown />
        <ColumnsDropdown selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns}/>
          <button
            className="btn-style"
            onClick={() => {
            console.log("print clicked")
            window.print()}}>
          <img src={print} className="print" width="10" height="10" alt="" />
            Print
          </button>
          <button
            className="btn-style"
            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}>
            <CardIcon />
          </button>
          <button type="button" className="btn-style" onClick={() => window.location.reload()}>
            <RefreshIcon />
          </button>
          <div className="ms-auto" style={{ minWidth: "250px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              style={{ maxWidth: "250px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
        </div>
      <div className="card shadow-sm p-3">
        {viewMode === "table" && (
          <UserTable refresh={refresh} columns={selectedColumns} searchTerm={searchTerm}  onNotify={addNotification}/>
        )}

        {viewMode === "card" && (
          <UserCards refresh={refresh} columns={selectedColumns} searchTerm={searchTerm} onNotify={addNotification} />
        )}
    </div>
  </div>
  {showModal && (
    <AddUserModal
      onClose={() => setShowModal(false)}
      onSave={() =>{
        setRefresh(!refresh);
        addNotification("User added successfully");
      }} />
      )}
    </>
  );
}
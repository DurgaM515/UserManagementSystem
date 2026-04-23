import { useState } from "react";
import logo from "../assets/dp.jpg";
import dp from "../assets/admin.jpg";
import "../App.css";
import { FaBell, FaChevronDown } from "react-icons/fa";

type Props = {
  notificationCount: number;
  notifications: { id: number; message: string; time: string; isRead: boolean }[];
  setNotifications: React.Dispatch<
    React.SetStateAction<
      { id: number; message: string; time: string; isRead: boolean }[]
    >
  >;
};

function Header({ notificationCount, notifications, setNotifications }: Props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => {
      const next = !prev;

      if (!next) {
        setNotifications([]);
      }

      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header
      className="navbar navbar-dark px-4"
      style={{ backgroundColor: "#2f4b7c", minHeight: "56px" }}
    >
      <div className="d-flex align-items-center gap-2">
        <img
          src={logo}
          className="logo"
          width="30"
          height="30"
          alt="logo"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />

        <div
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <div
            className="d-flex align-items-center"
            style={{
              cursor: "pointer",
              gap: "6px",
              color: "white",
              padding: "4px 0",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 500, lineHeight: 1 }}>
              User Management
            </span>

            <FaChevronDown
              style={{
                fontSize: "12px",
                transition: "0.2s",
                transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>

          {showUserMenu && (
            <ul
              className="dropdown-menu show"
              style={{
                display: "block",
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "0",
                minWidth: "170px",
                borderRadius: "8px",
                padding: "6px 0",
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <li>
                <a className="dropdown-item" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/users">
                  Users
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/reports">
                  Reports
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <nav className="d-flex align-items-center gap-4">
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            type="button"
            onClick={toggleNotifications}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaBell style={{ color: "white", fontSize: "20px" }} />
          </button>

          {notificationCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-8px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {notificationCount}
            </span>
          )}

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "32px",
                right: 0,
                width: "280px",
                background: "white",
                color: "black",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 2000,
                padding: "10px",
              }}
            >
              <h6 style={{ marginBottom: "10px" }}>Notifications</h6>

              {notifications.length === 0 ? (
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  No notifications
                </p>
              ) : (
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>
                        {item.message}
                      </div>
                      <div style={{ fontSize: "12px", color: "#777" }}>
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setShowAdminMenu(true)}
          onMouseLeave={() => setShowAdminMenu(false)}
        >
          <div
            className="d-flex align-items-center"
            style={{
              cursor: "pointer",
              gap: "8px",
              color: "white",
              padding: "4px 0",
            }}
          >
            <img
              src={dp}
              width="30"
              height="30"
              alt="admin"
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />

            <span style={{ fontSize: "16px", fontWeight: 500, lineHeight: 1 }}>
              Admin
            </span>

            <FaChevronDown
              style={{
                fontSize: "12px",
                transition: "0.2s",
                transform: showAdminMenu ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>

          {showAdminMenu && (
            <ul
              className="dropdown-menu show"
              style={{
                display: "block",
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 0,
                minWidth: "130px",
                borderRadius: "8px",
                padding: "6px 0",
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <li>
                <a className="dropdown-item" href="/profile">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/settings">
                  Settings
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
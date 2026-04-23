import { AdminPortal, useAuth } from "@frontegg/react";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TenantInfo from "./TenantInfo";
import UserProfileIcon from "./UserProfileIcon";
import UserInfoItem from "./UserInfoItem";
import VerifyDeviceModal from "./DeviceModal";
 
const AccountInfo = () => {
  const { user } = useAuth();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const navigate = useNavigate();
 
  const handleAdminPortal = () => {
    window.location.href = "#/admin-box";
    AdminPortal.show();
  };
 
  const userRoles = user?.roles.map((role) => role.name).join(", ");
 
  return (
    <main className="section-screen">
      <div className="section-card account-card">
        <div className="title-wrapper">
          <h1 className="title">Hello, {user?.name || ""}!</h1>
          <div className="title-actions">
            <button
              className="primary-button fit-content"
              onClick={() => setShowVerifyModal(true)}
              aria-label="Verify device"
            >
              Verify Device
            </button>
            <button
              className="primary-button fit-content"
              onClick={handleAdminPortal}
              aria-label="Open self-service portal"
            >
              Self-service portal
            </button>
          </div>
        </div>
        <div className="tenants-wrapper">
          <div className="tenant-card">
            <div className="tenant-title">
              <div className="tenant-logo">
                <UserProfileIcon user={user} />
              </div>
              <p className="tenant-name">{user?.name || ""}</p>
            </div>
            <div className="tenant-info">
              <UserInfoItem title="Name" value={user?.name || ""} />
              <UserInfoItem title="Email" value={user?.email || ""} />
              <UserInfoItem title="Roles" value={userRoles || ""} />
            </div>
            <button
              className="secondary-button edit-button"
              onClick={handleAdminPortal}
              aria-label="Edit user profile"
            >
              Edit user
            </button>
          </div>
          <TenantInfo />
        </div>
      </div>
 
      {showVerifyModal && (
        <VerifyDeviceModal
          onClose={() => setShowVerifyModal(false)}
          onSubmit={(code) => {
            setShowVerifyModal(false);
            navigate(`/activate?user_code=${encodeURIComponent(code)}`);
          }}
        />
      )}
    </main>
  );
}

export default memo(AccountInfo);
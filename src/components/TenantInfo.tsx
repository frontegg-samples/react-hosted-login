import {
  AdminPortal,
  useAuth,
  useAuthActions,
  useTeamActions,
  useTeamState,
} from "@frontegg/react";
import { ITenantsResponseV2 } from "@frontegg/rest-api";
import getInitials from "../utils/getInitials";
import CopyToClipboardButton from "./CopyToClipboardButton";
import TenantsDropdown from "./TenantsDropdown";
import { useEffect } from "react";

type ITentantsExtended = ITenantsResponseV2 & {
  creatorEmail: string;
};

const TenantInfo = () => {
  const { switchTenant } = useAuthActions();
  const { tenantsState } = useAuth();
  const { loadUsers } = useTeamActions();

  const {
    loaders: { USERS: isLoadingUsers },
    users,
  } = useTeamState();

  useEffect(() => {
    loadUsers({ pageOffset: 0, pageSize: 100 });
  }, [loadUsers]);

  const usersCount = users.length;

  const openAccountSettings = () => {
    window.location.href = "#/admin-box/account";
    AdminPortal.show();
  };

  const handleSwitchTenant = (tenant: ITenantsResponseV2) => {
    switchTenant({ tenantId: tenant.tenantId });
  };

  return tenantsState && tenantsState.activeTenant ? (
    <div className="tenant-card">
      <div className="tenant-title-wrapper">
        <div className="tenant-title">
          <div className="tenant-logo">
            <div className="initials">
              {getInitials(tenantsState.activeTenant.name)}
            </div>
          </div>
          <p className="tenant-name">{tenantsState.activeTenant.name}</p>
        </div>
        <TenantsDropdown
          items={tenantsState.tenants}
          selected={tenantsState.activeTenant}
          setSelected={handleSwitchTenant}
        />
      </div>
      <div className="tenant-info">
        <div className="tenant-info-item">
          <p className="tenant-info-item-title">ID</p>
          <div className="tenant-info-copy-wrapper">
            <p className="tenant-info-item-value ellipsis">
              {tenantsState.activeTenant.id}
            </p>
            <CopyToClipboardButton text={tenantsState.activeTenant.id} />
          </div>
        </div>

        <div className="tenant-info-item">
          <p className="tenant-info-item-title">Members</p>
          <p className="tenant-info-item-value">
            {isLoadingUsers ? "loading..." : usersCount}
          </p>
        </div>

        <div className="tenant-info-item">
          <p className="tenant-info-item-title">Creator</p>
          <p className="tenant-info-item-value">
            {(tenantsState.activeTenant as ITentantsExtended).creatorEmail ||
              "system"}
          </p>
        </div>
      </div>
      <button
        className="secondary-button edit-button"
        onClick={openAccountSettings}
      >
        Edit account
      </button>
    </div>
  ) : null;
};

export default TenantInfo;

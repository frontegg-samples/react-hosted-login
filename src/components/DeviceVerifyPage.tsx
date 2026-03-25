import { useEffect, useRef, useState } from "react";
import { ContextHolder, useAuth, useLoginWithRedirect } from "@frontegg/react";
import { useNavigate } from "react-router-dom";
import "../DeviceVerifyPage.css";

const BASE_URL = "https://app-5mqbv7b5ict9.stg.frontegg.com";

type Status = "loading" | "confirm" | "done" | "error";

interface DeviceInfo {
  appName: string;
  userCode: string;
  scopes: string[];
}

export default function DeviceVerifyPage() {
  const { isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const navigate = useNavigate();
  const userCode = new URLSearchParams(window.location.search).get("user_code");

  const [status, setStatus] = useState<Status>("loading");
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    appName: "App",
    userCode: "----",
    scopes: [],
  });
  const [approved, setApproved] = useState<boolean | null>(null);
  const [confirmStatus, setConfirmStatus] = useState("");
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!userCode) {
      setStatus("error");
      return;
    }
    if (!isAuthenticated) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        loginWithRedirect({
          redirectUrl: `${window.location.origin}/activate?user_code=${userCode}`,
        });
      }
      return;
    }
    loadDeviceInfo();
  }, [isAuthenticated, userCode]);

  const loadDeviceInfo = async () => {
    try {
      const token = await ContextHolder.default().getAccessToken();
      const res = await fetch(
        `${BASE_URL}/frontegg/oauth/device?user_code=${encodeURIComponent(userCode!)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.status !== "pending") {
        setStatus("error");
        return;
      }

      setDeviceInfo({
        appName: data.clientName || data.appName || "App",
        userCode: userCode!,
        scopes: data.scopes || [],
      });
      setStatus("confirm");
    } catch {
      setStatus("error");
    }
  };

  const verify = async (isApproved: boolean) => {
    setConfirmStatus("Processing...");
    try {
      const token = await ContextHolder.default().getAccessToken();
      await fetch(`${BASE_URL}/frontegg/oauth/device/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_code: userCode, approved: isApproved }),
      });
      setApproved(isApproved);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="dvp-screen">
      <div className="dvp-card">
        {status === "loading" && (
          <div className="dvp-loading">
            <div className="dvp-spinner" />
            <span className="dvp-loading-text">Verifying device…</span>
          </div>
        )}

        {status === "confirm" && (
          <div className="dvp-confirm">
            <div className="dvp-lock-icon">
              <img src="/icons/lock.svg" alt="Lock" />
            </div>

            <h1 className="dvp-title">Authorize Device</h1>
            <p className="dvp-subtitle">
              <strong>{deviceInfo.appName}</strong> is requesting access to your account.
            </p>

            <div className="dvp-code-box">
              <span className="dvp-code-label">Confirm this code matches your device</span>
              <span className="dvp-code-value">{deviceInfo.userCode}</span>
            </div>

            {deviceInfo.scopes.length > 0 && (
              <div className="dvp-scopes">
                {deviceInfo.scopes.map((s) => (
                  <span key={s} className="dvp-scope-tag">{s}</span>
                ))}
              </div>
            )}

            <div className="dvp-btn-row">
              <button className="dvp-btn dvp-btn-deny" onClick={() => verify(false)}>
                Deny
              </button>
              <button className="dvp-btn dvp-btn-approve" onClick={() => verify(true)}>
                Approve
              </button>
            </div>

            {confirmStatus && (
              <p className="dvp-confirm-status">{confirmStatus}</p>
            )}
          </div>
        )}

        {status === "done" && (
          <div className="dvp-result">
            {approved ? (
              <>
                <img className="dvp-result-icon" src="/icons/success.svg" alt="Success" />
                <h1 className="dvp-result-title">Successfully activated!</h1>
                <p className="dvp-result-sub">
                  Your device has been authorized. Return to your account or go back to your device.
                </p>
              </>
            ) : (
              <>
                <img className="dvp-result-icon" src="/icons/denied.svg" alt="Denied" />
                <h1 className="dvp-result-title">Access Denied</h1>
                <p className="dvp-result-sub">
                  You have denied access for this device. You can return to your account and verify another device.
                </p>
              </>
            )}
            <button className="dvp-btn dvp-btn-approve dvp-result-back" onClick={() => navigate("/")}>
              Back to Account
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="dvp-error">
            <div className="dvp-error-icon">
              <img src="/icons/error.svg" alt="Error" />
            </div>
            <h1 className="dvp-error-title">Something went wrong</h1>
            <p className="dvp-error-msg">
              {!userCode
                ? "No device code provided. Please check the link and try again."
                : "Unable to verify this device. The code may be expired or invalid."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { ContextHolder, useAuth, useLoginWithRedirect } from "@frontegg/react";
import Header from "./Header";
import AccountInfo from "./AccountInfo";
import Welcome from "./Welcome";
import SignupBanner from "./SignupBanner";

const Main = () => {
  const { isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();

  // Uncomment to skip welcome page and redirect to login or app if authenticated
  // const { isAuthenticated, isLoading } = useAuth();
  // useEffect(() => {
  //   if (!isAuthenticated && !isLoading) {
  //     loginWithRedirect();
  //   }
  // }, [isAuthenticated, isLoading, loginWithRedirect]);

  const handleLogout = () => {
    const baseUrl = ContextHolder.for(undefined as any).getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location.href}`;
  };

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isAuthenticated ? (
        <AccountInfo />
      ) : (
        <Welcome onSignIn={loginWithRedirect} />
      )}
      <SignupBanner />
    </div>
  );
};

export default Main;

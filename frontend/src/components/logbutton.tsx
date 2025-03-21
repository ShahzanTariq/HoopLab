import { useAuth } from 'react-oidc-context';





  

function LogButton(){
    const auth = useAuth();
    const signOutRedirect = () => {
        try {
            console.log("Signing out...");
            auth.removeUser()
            const clientId = "6ciq9qotdr1snk75j014hg6q49";
            const logoutUri = "http://localhost:3000/";
            const cognitoDomain = "https://ca-central-12ndsdd4r9.auth.ca-central-1.amazoncognito.com";
            window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
        }
        catch (error) {
            console.error("Sign-out error:", error);
        }
      };
    
    if (auth.isLoading) {
        return <div>Loading...</div>;
    }
    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }
    if (auth.isAuthenticated) {
        return <button onClick={signOutRedirect}>Sign out</button>
    }
    return <button onClick={() => auth.signinRedirect()}>Sign in</button>
    
}

export default LogButton;
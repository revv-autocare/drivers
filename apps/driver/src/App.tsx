import { Authenticator } from "@aws-amplify/ui-react";

export function App() {
  return (
    <Authenticator
      signUpAttributes={["email", "name", "phone_number"]}
      loginMechanisms={["email"]}
    >
      {({ signOut, user }) => (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
          <h1>Revv Driver</h1>
          <p>
            Signed in as <strong>{user?.signInDetails?.loginId ?? user?.username}</strong>
          </p>
          <p style={{ color: "#666", marginTop: 16 }}>
            Phase 1 placeholder. The prototype's screens (home, deals, claims, profile) will be ported here in subsequent work.
          </p>
          <button onClick={signOut} style={{ marginTop: 16 }}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

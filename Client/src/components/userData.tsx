import { useUserData } from "../hooks/useUserData";
import { useSessionData } from "../hooks/useSessionData";

const UserData = () => {
  const { id, email, loading: userDataLoading, error: userDataError } = useUserData();
  const { userID, jwt, isValid, loading: sessionDataLoading, error: sessionDataError } = useSessionData();

  if (userDataLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>User id: {id}</div>
      <div>User email: {email}</div>
    </div>
  );
};

export default UserData;

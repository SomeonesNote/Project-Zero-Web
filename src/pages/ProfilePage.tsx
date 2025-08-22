import { useUser } from "@/store/AppContext";
import { Navigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [user] = useUser();

  if (!user?.isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="profile-page">
      <h1>프로필</h1>
      <div className="profile-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;

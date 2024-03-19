import { auth } from '../utils/Firebase';
import { signOut } from 'firebase/auth';
import "../styles/settings.css";
import { googleLogout } from "@react-oauth/google";

const SettingsView: React.FC = () => {
  return (
    <div className="settings-page">
      <button
        onClick={async () => {
          await signOut(auth);
          googleLogout();
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default SettingsView;

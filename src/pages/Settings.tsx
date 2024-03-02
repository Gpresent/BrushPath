import { auth } from '../utils/Firebase';
import { signOut } from 'firebase/auth';

const SettingsView: React.FC = () => {
    return (
        <div className="settings-page">
            <button onClick={async () => {await signOut(auth)}}>Log out</button>   
        </div>
    )}

export default SettingsView;

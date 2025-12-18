
import "../profilepagecomponents/profile.css";


export default function ProfileInfo() {
  return (
    <div className="card profile-box">
      <div className="field">
        <label>Name</label>
        <input placeholder="Your First Name" />
      </div>

      <div className="field">
        <label>Contact Info</label>
        <input placeholder="Your Contact Info" />
      </div>
    </div>
  );
}

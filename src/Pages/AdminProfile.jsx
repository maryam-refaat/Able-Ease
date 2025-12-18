import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../Components/PatientCard';
import { useAuth } from '../context/AuthContext';
import { getAllUsernames, registerUser, updateUser, changePassword, getUserBySsn, deleteUser, addDisability } from '../assets/apis';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.username || user?.name || user?.email || 'Admin';

  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [createForm, setCreateForm] = useState({ 
    username: '', 
    email: '', 
    name: '', 
    password: '', 
    confirm: '',
    phoneNumber: ''
  });

  const [message, setMessage] = useState(null);
  const [pwdForm, setPwdForm] = useState({ current: '', newPassword: '', confirm: '' });
  const [pwdMessage, setPwdMessage] = useState(null);

  // Disability form state (Admin)
  const [disabilityForm, setDisabilityForm] = useState({ name: '', type: '', description: '' });
  const [disabilityMessage, setDisabilityMessage] = useState(null);
  const [disabilityLoading, setDisabilityLoading] = useState(false);

  const extractRoleValue = (user) => {
    if (!user) return undefined;
    if (user.role) return user.role;
    if (user.Role) return user.Role;
    if (Array.isArray(user.roles) && user.roles.length) return user.roles[0];
    if (Array.isArray(user.Roles) && user.Roles.length) return user.Roles[0];
    if (user.roleName) return user.roleName;
    if (user.RoleName) return user.RoleName;
    if (user.roleId || user.RoleId) return user.roleId || user.RoleId;
    return undefined;
  };

  const normalizeUser = (u, details = {}) => {
    const name = u.name || u.Name || details.name || details.Name || u.username || '';
    const email = u.email || u.Email || details.email || details.Email || '';
    const ssn = u.ssn || u.Ssn || details.ssn || details.Ssn || details.id || u.id || '';
    const rawRole = extractRoleValue(details) ?? extractRoleValue(u);
    return { ...u, name, email, ssn, rawRole };
  };

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await getAllUsernames();
      let list = res.data || [];

      // Fetch details for entries missing role
      const needsDetail = list.filter((u) => !extractRoleValue(u));
      if (needsDetail.length > 0) {
        const detailed = await Promise.all(
          list.map(async (u) => {
            try {
              const identifier = u.ssn || u.Ssn || u.id || u.Id || u.username || u.Username || u.email || u.Email;
              if (!identifier) return normalizeUser(u, {});
              const r = await getUserBySsn(identifier);
              const details = r?.data || r || {};
              return normalizeUser(u, details);
            } catch (e) {
              return normalizeUser(u, {});
            }
          })
        );
        list = detailed;
      } else {
        list = list.map((u) => normalizeUser(u, {}));
      }

      // Convert to display-friendly roles
      const listWithDisplay = list.map((u) => ({ ...u, displayRole: getRoleString(u.rawRole) || (typeof u.rawRole === 'string' ? u.rawRole : '') }));

      const hasRoleField = listWithDisplay.some((u) => u.displayRole && u.displayRole !== '');
      if (hasRoleField) {
        const adminsOnly = listWithDisplay.filter((u) => (u.displayRole || '').toLowerCase().includes('admin'));
        setAdmins(adminsOnly.length > 0 ? adminsOnly : listWithDisplay);
      } else {
        setAdmins(listWithDisplay);
      }
    } catch (err) {
      console.error('Failed to load users', err);
      setAdmins([]);
    } finally {
      setLoadingAdmins(false);
    }
  };

  React.useEffect(() => { 
    fetchAdmins(); 
  }, []);

  const handleCreateAdmin = async () => {
    // Validation
    if (!createForm.username || !createForm.email || !createForm.password) {
      return alert('Username, email and password are required');
    }
    if (!createForm.phoneNumber) {
      return alert('Phone number is required');
    }
    if (createForm.password !== createForm.confirm) {
      return alert('Passwords do not match');
    }

    // Basic phone validation (at least 10 digits)
    const phoneDigits = createForm.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return alert('Please enter a valid phone number (at least 10 digits)');
    }

    try {
      const payload = {
        Name: createForm.name || createForm.username,
        Role: 4, // Admin role = 4
        Username: createForm.username,
        Email: createForm.email,
        Password: createForm.password,
        ConfirmPassword: createForm.confirm,
        PhoneNumber: createForm.phoneNumber // Required field
      };
      
      console.log('Creating admin with payload:', payload);
      const result = await registerUser(payload);
      console.log('Register result:', result);
      
      setMessage('Admin account created successfully!');
      setCreateForm({ 
        username: '', 
        email: '', 
        name: '', 
        password: '', 
        confirm: '',
        phoneNumber: ''
      });
      
      fetchAdmins();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Create admin failed', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create admin';
      alert('Create admin failed: ' + errorMsg);
    }
  };

  // View full profile in a modal
  const [viewUser, setViewUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    email: '', 
    role: ''
  });

  const viewProfile = async (u) => {
    try {
      const ssnValue = u.ssn || u.Ssn || u.SSN;
      if (!ssnValue) {
        alert('User SSN not found');
        return;
      }
      
      const res = await getUserBySsn(ssnValue);
      setViewUser(res.data || res);
      setViewOpen(true);
    } catch (err) {
      console.error('Failed to load user profile', err);
      alert('Failed to load profile');
    }
  };

  const openEdit = async (u) => {
    try {
      const ssnValue = u.ssn || u.Ssn || u.SSN;
      if (!ssnValue) {
        alert('User SSN not found');
        return;
      }
      
      const res = await getUserBySsn(ssnValue);
      const userData = res.data || res;
      
      setEditingUser(userData);
      setEditForm({
        name: userData?.name || userData?.Name || '',
        email: userData?.email || userData?.Email || userData?.username || '',
        role: getRoleString(userData?.role || userData?.Role)
      });
      setEditOpen(true);
    } catch (err) {
      console.error('Failed to load user for edit', err);
      alert('Failed to load user');
    }
  };

  const getRoleString = (role) => {
    if (role === undefined || role === null || (role === '' && role !== 0)) return '';

    // If the role is a numeric string, coerce it to a number
    if (typeof role === 'string' && /^\d+$/.test(role)) {
      role = parseInt(role, 10);
    }

    if (typeof role === 'string') return role; // e.g., 'Admin'

    const roleMap = {
      0: 'Patient',
      1: 'Caregiver',
      2: 'Relative',
      3: 'Organization',
      4: 'Admin',
      5: 'Center'
    };

    return roleMap[role] || '';
  };

  const displayRole = (role) => {
    if (role === undefined || role === null || (role === '' && role !== 0)) return 'Admin';

    // Coerce numeric strings to numbers
    if (typeof role === 'string' && /^\d+$/.test(role)) {
      role = parseInt(role, 10);
    }

    if (typeof role === 'string') return role;

    const roleMap = {
      0: 'Patient',
      1: 'Caregiver',
      2: 'Relative',
      3: 'Organization',
      4: 'Admin',
      5: 'Center'
    };

    return roleMap[role] || 'Unknown';
  };

  const submitEdit = async () => {
    if (!editingUser) return;
    
    const ssnValue = editingUser.ssn || editingUser.Ssn || editingUser.SSN;
    if (!ssnValue) {
      alert('User SSN not found');
      return;
    }
    
    try {
      const payload = {
        Name: editForm.name,
        Email: editForm.email,
        Role: editForm.role
      };
      
      console.log('Updating user with SSN:', ssnValue, 'Payload:', payload);
      await updateUser(ssnValue, payload);
      
      setMessage('User updated successfully!');
      setEditOpen(false);
      setEditingUser(null);
      fetchAdmins();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Update failed', err);
      const errorMsg = err?.message || 'Update failed';
      alert(errorMsg);
    }
  };

  const handleAddDisability = async () => {
    if (!disabilityForm.name) return alert('Disability name is required');
    try {
      setDisabilityLoading(true);
      const payload = {
        name: disabilityForm.name,
        type: disabilityForm.type || '',
        description: disabilityForm.description || ''
      };

      await addDisability(payload);
      setDisabilityMessage('Disability added successfully!');
      setDisabilityForm({ name: '', type: '', description: '' });
      setTimeout(() => setDisabilityMessage(null), 3000);
    } catch (err) {
      console.error('Add disability failed', err);
      const errorMsg = err?.message || 'Failed to add disability';
      alert(errorMsg);
    } finally {
      setDisabilityLoading(false);
    }
  };

  const handleDeleteUser = async (u) => {
    const ssnValue = u?.ssn || u?.Ssn || u?.SSN || u?.id || u?.Id || u?.username;
    if (!ssnValue) {
      alert('User SSN not found; cannot delete');
      return;
    }
    const currentSsn = user?.ssn || user?.Ssn || user?.SSN || user?.id || user?.Id || user?.username;
    if (currentSsn && (currentSsn === ssnValue)) {
      alert('You cannot delete your own account');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${u?.username || u?.name || 'this user'}? This action cannot be undone.`)) return;
    try {
      await deleteUser(ssnValue);
      setMessage('User deleted successfully!');
      fetchAdmins();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Delete failed', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to delete user';
      alert(errorMsg);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-container">
        <header className="welcome-box centered" style={{ position: 'relative' }}>
          <h1>Welcome, {displayName.split(' ')[0] || 'Admin'}</h1>
          <p>{new Date().toLocaleDateString()}</p>
          <button
            className="btn"
            onClick={() => {
              localStorage.setItem('auth.isLoggedIn','false');
              logout();
              window.dispatchEvent(new Event('auth-changed'));
              navigate('/');
            }}
            style={{ position: 'absolute', right: 16, top: 12, padding: '8px 12px', borderRadius: 8, background: '#dc2626', color: 'white' }}
            title="Logout"
            aria-label="Logout"
          >
            Logout
          </button>
        </header>

        <div style={{ marginTop: 16 }}>
          <PatientCard
            title="Administrator"
            data={{ fullName: displayName, email: user?.email || '', avatar: null }}
            showAvatar={false}
            showEdit={false}
          />

          <div style={{ marginTop: 12 }}>
            <button 
              className="btn" 
              onClick={() => navigate('/insights')} 
              style={{ 
                background: '#047857', 
                color: 'white', 
                padding: '10px 14px', 
                borderRadius: 8 
              }}
            >
              Open Website Reports
            </button>
          </div>
        </div>

        {/* Change Password Section */}
        <section className="card-section card-section--password" style={{ marginTop: 18 }}>
          <h3>Change Password</h3>
          <div className="card-row">
            <input 
              className="input"
              placeholder="Current password" 
              type="password" 
              value={pwdForm.current} 
              onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="New password" 
              type="password" 
              value={pwdForm.newPassword} 
              onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Confirm" 
              type="password" 
              value={pwdForm.confirm} 
              onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} 
            />
            <button 
              className="btn primary" 
              onClick={async () => {
                if (!pwdForm.current || !pwdForm.newPassword) {
                  return alert('Please fill all fields');
                }
                if (pwdForm.newPassword !== pwdForm.confirm) {
                  return alert('Passwords do not match');
                }
                try {
                  await changePassword({ 
                    CurrentPassword: pwdForm.current, 
                    NewPassword: pwdForm.newPassword, 
                    ConfirmPassword: pwdForm.confirm 
                  });
                  setPwdMessage('Password changed successfully!');
                  setPwdForm({ current: '', newPassword: '', confirm: '' });
                  setTimeout(() => setPwdMessage(null), 3000);
                } catch (err) {
                  console.error('Change password failed', err);
                  const errorMsg = err?.message || 'Failed to change password';
                  alert('Change password failed: ' + errorMsg);
                }
              }}
            >
              Change
            </button>
          </div>
          {pwdMessage && <p className="status-msg success">{pwdMessage}</p>}
        </section>

        {/* Create Admin Section */}
        <section className="card-section card-section--create" style={{ marginTop: 18 }}>
          <h3>Create Admin</h3>
          <div className="card-row">
            <input 
              className="input"
              placeholder="Username *" 
              value={createForm.username} 
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Email *" 
              type="email"
              value={createForm.email} 
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Name" 
              value={createForm.name} 
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Phone *" 
              type="tel"
              value={createForm.phoneNumber} 
              onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Password *" 
              type="password" 
              value={createForm.password} 
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} 
            />
            <input 
              className="input"
              placeholder="Confirm *" 
              type="password" 
              value={createForm.confirm} 
              onChange={(e) => setCreateForm({ ...createForm, confirm: e.target.value })} 
            />
            <button 
              className="btn primary" 
              onClick={handleCreateAdmin}
            >
              Create Admin
            </button>
          </div>
          <div className="small-note">* Required fields. Phone: (e.g., +1234567890 or 01234567890)</div>
          {message && <p className="status-msg success">{message}</p>}
        </section>

        {/* Add Disability (Admin) */}
        <section className="card-section" style={{ marginTop: 18 }}>
          <h3>Add Disability</h3>
          <div className="card-row">
            <input
              className="input"
              placeholder="Name *"
              value={disabilityForm.name}
              onChange={(e) => setDisabilityForm({ ...disabilityForm, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Type"
              value={disabilityForm.type}
              onChange={(e) => setDisabilityForm({ ...disabilityForm, type: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={disabilityForm.description}
              onChange={(e) => setDisabilityForm({ ...disabilityForm, description: e.target.value })}
            />

            <button
              className="btn primary"
              onClick={handleAddDisability}
              disabled={disabilityLoading}
            >
              {disabilityLoading ? 'Adding...' : 'Add Disability'}
            </button>
          </div>
          {disabilityMessage && <p className="status-msg success">{disabilityMessage}</p>}
        </section>

        {/* All Users Section */}
        <section className="card-section" style={{ marginTop: 18 }}>
          <h3>All Users</h3>
          {loadingAdmins ? (
            <div>Loading...</div>
          ) : (
            <div className="profile-cards-grid">
              {admins.map((u, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: 12, 
                    border: '1px solid #e6eef8', 
                    borderRadius: 8,
                    backgroundColor: '#fff'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {u.name || u.Name || u.username || u.Username || 'No Name'}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 6 }}>
                    {u.username || u.Username || 'No Username'}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ 
                      background: '#eef2ff', 
                      color: '#3730a3', 
                      padding: '2px 6px', 
                      borderRadius: 6, 
                      fontSize: 12 
                    }}>
                      {u.displayRole ? u.displayRole : displayRole(u.role || u.Role)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      className="btn" 
                      onClick={() => viewProfile(u)}
                      style={{ fontSize: 13 }}
                    >
                      View
                    </button>
                    <button 
                      className="btn" 
                      onClick={() => openEdit(u)}
                      style={{ fontSize: 13 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeleteUser(u)}
                      style={{ fontSize: 13, background: '#dc2626', color: 'white' }}
                      disabled={!(u?.ssn || u?.Ssn || u?.SSN || u?.id || u?.Id)}
                      title={!(u?.ssn || u?.Ssn || u?.SSN || u?.id || u?.Id) ? 'No identifier available' : 'Delete user'}
                      aria-label="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Edit Modal */}
        {editOpen && (
          <div 
            className="modal-overlay" 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.5)', 
              display: 'grid', 
              placeItems: 'center',
              zIndex: 1000
            }}
          >
            <div style={{ 
              width: '90%',
              maxWidth: 600, 
              background: 'white', 
              borderRadius: 12, 
              padding: 24 
            }}>
              <h3 style={{ marginBottom: 16 }}>Edit User</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input 
                  placeholder="Name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <input 
                  placeholder="Email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />

                <select 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                >
                  <option value="">Select role</option>
                  <option value="Patient">Patient</option>
                  <option value="Organization">Organization</option>
                  <option value="TherapyCenter">TherapyCenter</option>
                  <option value="Relative">Relative</option>
                  <option value="Admin">Admin</option>
                  <option value="Caregiver">Caregiver</option>
                </select>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button 
                  className="btn" 
                  onClick={submitEdit} 
                  style={{ background: '#059669', color: 'white', padding: '8px 16px' }}
                >
                  Save Changes
                </button>
                <button 
                  className="btn" 
                  onClick={() => { 
                    setEditOpen(false); 
                    setEditingUser(null); 
                  }}
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewOpen && (
          <div 
            className="modal-overlay" 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.5)', 
              display: 'grid', 
              placeItems: 'center',
              zIndex: 1000
            }}
          >
            <div style={{ 
              width: '90%',
              maxWidth: 600, 
              background: 'white', 
              borderRadius: 12, 
              padding: 24 
            }}>
              <h3 style={{ marginBottom: 16 }}>User Profile</h3>
              {viewUser ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>
                    {viewUser.name || viewUser.Name || viewUser.username || viewUser.Username}
                  </div>
                  <div style={{ color: '#6b7280', marginBottom: 8 }}>
                    {viewUser.email || viewUser.Email}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Username:</strong> {viewUser.username || viewUser.Username || '-'}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Role:</strong> {displayRole(viewUser.role || viewUser.Role)}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>SSN:</strong> {viewUser.ssn || viewUser.Ssn || viewUser.SSN || '-'}
                  </div>
                </div>
              ) : (
                <div>Loading...</div>
              )}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button 
                  className="btn" 
                  onClick={() => setViewOpen(false)}
                  style={{ padding: '8px 16px' }}
                >
                  Close
                </button>
                <button 
                  className="btn" 
                  onClick={() => { 
                    setViewOpen(false); 
                    openEdit(viewUser); 
                  }}
                  style={{ background: '#059669', color: 'white', padding: '8px 16px' }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
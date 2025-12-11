import { useState } from 'react';
import { usersApi, formsApi } from '../store/store';

export default function ApiTest() {
  const [formName, setFormName] = useState('');
  
  const { data: forms, isLoading: formsLoading, error: formsError, refetch: refetchForms } = formsApi.useGetFormsQuery(undefined, { skip: false });
  const { data: users, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = usersApi.useGetUsersQuery(undefined, { skip: false });
  const [createForm, { isLoading: isCreatingForm }] = formsApi.useCreateFormMutation();

  const handleCreateForm = async () => {
    if (!formName.trim()) return;
    try {
      await createForm({ form_name: formName }).unwrap();
      setFormName('');
      alert('Form created successfully!');
    } catch (error) {
      alert(`Error: ${error.data?.error || error.message || 'Failed to create form'}`);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '30px', 
      color: '#fff', 
      background: '#242424', 
      minHeight: '100vh', 
      padding: '20px' 
    }}>
      <div style={{ 
        padding: '20px', 
        background: '#1a1a1a', 
        borderRadius: '8px', 
        marginBottom: '20px', 
        border: '1px solid #333' 
      }}>
        <h1 style={{ color: '#fff', marginTop: 0 }}>API Endpoints Test (RTK Query)</h1>
        <p style={{ color: '#ccc' }}><strong>API Base URL:</strong> http://localhost:3000/api</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => refetchForms()} 
            disabled={formsLoading}
            style={{ 
              padding: '10px 20px', 
              background: formsLoading ? '#555' : '#646cff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: formsLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {formsLoading ? 'Loading...' : 'Refetch Forms'}
          </button>
          <button 
            onClick={() => refetchUsers()} 
            disabled={usersLoading}
            style={{ 
              padding: '10px 20px', 
              background: usersLoading ? '#555' : '#646cff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: usersLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {usersLoading ? 'Loading...' : 'Refetch Users'}
          </button>
        </div>
        {(formsError || usersError) && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: '#ff4444', 
            borderRadius: '4px', 
            color: '#fff' 
          }}>
            {formsError && <div>Forms Error: {JSON.stringify(formsError)}</div>}
            {usersError && <div>Users Error: {JSON.stringify(usersError)}</div>}
          </div>
        )}
      </div>
      
      {/* Forms Section */}
      <section style={{ 
        border: '1px solid #444', 
        padding: '20px', 
        borderRadius: '8px', 
        background: '#1a1a1a' 
      }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Forms API (RTK Query)</h2>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
            style={{ 
              padding: '10px', 
              marginRight: '10px', 
              width: '250px',
              background: '#242424',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateForm();
              }
            }}
          />
          <button
            onClick={handleCreateForm}
            disabled={isCreatingForm || !formName.trim()}
            style={{ 
              padding: '10px 20px',
              background: (isCreatingForm || !formName.trim()) ? '#555' : '#646cff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: (isCreatingForm || !formName.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isCreatingForm ? 'Creating...' : 'Create Form'}
          </button>
        </div>
        <div>
          <h3 style={{ color: '#fff' }}>Forms List:</h3>
          {formsLoading && <p style={{ color: '#ccc' }}>Loading forms...</p>}
          {formsError && <p style={{ color: 'red' }}>Error: {JSON.stringify(formsError)}</p>}
          {forms && Array.isArray(forms) && forms.length > 0 && (
            <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
              {forms.map((form) => (
                <li key={form.id} style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#fff' }}>{form.form_name}</strong>
                  {form.description && <span style={{ color: '#888' }}> - {form.description}</span>}
                </li>
              ))}
            </ul>
          )}
          {forms && Array.isArray(forms) && forms.length === 0 && (
            <p style={{ color: '#888' }}>No forms found. Create one above!</p>
          )}
          {!forms && !formsLoading && !formsError && (
            <p style={{ color: '#888' }}>Forms will load automatically or click "Refetch Forms".</p>
          )}
        </div>
      </section>

      {/* Users Section */}
      <section style={{ 
        border: '1px solid #444', 
        padding: '20px', 
        borderRadius: '8px', 
        background: '#1a1a1a' 
      }}>
        <h2 style={{ color: '#fff', marginTop: 0 }}>Users API (RTK Query)</h2>
        <div>
          <h3 style={{ color: '#fff' }}>Users List:</h3>
          {usersLoading && <p style={{ color: '#ccc' }}>Loading users...</p>}
          {usersError && <p style={{ color: 'red' }}>Error: {JSON.stringify(usersError)}</p>}
          {users && Array.isArray(users) && users.length > 0 && (
            <div>
              <p style={{ color: '#ccc', marginBottom: '10px' }}>
                <strong>Total Users:</strong> {users.length}
              </p>
              <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
                {users.slice(0, 10).map((user) => (
                  <li key={user.id} style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#fff' }}>
                      {user.first_name} {user.last_name}
                    </strong>
                    <span style={{ color: '#888' }}> - {user.email}</span>
                    {user.phone_e164 && <span style={{ color: '#888' }}> ({user.phone_e164})</span>}
                  </li>
                ))}
              </ul>
              {users.length > 10 && (
                <p style={{ color: '#888', fontStyle: 'italic' }}>
                  ... and {users.length - 10} more users
                </p>
              )}
            </div>
          )}
          {users && Array.isArray(users) && users.length === 0 && (
            <p style={{ color: '#888' }}>No users found.</p>
          )}
          {!users && !usersLoading && !usersError && (
            <p style={{ color: '#888' }}>Users will load automatically or click "Refetch Users".</p>
          )}
        </div>
      </section>
    </div>
  );
}

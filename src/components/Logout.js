import React from 'react';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Perform any other necessary actions for logout
    // ...
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    // <button onClick={handleLogout} >	<span> </span>
    // <span> </span>
    // <span> </span>
    // <span> </span>
    // <LockOpenTwoToneIcon/><p>Logout</p></button>


<button onClick={handleLogout} id="neonShadow"><LockOpenTwoToneIcon/><p>Logout</p></button>
  );
};

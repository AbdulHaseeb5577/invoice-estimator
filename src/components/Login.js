import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_CUSTOMER } from './mutation/mutations';
import { useNavigate } from 'react-router-dom';
import cyclewally from './image/cyclewally.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');      
  const [loginError, setLoginError] = useState(null);
  const [login] = useMutation(LOGIN_CUSTOMER);
  const history = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      const token = data.generateCustomerToken.token;
      console.log(token)
      localStorage.setItem('token', token);
      history('/create');
    } catch (error) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className='LoginContainer'>
    <form onSubmit={handleSubmit} className="LoginForm">
    <h1>Log in</h1>
    <img src={cyclewally} alt="Logo" />
      <input type="email" placeholder="USER NAME OR EMAIL" value={email} onChange={handleEmailChange} />
      <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
      {loginError && <div>{loginError}</div>}
      <button type="submit">Log in</button>
    </form>
    </div>
  );
}
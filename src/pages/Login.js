import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem('maL_user');
    const user = JSON.parse(userJson);
    if (user) {
      toast("Already Signed in as: " + user.displayName, {type: 'success', theme: 'dark'});
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    }
  }, [navigate]);

  const loginWith = async (providerName) => {
    try {
      let provider = null;
      switch(providerName) {
        case 'github':
          provider = new GithubAuthProvider();
          break;
        case 'google':
          provider = new GoogleAuthProvider();
          break;
        default:
      }
  
      const res = await signInWithPopup(auth, provider);
      localStorage.setItem('maL_user', JSON.stringify(res.user));
      toast("Signed in as: " +  res.user.displayName, {type: 'success', theme: 'dark'});
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    console.log(email, " AUTH ERROR: [", errorCode, "] ===> ", errorMessage);
    }
  }

  return (
    <div className='container login-container'>
      <div>
        <h2>Welcome to MaLogs</h2>
        <p>Take control of your finances today!</p>
      </div>
      <div className="btn-container">
        <button onClick={() => loginWith('google')}><FcGoogle /> <span>Continue with Google</span></button>
        <button onClick={() => loginWith('github')}><FaGithub /> <span>Continue with Github</span></button>
      </div>
    </div>
  )
}

export default Login
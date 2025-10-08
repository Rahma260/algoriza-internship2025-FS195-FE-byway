import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { FaMicrosoft, FaGoogle, FaFacebook } from "react-icons/fa";
import logimImg from "../../public/images/login.png";
import AuthLayout from "../Components/Auth/AuthLayout";
import AuthInput from "../Components/Auth/AuthInput";
import SocialButton from "../Components/Auth/SocialButton";
import Navbar from "../Components/Layout/Navbar";
import { useAuth } from '../Components/Context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.roles?.some(role =>
        role.toLowerCase() === 'admin'
      );

      if (isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.isAuthenticated) {
        const isAdmin = response.roles?.some(role =>
          role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
        );

        if (isAdmin) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout image={logimImg} reverse>
        <h2 className="auth-title">Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Username or Email ID"
            required
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
            required
            autoComplete="current-password"
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex justify-start">
            <button
              type="submit"
              className="auth-button disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <ArrowRight size={20} /> Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="auth-divider">Sign in with</div>

        <div className="flex justify-center gap-2">
          <SocialButton
            color="text-blue-600"
            hoverColor="bg-blue-50"
            icon={<FaFacebook size={22} />}
          >
            Facebook
          </SocialButton>
          <SocialButton
            color="text-red-500"
            hoverColor="bg-red-50"
            icon={<FaGoogle size={22} />}
          >
            Google
          </SocialButton>
          <SocialButton
            color="text-blue-500"
            hoverColor="bg-blue-50"
            icon={<FaMicrosoft size={22} />}
          >
            Microsoft
          </SocialButton>
        </div>
      </AuthLayout>
    </>
  );
}

export default Login;
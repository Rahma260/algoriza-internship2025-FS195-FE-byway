import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { FaMicrosoft, FaGoogle, FaFacebook } from "react-icons/fa";
import registerImg from "../../public/images/register.jpg";
import AuthLayout from "../Components/Auth/AuthLayout";
import AuthInput from "../Components/Auth/AuthInput";
import SocialButton from "../Components/Auth/SocialButton";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { useAuth } from '../Components/Context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await registerUser(registerData);

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout image={registerImg}>
        <h2 className="auth-title">Create your account</h2>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Full Name</label>
          <div className="mb-6 flex gap-6">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="auth-input"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="auth-input"
              required
            />
          </div>

          <AuthInput
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="Enter username"
            required
          />

          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
            required
          />

          <div className="mb-6 flex gap-6">
            <div className="flex-1">
              <AuthInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex-1">
              <AuthInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <input type="hidden" name="role" value="2" />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="flex justify-start">
            <button
              type="submit"
              className="auth-button disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <ArrowRight size={20} /> Create Account
                </>
              )}
            </button>
          </div>
        </form>

        <div className="auth-divider">Sign up with</div>

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
      <Footer />
    </>
  );
}

export default Register;
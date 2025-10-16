import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Heart, MapPin, Globe, Star } from "lucide-react";
import "./AuthPage.css";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ✅ Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const { signIn, user, role } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // ✅ Redirect automatically once user & role are available
  useEffect(() => {
    if (user && role) {
      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/");
    }
  }, [user, role, navigate]);

  // ✅ Handle login
  const onSubmit = async (data) => {
    try {
      // 🔹 Show loading spinner
      MySwal.fire({
        title: 'Logging in...',
        html: 'Please wait',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      const { data: signInData, error } = await signIn(data.email, data.password);

      if (error) throw error;

      // 🔹 Show success with heart icon
      await MySwal.fire({
        title: 'Login Successful!',
        html: `<span style="font-size:2rem;">💖</span><br/>Welcome back!`,
        icon: 'success',
        confirmButtonText: 'Continue',
      });

      // Redirect happens automatically via useEffect

    } catch (err) {
      console.error("Login error:", err);
      MySwal.fire({
        title: 'Login Failed',
        text: err.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  const benefits = [
    { icon: Heart, text: "Save favorite destinations" },
    { icon: MapPin, text: "Create personal wishlists" },
    { icon: Globe, text: "Sync across all devices" },
    { icon: Star, text: "Access to premium content" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-box">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to continue your journey with ViharVista</p>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="input-group">
              <span className="input-icon"><Mail size={18} /></span>
              <input type="email" placeholder="Email address" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div className="input-group">
              <span className="input-icon"><Lock size={18} /></span>
              <input type="password" placeholder="Password" {...register("password")} />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <div className="auth-switch">
            Don’t have an account? <Link to="/signup">Sign up here</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="signup-benefits">
          <h3>What you'll get</h3>
          {benefits.map(({ icon: Icon, text }, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon"><Icon size={20} /></div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

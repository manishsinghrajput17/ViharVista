import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Mail, Lock, Heart, MapPin, Globe, Star } from "lucide-react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./AuthPage.css";

const MySwal = withReactContent(Swal);

const schema = yup.object().shape({
  fullName: yup.string().min(3, "Full name must be at least 3 characters").required("Full name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
  agreeToTerms: yup.bool().oneOf([true], "You must agree to the Terms"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      // ✅ Show loading spinner while signing up
      MySwal.fire({
        title: 'Creating account...',
        html: 'Please wait',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      // 1️⃣ Create user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (signUpError) throw signUpError;

      // 2️⃣ Insert into users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: "user",
        },
      ]);
      if (insertError) throw insertError;

      // ✅ Show Sweetheart success alert
      await MySwal.fire({
        title: 'Account Created!',
        html: `<span style="font-size:2rem;">💖</span><br/>successfully`,
        icon: 'success',
        confirmButtonText: 'Go to Destinations',
      });

      navigate("/destinations");

    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: 'Signup Failed',
        text: err.message || 'Something went wrong',
        icon: 'error',
      });
    }
  };

  return (
    <div className="auth-page">
      {/* ...rest of your JSX stays the same */}
      <div className="auth-left">
        <div className="auth-box">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input type="text" placeholder="Full Name" {...register("fullName")} />
              {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
            </div>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input type="email" placeholder="Email" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input type="password" placeholder="Password" {...register("password")} />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
            </div>
            <div className="terms">
              <input type="checkbox" {...register("agreeToTerms")} />
              <span>I agree to <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span>
            </div>
            {errors.agreeToTerms && <p className="error-text">{errors.agreeToTerms.message}</p>}
            <button type="submit" className="auth-btn">Create Account</button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="signup-benefits">
          <h3>What you'll get</h3>
          {[
            { icon: Heart, text: "Save favorite destinations" },
            { icon: MapPin, text: "Create personal wishlists" },
            { icon: Globe, text: "Sync across all devices" },
            { icon: Star, text: "Access to premium content" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon"><Icon size={20} /></div>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="join-travelers-card">
          <h4>Join 5,000+ Travelers</h4>
          <p>Discover amazing destinations across Bihar, create wishlists, and connect with fellow explorers.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

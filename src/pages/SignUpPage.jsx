// src/pages/SignUpPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Heart, MapPin, Globe, Star, User, Mail, Lock } from "lucide-react";
import { supabase } from "../supabaseClient";
import "./AuthPage.css";

// ✅ Validation Schema
const schema = yup.object().shape({
  fullName: yup.string().min(3, "Full name must be at least 3 characters").required("Full name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
  agreeToTerms: yup.bool().oneOf([true], "You must agree to the Terms"),
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // ✅ Handle signup with Supabase
  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName }, // store custom field
        },
      });

      if (error) {
        alert(error.message); // show Supabase error (like "User already exists")
        return;
      }

      alert("🎉 Account created! Please check your email to verify.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  // ✅ Right panel content
  const benefits = [
    { icon: Heart, text: "Save favorite destinations" },
    { icon: MapPin, text: "Create personal wishlists" },
    { icon: Globe, text: "Sync across all devices" },
    { icon: Star, text: "Access to premium content" },
  ];

  return (
    <div className="auth-page">
      {/* Left section */}
      <div className="auth-left">
        <div className="auth-box">
          <h2 className="auth-title">Join TravelExplorer</h2>
          <p className="auth-subtitle">Create your account and start discovering destinations</p>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Full Name */}
            <div className="input-group">
              <User className="input-icon" size={18} />
              <input type="text" placeholder="Full Name" {...register("fullName")} />
              {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input type="email" placeholder="Email Address" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input type="password" placeholder="Password" {...register("password")} />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="terms">
              <input type="checkbox" {...register("agreeToTerms")} />
              <span>
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </span>
            </div>
            {errors.agreeToTerms && <p className="error-text">{errors.agreeToTerms.message}</p>}

            <button type="submit" className="auth-btn">Create Account</button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right section */}
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
        {/* Join Travelers Card */}
        <div className="join-travelers-card">       <h4>Join 10,000+ Travelers</h4>
          <p>
            Discover amazing destinations, create wishlists, and connect with travelers worldwide.
          </p>
          <div className="social-icons">
            <button className="social-btn fb">f</button>
            <button className="social-btn google">G</button>
            <button className="social-btn twitter">t</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import AuthPage from "./AuthPage";
// // import "./SignUpPage.css";
// import "./AuthPage.css";
// import { Heart, MapPin, Globe, Star, User, Mail, Lock } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// // ✅ Validation Schema
// const schema = yup.object().shape({
//   fullName: yup
//     .string()
//     .min(3, "Full name must be at least 3 characters")
//     .required("Full name is required"),
//   email: yup
//     .string()
//     .email("Enter a valid email")
//     .required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("password")], "Passwords must match")
//     .required("Confirm your password"),
//   agreeToTerms: yup.bool().oneOf([true], "You must agree to the Terms"),
// });

// const SignUpPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange", // ✅ real-time validation
//   });

//   const benefits = [
//     { icon: Heart, text: "Save favorite destinations" },
//     { icon: MapPin, text: "Create personal wishlists" },
//     { icon: Globe, text: "Sync across all devices" },
//     { icon: Star, text: "Access to premium content" },
//   ];

//   const onSubmit = (data) => {
//     const dummyUser = { id: Date.now(), name: data.fullName, email: data.email };
//     login(dummyUser);
//     navigate("/");
//   };

//   // ✅ Signup form only
// const form = (
//   <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
//     {/* Full Name */}
//     <div className="input-group">
//       <User className="input-icon" size={18} />
//       <input
//         type="text"
//         placeholder="Full Name"
//         {...register("fullName")}
//       />
//       {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
//     </div>

//     {/* Email */}
//     <div className="input-group">
//       <Mail className="input-icon" size={18} />
//       <input
//         type="email"
//         placeholder="Email Address"
//         {...register("email")}
//       />
//       {errors.email && <p className="error-text">{errors.email.message}</p>}
//     </div>

//     {/* Password */}
//     <div className="input-group">
//       <Lock className="input-icon" size={18} />
//       <input
//         type="password"
//         placeholder="Password"
//         {...register("password")}
//       />
//       {errors.password && <p className="error-text">{errors.password.message}</p>}
//     </div>

//     {/* Confirm Password */}
//     <div className="input-group">
//       <Lock className="input-icon" size={18} />
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         {...register("confirmPassword")}
//       />
//       {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
//     </div>

//     {/* Terms */}
//     <div className="terms">
//       <input type="checkbox" {...register("agreeToTerms")} />
//       <span>
//         I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
//       </span>
//     </div>
//     {errors.agreeToTerms && <p className="error-text">{errors.agreeToTerms.message}</p>}

//     {/* Submit */}
//     <button type="submit" className="auth-btn">Create Account</button>

//     <p className="auth-switch">
//       Already have an account? <Link to="/login">Sign in here</Link>
//     </p>
//   </form>
// );

//   // ✅ Right panel with benefits + join travelers card
//   const rightPanel = (
//     <div className="signup-benefits">
//       <h3>What you'll get</h3>
//       {benefits.map(({ icon: Icon, text }, i) => (
//         <div key={i} className="benefit-card">
//           <div className="benefit-icon"><Icon size={20} /></div>
//           <span>{text}</span>
//         </div>
//       ))}

//       {/* Join Travelers Card */}
//       <div className="join-travelers-card">
//         <h4>Join 10,000+ Travelers</h4>
//         <p>
//           Discover amazing destinations, create wishlists, and connect with travelers worldwide.
//         </p>
//         <div className="social-icons">
//           <button className="social-btn fb">f</button>
//           <button className="social-btn google">G</button>
//           <button className="social-btn twitter">t</button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <AuthPage
//       title="Join TravelExplorer"
//       subtitle="Create your account and start discovering destinations"
//       rightPanel={rightPanel}
//     >
//       {form}
//     </AuthPage>
//   );
// };

// export default SignUpPage;

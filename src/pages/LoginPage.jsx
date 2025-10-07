// src/pages/LoginPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, Lock, Heart, MapPin, Globe, Star } from "lucide-react";
import "./AuthPage.css";
import { useAuth } from "../context/AuthContext";

// ✅ Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        alert(error.message); // show Supabase error (e.g., invalid login)
        return;
      }

      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Unexpected error, please try again.");
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to continue your journey with ViharVista</p>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Email */}
            <div className="input-group">
              <span className="input-icon"><Mail size={18} /></span>
              <input type="email" placeholder="Email address" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Password */}
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
      </div>
    </div>
  );
};

export default LoginPage;



// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Mail, Lock, Heart, MapPin, Globe, Star } from "lucide-react";
// import "./AuthPage.css";
// import { useAuth } from "../context/AuthContext";

// // ✅ Validation schema
// const schema = yup.object().shape({
//   email: yup.string().email("Invalid email address").required("Email is required"),
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const LoginPage = () => {
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

//   const onSubmit = (data) => {
//     console.log("Login data:", data);
//     login({ id: Date.now(), email: data.email });
//     navigate("/");
//   };

//   // ✅ Right panel same as SignUpPage
//   const benefits = [
//     { icon: Heart, text: "Save favorite destinations" },
//     { icon: MapPin, text: "Create personal wishlists" },
//     { icon: Globe, text: "Sync across all devices" },
//     { icon: Star, text: "Access to premium content" },
//   ];

//   const rightPanel = (
//     <div className="signup-benefits">
//       <h3>What you'll get</h3>
//       {benefits.map(({ icon: Icon, text }, i) => (
//         <div key={i} className="benefit-card">
//           <div className="benefit-icon">
//             <Icon size={20} />
//           </div>
//           <span>{text}</span>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="auth-page">
//       {/* Left section - Login form */}
//       <div className="auth-left">
//         <div className="auth-box">
//           <h2 className="auth-title">Welcome Back</h2>
//           <p className="auth-subtitle">
//             Login to continue your journey with TravelExplorer
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
//             {/* Email */}
//             <div className="input-group">
//               <span className="input-icon">
//                 <Mail size={18} />
//               </span>
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <p className="error-text">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="input-group">
//               <span className="input-icon">
//                 <Lock size={18} />
//               </span>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 {...register("password")}
//               />
//               {errors.password && (
//                 <p className="error-text">{errors.password.message}</p>
//               )}
//             </div>

//             <button type="submit" className="auth-btn">
//               Login
//             </button>
//           </form>

//           <div className="auth-switch">
//             Don’t have an account?{" "}
//             <Link to="/signup">Sign up here</Link>
//           </div>
//         </div>
//       </div>

//       {/* Right section */}
//       <div className="auth-right">{rightPanel}</div>
//     </div>
//   );
// };

// export default LoginPage;

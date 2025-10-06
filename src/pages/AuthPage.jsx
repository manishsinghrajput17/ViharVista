import React from "react";
import "./AuthPage.css";

const AuthPage = ({ title, subtitle, children, rightPanel }) => {
  return (
    <div className="auth-page">
      {/* Left Side: Signup/Login Form */}
      <div className="auth-left">
        <div className="auth-box">
          <h2 className="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>

      {/* Right Side: Benefits + Join Travelers */}
      <div className="auth-right">
        {rightPanel}
      </div>
    </div>
  );
};

export default AuthPage;

// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Get current session & subscribe to auth changes
  useEffect(() => {
  let mounted = true;

  const init = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();  // ✅ fix typo
        setRole(data?.role ?? null);
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      if (mounted) setAuthLoading(false);
    }
  };

  init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  const currentUser = session?.user ?? null;
  setUser(currentUser);

  if (currentUser) {
    supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle()    // ✅ fix typo here
      .then(({ data }) => setRole(data?.role ?? null));
  } else {
    setRole(null);
  }
});

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Signup
  const signUp = async (email, password, full_name) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    // Insert into users table
    const { error: dbError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          full_name,
          role: "user",
        },
      ]);
    if (dbError) throw dbError;

    return authData;
  };

  // ✅ Signin
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // ✅ Signout
  const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  setUser(null);
  setRole(null);
};


  return (
    <AuthContext.Provider value={{ user, role, authLoading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



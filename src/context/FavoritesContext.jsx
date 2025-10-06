// src/context/FavoritesContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const FavoritesContext = createContext();
const LS_KEY = "travel_explorer_favorites";

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // load favorites: from DB if user, else from localStorage
  useEffect(() => {
    let mounted = true;

    const loadLocal = () => {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (mounted) setFavorites(stored);
    };

    const loadFromDb = async (uid) => {
      try {
        // get destination_ids from favorites table
        const { data: favRows, error: favErr } = await supabase
          .from("favorites")
          .select("destination_id")
          .eq("user_id", uid);

        if (favErr) {
          console.error("Error loading favorites:", favErr);
          return;
        }

        const ids = (favRows || []).map((r) => r.destination_id);
        if (ids.length === 0) {
          if (mounted) setFavorites([]);
          return;
        }

        const { data: dests, error: destErr } = await supabase
          .from("destinations")
          .select("*")
          .in("id", ids);

        if (destErr) {
          console.error("Error fetching favorite destinations:", destErr);
          if (mounted) setFavorites([]);
          return;
        }

        if (mounted) setFavorites(dests || []);
      } catch (err) {
        console.error("loadFromDb error:", err);
      }
    };

    if (user?.id) {
      loadFromDb(user.id);
    } else {
      loadLocal();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  // On login: migrate local favorites to DB (merge)
  useEffect(() => {
    const tryMigrate = async () => {
      if (!user?.id) return;
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (!stored.length) return;

      // get existing destination_ids for the user
      const { data: existing, error: existingErr } = await supabase
        .from("favorites")
        .select("destination_id")
        .eq("user_id", user.id);

      if (existingErr) {
        console.error("Error reading existing favorites:", existingErr);
        return;
      }
      const existingIds = new Set((existing || []).map((r) => r.destination_id));

      const toInsert = stored
        .filter((s) => !existingIds.has(s.id))
        .map((s) => ({ user_id: user.id, destination_id: s.id }));

      if (!toInsert.length) {
        localStorage.removeItem(LS_KEY);
        return;
      }

      const { error: insertErr } = await supabase.from("favorites").insert(toInsert);
      if (insertErr) {
        console.error("Error inserting migrated favorites:", insertErr);
        return;
      }
      // clear local cache after successful merge
      localStorage.removeItem(LS_KEY);

      // reload favorites from DB
      const { data: dests } = await supabase.from("destinations").select("*").in("id", toInsert.map(i => i.destination_id));
      setFavorites((prev) => {
        const merged = [...(prev || []), ...(dests || [])];
        // dedupe by id
        const dedup = Array.from(new Map(merged.map(d => [d.id, d])).values());
        return dedup;
      });
    };

    tryMigrate();
  }, [user]);

  const addFavorite = async (destination) => {
    // Not logged in -> localStorage + redirect to signup
    if (!user) {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (!stored.some((d) => d.id === destination.id)) {
        const updated = [...stored, destination];
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
        setFavorites(updated);
      }
      navigate("/signup");
      return;
    }

    // Logged in -> insert into DB and update state
    try {
      const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, destination_id: destination.id }]);

      if (error) {
        // if unique constraint error, ignore
        if (error.code === "23505") {
          return;
        }
        console.error("addFavorite error:", error);
        return;
      }
      setFavorites((prev) => {
        if (prev.some((d) => d.id === destination.id)) return prev;
        return [...prev, destination];
      });
    } catch (err) {
      console.error("addFavorite catch:", err);
    }
  };

  const removeFavorite = async (destinationId) => {
    if (!user) {
      const updated = favorites.filter((fav) => fav.id !== destinationId);
      setFavorites(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: user.id, destination_id: destinationId });

    if (error) {
      console.error("removeFavorite error:", error);
      return;
    }

    setFavorites((prev) => prev.filter((fav) => fav.id !== destinationId));
  };

  const isFavorite = (destinationId) => favorites.some((fav) => fav.id === destinationId);

  const value = { favorites, addFavorite, removeFavorite, isFavorite };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};


// // src/context/FavoritesContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";
// import { useNavigate } from "react-router-dom";

// const FavoritesContext = createContext();

// export const FavoritesProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [favorites, setFavorites] = useState([]);
//   const navigate = useNavigate();

//   const LS_KEY = "travel_explorer_favorites";

//   useEffect(() => {
//     const load = () => {
//       const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
//       setFavorites(stored);
//     };
//     load();
//   }, [user]);

//   const addFavorite = (destination) => {
//     // If no user → store locally and redirect to signup
//     if (!user) {
//       const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
//       if (!stored.some((d) => d.id === destination.id)) {
//         const updated = [...stored, destination];
//         localStorage.setItem(LS_KEY, JSON.stringify(updated));
//         setFavorites(updated);
//       }
//       navigate("/signup");
//       return;
//     }

//     // If logged in → normal add
//     if (!favorites.some((d) => d.id === destination.id)) {
//       const updated = [...favorites, destination];
//       setFavorites(updated);
//       localStorage.setItem(LS_KEY, JSON.stringify(updated));
//     }
//   };

//   const removeFavorite = (destinationId) => {
//     const updated = favorites.filter((fav) => fav.id !== destinationId);
//     setFavorites(updated);
//     localStorage.setItem(LS_KEY, JSON.stringify(updated));
//   };

//   const isFavorite = (destinationId) =>
//     favorites.some((fav) => fav.id === destinationId);

//   const value = { favorites, addFavorite, removeFavorite, isFavorite };

//   return (
//     <FavoritesContext.Provider value={value}>
//       {children}
//     </FavoritesContext.Provider>
//   );
// };

// export const useFavorites = () => {
//   const context = useContext(FavoritesContext);
//   if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
//   return context;
// };


import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabaseClient";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // store full destination objects

  // Load favorites on login
  useEffect(() => {
    if (!user?.id) return setFavorites([]);
    const loadFavorites = async () => {
      const { data: favRows } = await supabase
        .from("favorites")
        .select("destination_id")
        .eq("user_id", user.id);

      if (!favRows) return setFavorites([]);

      const ids = favRows.map(f => f.destination_id);
      if (!ids.length) return setFavorites([]);

      const { data: dests } = await supabase
        .from("destinations")
        .select("*")
        .in("id", ids);

      setFavorites(dests || []);
    };
    loadFavorites();
  }, [user]);

  const isFavorite = (destinationId) => favorites.some(fav => fav.id === destinationId);

  const addFavorite = async (destination) => {
    if (!user || user.role === "admin") return; // block admin
    if (favorites.some(fav => fav.id === destination.id)) return;

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: user.id, destination_id: destination.id }]);

    if (!error) setFavorites(prev => [...prev, destination]);
  };

  const removeFavorite = async (destinationId) => {
    if (!user || user.role === "admin") return; // block admin
    if (!favorites.some(fav => fav.id === destinationId)) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: user.id, destination_id: destinationId });

    if (!error) setFavorites(prev => prev.filter(fav => fav.id !== destinationId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

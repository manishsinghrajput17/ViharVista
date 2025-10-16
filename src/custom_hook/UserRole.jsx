import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useUserRole() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data) setRole(data.role);
    }
    getRole();
  }, []);

  return role;
}

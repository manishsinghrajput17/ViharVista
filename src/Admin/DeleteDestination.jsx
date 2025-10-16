// src/Admin/deleteDestination.js
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

/**
 * Reusable function to delete a destination by id
 * @param {string} id - Destination ID to delete
 * @param {function} onSuccess - Callback after successful deletion
 */
export const deleteDestination = async (id, onSuccess) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    const { error } = await supabase.from("destinations").delete().eq("id", id);

    if (error) {
      Swal.fire("Error!", "Failed to delete destination.", "error");
    } else {
      Swal.fire("Deleted!", "Destination has been removed.", "success").then(() => {
        if (onSuccess) onSuccess();
      });
    }
  }
};

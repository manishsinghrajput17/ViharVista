import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import styles from "./EditDestinationPage.module.css"; // reuse Add page CSS
import { categories } from "../data/dummyCategories";
import { deleteDestination } from "./DeleteDestination";


const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  location: yup.string().required("Location is required"),
  latitude: yup.number().typeError("Latitude must be a number").required("Latitude is required"),
  longitude: yup.number().typeError("Longitude must be a number").required("Longitude is required"),
  rating: yup.number().typeError("Rating must be a number").required("Rating is required"),
  entry_fee: yup.string().required("Entry fee is required"),
  timings: yup.string().required("Timings are required"),
  official_link: yup.string().required("Official link is required"),
  images: yup.string()
    .required("At least one image URL is required")
    .test("is-url-list", "Must be comma-separated URLs starting with http", (value) =>
      value.split(",").every((url) => url.trim().startsWith("http"))
    ),
});

const EditDestinationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchDestination = async () => {
      const { data, error } = await supabase.from("destinations").select("*").eq("id", id).single();
      if (!error && data) {
        Object.keys(data).forEach((key) => {
          setValue(key, key === "images" && Array.isArray(data[key]) ? data[key].join(",") : data[key]);
        });
      }
    };
    fetchDestination();
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    const updatedData = {
      ...formData, 
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      rating: parseFloat(formData.rating), 
      images: formData.images.split(",").map((url) => url.trim())
    };

    Swal.fire({
      title: "Updating Destination...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const { error } = await supabase.from("destinations").update(updatedData).eq("id", id);
    Swal.close();

    if (error) Swal.fire("Error", "Failed to update destination.", "error");
    else Swal.fire("Updated!", "Destination details saved.", "success").then(() => navigate("/admin-dashboard"));
  };

  const handleDeleteBtn = () => {
    deleteDestination(id, () => navigate("/admin-dashboard"));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Destination</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        {/* Row 1: Name, Location, Category */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Name <span className={styles.required}>*</span></label>
            <input {...register("name")} placeholder="Destination Name" />
            <p className={styles.error}>{errors.name?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Location <span className={styles.required}>*</span></label>
            <input {...register("location")} placeholder="Location" />
            <p className={styles.error}>{errors.location?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Category <span className={styles.required}>*</span></label>
            <select {...register("category")}>
              <option value="">Select Category</option>
              {categories.map(({ name }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <p className={styles.error}>{errors.category?.message}</p>
          </div>
        </div>

        {/* Row 2: Description */}
        <div className={styles.rowFull}>
          <label>Description <span className={styles.required}>*</span></label>
          <textarea {...register("description")} placeholder="Description" />
          <p className={styles.error}>{errors.description?.message}</p>
        </div>

        {/* Row 3: Latitude, Longitude, Rating */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Latitude <span className={styles.required}>*</span></label>
            <input {...register("latitude")} placeholder="Latitude" />
            <p className={styles.error}>{errors.latitude?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Longitude <span className={styles.required}>*</span></label>
            <input {...register("longitude")} placeholder="Longitude" />
            <p className={styles.error}>{errors.longitude?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Rating <span className={styles.required}>*</span></label>
            <input {...register("rating")} placeholder="Rating" />
            <p className={styles.error}>{errors.rating?.message}</p>
          </div>
        </div>

        {/* Row 4: Entry Fee, Timings, Official Link */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>Entry Fee <span className={styles.required}>*</span></label>
            <input {...register("entry_fee")} placeholder="Entry Fee" />
            <p className={styles.error}>{errors.entry_fee?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Timings <span className={styles.required}>*</span></label>
            <input {...register("timings")} placeholder="Timings" />
            <p className={styles.error}>{errors.timings?.message}</p>
          </div>
          <div className={styles.col}>
            <label>Official Link <span className={styles.required}>*</span></label>
            <input {...register("official_link")} placeholder="Official Link" />
            <p className={styles.error}>{errors.official_link?.message}</p>
          </div>
        </div>

        {/* Row 5: Images */}
        <div className={styles.rowFull}>
          <label>Images (comma-separated URLs) <span className={styles.required}>*</span></label>
          <input {...register("images")} placeholder="url1,url2,url3" />
          <p className={styles.error}>{errors.images?.message}</p>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.updateBtn}>Update</button>
          <button type="button" className={styles.DeleteBtn} onClick={handleDeleteBtn}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default EditDestinationPage;

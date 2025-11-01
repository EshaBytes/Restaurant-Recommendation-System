import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useDebounce } from "use-debounce";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    cuisine: "",
    city: "",
    rating: "",
    image: "",
    address: "",
    description: "",
  });
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = async (p = page) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/restaurants?page=${p}&limit=10`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data?.restaurants) {
        setRestaurants(res.data.restaurants);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Failed to load restaurants!");
    }
  };

  const searchRestaurants = async (query) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/restaurants/admin/search?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data?.restaurants) {
        setRestaurants(res.data.restaurants);
        setTotalPages(1);
        setPage(1);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error searching restaurants:", error);
      toast.error("Failed to search restaurants!");
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== "admin") {
      toast.error("Access denied!");
      navigate("/login");
      return;
    }

    if (debouncedSearch) {
      searchRestaurants(debouncedSearch);
    } else {
      fetchRestaurants(page);
    }
  }, [page, currentUser, debouncedSearch, navigate]);

  const handleAdd = async () => {
    if (
      !newRestaurant.name ||
      !newRestaurant.cuisine ||
      !newRestaurant.address ||
      !newRestaurant.description
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/restaurants",
        newRestaurant,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        toast.success("✅ Restaurant added!");
        setNewRestaurant({
          name: "",
          cuisine: "",
          city: "",
          address: "",
          description: "",
          rating: "",
          image: "",
        });
        fetchRestaurants();
      } else {
        toast.error(res.data.message || "Error adding restaurant");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while adding restaurant!");
    }
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setNewRestaurant({
      ...restaurant,
      address:
        typeof restaurant.address === "object"
          ? restaurant.address.street ||
            restaurant.address.full ||
            JSON.stringify(restaurant.address)
          : restaurant.address || "",
      city:
        restaurant.city ||
        restaurant.address?.city ||
        restaurant.zomatoData?.locality ||
        "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/restaurants/${editingRestaurant._id}`,
        newRestaurant,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("✅ Restaurant updated!");
      setEditingRestaurant(null);
      setNewRestaurant({
        name: "",
        cuisine: "",
        city: "",
        address: "",
        description: "",
        rating: "",
        image: "",
      });
      fetchRestaurants();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update restaurant!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      toast.info("🗑️ Restaurant deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete restaurant!");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5>
            {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {[
              "name",
              "cuisine",
              "city",
              "address",
              "description",
              "rating",
              "image",
            ].map((field) => (
              <div className="col-md-4" key={field}>
                <input
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="form-control"
                  value={newRestaurant[field] || ""}
                  onChange={(e) =>
                    setNewRestaurant({
                      ...newRestaurant,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          {editingRestaurant ? (
            <button className="btn btn-warning mt-3" onClick={handleUpdate}>
              🔁 Update Restaurant
            </button>
          ) : (
            <button className="btn btn-success mt-3" onClick={handleAdd}>
              ➕ Add Restaurant
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Restaurant List</h5>
        </div>
        <div className="card-body">
          <input
            type="text"
            placeholder="🔍 Search by name or city..."
            className="form-control mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {restaurants.length === 0 ? (
            <p>No restaurant found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>City</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>
                      {Array.isArray(r.cuisine)
                        ? r.cuisine.join(", ")
                        : r.cuisine}
                    </td>
                    <td>
                      {r.city ||
                        r.address?.city ||
                        r.zomatoData?.locality ||
                        "—"}
                    </td>
                    <td>{r.rating || "—"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(r)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r._id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-secondary me-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ◀ Prev
            </button>
            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary ms-2"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

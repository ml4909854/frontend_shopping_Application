import React, { useEffect, useState } from "react";
import "./Signup.css";
import Spinner from "../Spinner/Spinner.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
        form
      );

      if (res.status === 201) {
        alert(`${form.name} Registered successfully!`);
        navigate("/login")
      }

      // Reset form
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Signup failed!");
      } else {
        alert("Something went wrong. Try again.");
      }
      console.error("Signup Error:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

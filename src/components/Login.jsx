import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/user/login-password", {
        identifier,
        password,
      });

      const { token, user } = response.data;

      // Store user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("userId", user.id);

      console.log("Login successful!");
      window.location.href = "/home"; // Redirect after login
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <StyledWrapper>
      <section className="h-80 gradient-form">
        <div className="container py-5 h-50">
          <div className="row d-flex justify-content-center align-items-center h-60">
            <div className="col-xl-10 rounded-3">
              <div className="card rounded-5 text-black" style={{ border: "none" }}>
                <div className="row g-0" style={{ backgroundColor: "#010101" }}>
                  <div className="col-lg-0">
                    <div
                      className="card-body mx-md-6"
                      style={{
                        backgroundColor: "#010101",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="text-center">
                        <img src="/images/logo.png" style={{ width: "255px" }} alt="logo" />
                      </div>

                      <form
                        onSubmit={handleLogin}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                            fontFamily: "'Montserrat', sans-serif",
                            marginTop: "-30px",
                            textAlign: "center",
                          }}
                        >
                          Please login to your account
                        </p>

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <div className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="identifier"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: "#0ffaf3" }}
                          >
                            Phone or Email
                          </label>
                          <input
                            type="text"
                            id="identifier"
                            className="form-control"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              backgroundColor: "#14151c",
                              borderColor: "#9dfcfa",
                              color: "#fff",
                              borderRadius: "15px",
                              padding: "10px",
                            }}
                            placeholder="Phone number or email address"
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="password"
                            style={{ fontFamily: "'Montserrat', sans-serif", color: "#0ffaf3" }}
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              backgroundColor: "#14151c",
                              borderColor: "#9dfcfa",
                              color: "#fff",
                              borderRadius: "15px",
                              padding: "10px",
                            }}
                          />
                        </div>

                        <div className="text-center pt-1 mb-5 pb-1" style={{display:"flex",flexDirection:"column"}}>
                          <button
                            className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                            type="submit"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Log in
                          </button>
                          <a className="text-muted" href="#!" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Forgot password?
                          </a>
                        </div>

                        <div className="d-flex align-items-center justify-content-center pb-4">
                          <p className="mb-0 me-2" style={{ color: "white" }}>
                            Don't have an account?
                          </p>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Create new
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div``;

export default Login;

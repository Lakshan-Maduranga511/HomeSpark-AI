// src/contexts/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("homespark_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  //  Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //  Enhanced register with detailed validation
  const register = (email, password, name, confirmPassword) => {
    // All fields empty
    if (!email && !password && !name && !confirmPassword) {
      throw new Error(
        "All fields are required. Please fill in all information."
      );
    }

    // Individual field checks
    if (!name || name.trim() === "") {
      throw new Error("Name is required. Please enter your full name.");
    }

    if (!email || email.trim() === "") {
      throw new Error("Email is required. Please enter your email address.");
    }

    if (!password || password.trim() === "") {
      throw new Error("Password is required. Please create a password.");
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      throw new Error("Please confirm your password.");
    }

    // Email format validation
    if (!isValidEmail(email)) {
      throw new Error(
        "Invalid email format. Please enter a valid email address (e.g., user@example.com)."
      );
    }

    // Password strength validation
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // Password match validation
    if (password !== confirmPassword) {
      throw new Error(
        "Passwords do not match. Please make sure both passwords are identical."
      );
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("homespark_users") || "[]");
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(
        "This email is already registered. Please use a different email or try logging in."
      );
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      savedRecommendations: [],
    };

    users.push(newUser);
    localStorage.setItem("homespark_users", JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem("homespark_user", JSON.stringify(userWithoutPassword));

    return {
      success: true,
      message: "Account created successfully! Welcome to HomeSpark.",
    };
  };

  //  Enhanced login with detailed validation
  const login = (email, password) => {
    // Both fields empty
    if (!email && !password) {
      throw new Error(
        "Email and password are required. Please fill in both fields."
      );
    }

    // Individual field checks
    if (!email || email.trim() === "") {
      throw new Error("Email is required. Please enter your email address.");
    }

    if (!password || password.trim() === "") {
      throw new Error("Password is required. Please enter your password.");
    }

    // Email format validation
    if (!isValidEmail(email)) {
      throw new Error(
        "Invalid email format. Please enter a valid email address."
      );
    }

    // Find user
    const users = JSON.parse(localStorage.getItem("homespark_users") || "[]");
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // User not found
    if (!foundUser) {
      throw new Error(
        "No account found with this email. Please check your email or sign up."
      );
    }

    // Password incorrect
    if (foundUser.password !== password) {
      throw new Error(
        "Incorrect password. Please try again or reset your password."
      );
    }

    // Success - login user
    const userWithoutPassword = { ...foundUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem("homespark_user", JSON.stringify(userWithoutPassword));

    return { success: true, message: `Welcome back, ${foundUser.name}!` };
  };

  // ✅ Enhanced logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("homespark_user");
    return { success: true, message: "You have been logged out successfully." };
  };

  const saveRecommendation = (recommendation) => {
    if (!user) {
      throw new Error("Must be logged in to save recommendations");
    }

    const users = JSON.parse(localStorage.getItem("homespark_users") || "[]");
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const savedRec = {
      ...recommendation,
      savedAt: new Date().toISOString(),
      savedId: `saved_${Date.now()}`,
    };

    const alreadySaved = users[userIndex].savedRecommendations.find(
      (r) => r.id === recommendation.id
    );

    if (alreadySaved) {
      throw new Error("Already saved this recommendation");
    }

    users[userIndex].savedRecommendations.push(savedRec);
    localStorage.setItem("homespark_users", JSON.stringify(users));

    const updatedUser = {
      ...user,
      savedRecommendations: users[userIndex].savedRecommendations,
    };
    setUser(updatedUser);
    localStorage.setItem("homespark_user", JSON.stringify(updatedUser));

    return savedRec;
  };

  const removeSavedRecommendation = (savedId) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem("homespark_users") || "[]");
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) return;

    users[userIndex].savedRecommendations = users[
      userIndex
    ].savedRecommendations.filter((r) => r.savedId !== savedId);

    localStorage.setItem("homespark_users", JSON.stringify(users));

    const updatedUser = {
      ...user,
      savedRecommendations: users[userIndex].savedRecommendations,
    };
    setUser(updatedUser);
    localStorage.setItem("homespark_user", JSON.stringify(updatedUser));
  };

  const getSavedRecommendations = () => {
    return user?.savedRecommendations || [];
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    saveRecommendation,
    removeSavedRecommendation,
    getSavedRecommendations,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

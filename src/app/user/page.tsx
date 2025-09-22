"use client";
import React from "react";
import UserDashboard from "../../components/userDashboard";
import { Provider } from "react-redux";
import { store } from "../../store/store";

export default function UserDashboardPage() {
  return (
    <Provider store={store}>
      <UserDashboard />
    </Provider>
  );
}

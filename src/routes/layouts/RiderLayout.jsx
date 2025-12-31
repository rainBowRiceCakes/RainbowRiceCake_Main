import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { reissueThunk } from "../../store/thunks/authThunk.js";
import "./RiderLayout.css";

export default function RiderLayout() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(reissueThunk()).unwrap();
      } catch (e) {
        // Handle error if needed, e.g., redirect to login
        console.error("Failed to reissue token:", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rider-shell">
      <div className="rider-container">
        <Outlet />
      </div>
    </div>
  );
}
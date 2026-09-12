import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { userToken } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) return;
    api
      .get("/user/purchases", { headers: { authorization: userToken } })
      .then((res) => setPurchases(res.data.purchases))
      .finally(() => setLoading(false));
  }, [userToken]);

  if (!userToken) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="font-serif text-4xl text-ink">My courses</h1>

      <div className="mt-10 border-t border-line">
        {loading && <p className="py-8 font-sans text-ink/60">Loading…</p>}

        {!loading && purchases.length === 0 && (
          <p className="py-8 font-sans text-ink/60">
            You haven't purchased anything yet — browse the catalogue to get started.
          </p>
        )}

        {purchases.map((p) => (
          <div key={p._id} className="border-b border-line py-4 font-sans text-sm text-ink/80">
            Course ID: {p.courseId}
          </div>
        ))}
      </div>
    </div>
  );
}

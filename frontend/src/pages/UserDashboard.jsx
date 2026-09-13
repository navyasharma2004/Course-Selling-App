import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
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
            You haven't purchased anything yet —{" "}
            <Link to="/" className="text-indigo underline underline-offset-4">
              browse the catalogue
            </Link>{" "}
            to get started.
          </p>
        )}

        {purchases.map((p) => {
          const course = p.courseId; // populated by the backend
          if (!course) return null;
          return (
            <div
              key={p._id}
              className="border-b border-line py-5 flex items-center gap-5"
            >
              {course.imageLink && (
                <img
                  src={course.imageLink}
                  alt={course.title}
                  className="w-20 h-20 object-cover border border-line shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-serif text-lg text-ink">{course.title}</p>
                <p className="font-sans text-xs text-ink/50 mt-1">
                  {course.videos?.length || 0} lesson{course.videos?.length === 1 ? "" : "s"}
                </p>
              </div>
              <Link
                to={`/learn/${course._id}`}
                className="font-sans text-sm border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors shrink-0"
              >
                Continue learning
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

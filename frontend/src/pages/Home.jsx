import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState({}); // courseId -> "buying" | "done" | "error"
  const { userToken } = useAuth();

  useEffect(() => {
    api
      .get("/course/preview")
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  async function handlePurchase(courseId) {
    if (!userToken) return;
    setPurchaseStatus((s) => ({ ...s, [courseId]: "buying" }));
    try {
      await api.post(
        "/course/purchase",
        { courseId },
        { headers: { authorization: userToken } }
      );
      setPurchaseStatus((s) => ({ ...s, [courseId]: "done" }));
    } catch {
      setPurchaseStatus((s) => ({ ...s, [courseId]: "error" }));
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <p className="font-sans text-xs tracking-wide text-gold mb-2">
        {courses.length} course{courses.length === 1 ? "" : "s"} in the catalogue
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight max-w-xl">
        Learn something worth finishing.
      </h1>

      <div className="mt-12 border-t border-line">
        {loading && (
          <p className="py-8 font-sans text-ink/60">Loading the catalogue…</p>
        )}

        {!loading && courses.length === 0 && (
          <p className="py-8 font-sans text-ink/60">
            No courses published yet — check back soon.
          </p>
        )}

        {courses.map((course) => {
          const status = purchaseStatus[course._id];
          return (
            <div
              key={course._id}
              className="border-b border-line py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
            >
              {course.imageLink && (
                <img
                  src={course.imageLink}
                  alt={course.title}
                  className="w-full md:w-32 h-32 object-cover border border-line shrink-0"
                />
              )}

              <div className="flex-1">
                <h2 className="font-serif text-xl text-ink">{course.title}</h2>
                <p className="font-sans text-sm text-ink/60 mt-1 max-w-lg">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-serif text-lg text-gold">₹{course.price}</span>

                {!userToken && (
                  <Link
                    to="/login"
                    className="font-sans text-sm border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
                  >
                    Log in to buy
                  </Link>
                )}

                {userToken && status !== "done" && (
                  <button
                    onClick={() => handlePurchase(course._id)}
                    disabled={status === "buying"}
                    className="font-sans text-sm border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
                  >
                    {status === "buying" ? "Purchasing…" : "Buy course"}
                  </button>
                )}

                {status === "done" && (
                  <span className="font-sans text-sm text-green-800">Purchased ✓</span>
                )}
                {status === "error" && (
                  <span className="font-sans text-sm text-red-800">Try again</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

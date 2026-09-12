import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Banner from "../components/Banner";

const emptyForm = { title: "", description: "", price: "", imageLink: "" };

export default function AdminDashboard() {
  const { adminToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadCourses() {
    setLoading(true);
    api
      .get("/admin/courses/bulk", { headers: { authorization: adminToken } })
      .then((res) => setCourses(res.data.courses))
      .catch(() => setError("Could not load courses."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (adminToken) loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  if (!adminToken) return <Navigate to="/admin/login" replace />;

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(course) {
    setEditingId(course._id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price ?? "",
      imageLink: course.imageLink || "",
    });
    setSuccess("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const payload = { ...form, price: Number(form.price) };

    try {
      if (editingId) {
        await api.put(`/admin/course/${editingId}`, payload, {
          headers: { authorization: adminToken },
        });
        setSuccess("Course updated.");
      } else {
        await api.post("/admin/course", payload, {
          headers: { authorization: adminToken },
        });
        setSuccess("Course created.");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <p className="font-sans text-xs tracking-wide text-gold mb-2">Admin panel</p>
      <h1 className="font-serif text-4xl text-ink">Manage courses</h1>

      <div className="mt-10 grid md:grid-cols-[1fr_1.3fr] gap-12">
        {/* Form */}
        <div>
          <h2 className="font-serif text-xl text-ink mb-4">
            {editingId ? "Edit course" : "Add a new course"}
          </h2>

          <Banner type="error" message={error} />
          <Banner type="success" message={success} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={update("title")}
              className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
            />
            <textarea
              required
              placeholder="Description"
              value={form.description}
              onChange={update("description")}
              rows={4}
              className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink resize-none"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Price (₹)"
              value={form.price}
              onChange={update("price")}
              className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
            />
            <input
              placeholder="Image URL"
              value={form.imageLink}
              onChange={update("imageLink")}
              className="w-full border border-line bg-transparent px-3 py-2 font-sans text-sm focus:outline-none focus:border-ink"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo text-paper font-sans text-sm px-5 py-2.5 hover:bg-indigo-dark transition-colors"
              >
                {editingId ? "Save changes" : "Create course"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="font-sans text-sm text-ink/60 hover:text-ink px-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Course list */}
        <div>
          <h2 className="font-serif text-xl text-ink mb-4">
            {courses.length} published course{courses.length === 1 ? "" : "s"}
          </h2>

          <div className="border-t border-line">
            {loading && <p className="py-6 font-sans text-ink/60 text-sm">Loading…</p>}

            {!loading && courses.length === 0 && (
              <p className="py-6 font-sans text-ink/60 text-sm">No courses yet.</p>
            )}

            {courses.map((course) => (
              <div
                key={course._id}
                className="border-b border-line py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-base text-ink">{course.title}</p>
                  <p className="font-sans text-xs text-ink/60">₹{course.price}</p>
                </div>
                <button
                  onClick={() => startEdit(course)}
                  className="font-sans text-sm border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors shrink-0"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

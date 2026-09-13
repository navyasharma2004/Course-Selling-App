import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function CoursePlayer() {
  const { courseId } = useParams();
  const { userToken } = useAuth();
  const [course, setCourse] = useState(null);
  const [watchedIds, setWatchedIds] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!userToken) return;

    Promise.all([
      api.get(`/course/${courseId}/content`, { headers: { authorization: userToken } }),
      api.get(`/course/${courseId}/progress`, { headers: { authorization: userToken } }),
    ])
      .then(([contentRes, progressRes]) => {
        const c = contentRes.data.course;
        setCourse(c);
        setWatchedIds(progressRes.data.watchedVideoIds || []);
        if (c.videos && c.videos.length > 0) setActiveVideo(c.videos[0]);
      })
      .catch((err) => {
        setError(
          err.response?.status === 403
            ? "You haven't purchased this course."
            : "Could not load this course."
        );
      })
      .finally(() => setLoading(false));
  }, [courseId, userToken]);

  if (!userToken) return <Navigate to="/login" replace />;

  async function markComplete(video) {
    setMarking(true);
    try {
      const res = await api.post(
        `/course/${courseId}/progress`,
        { videoId: video._id },
        { headers: { authorization: userToken } }
      );
      setWatchedIds(res.data.watchedVideoIds);
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-14 font-sans text-ink/60">Loading…</div>;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-14">
        <p className="font-sans text-red-800 mb-4">{error}</p>
        <Link to="/" className="font-sans text-sm text-indigo underline underline-offset-4">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const total = course.videos?.length || 0;
  const doneCount = course.videos?.filter((v) => watchedIds.includes(v._id)).length || 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/my-courses" className="font-sans text-xs text-ink/50 hover:text-ink">
        ← My courses
      </Link>
      <h1 className="font-serif text-3xl text-ink mt-2">{course.title}</h1>
      <p className="font-sans text-xs text-ink/50 mt-1">
        {doneCount} of {total} lessons completed
      </p>

      {total === 0 ? (
        <p className="font-sans text-ink/60 mt-10">
          No video lessons have been added to this course yet.
        </p>
      ) : (
        <div className="mt-8 grid md:grid-cols-[1fr_320px] gap-8">
          {/* Player */}
          <div>
            <div className="aspect-video border border-line bg-black">
              {activeVideo && (
                <iframe
                  key={activeVideo._id}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {activeVideo && (
              <div className="mt-4 flex items-center justify-between">
                <h2 className="font-serif text-lg text-ink">{activeVideo.title}</h2>
                {watchedIds.includes(activeVideo._id) ? (
                  <span className="font-sans text-sm text-green-800">Completed ✓</span>
                ) : (
                  <button
                    onClick={() => markComplete(activeVideo)}
                    disabled={marking}
                    className="font-sans text-sm border border-ink px-4 py-1.5 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
                  >
                    Mark as complete
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Playlist */}
          <div className="border-t border-line">
            {course.videos.map((video, i) => {
              const isActive = activeVideo?._id === video._id;
              const isWatched = watchedIds.includes(video._id);
              return (
                <button
                  key={video._id}
                  onClick={() => setActiveVideo(video)}
                  className={`w-full text-left border-b border-line py-3 px-3 flex items-center gap-3 transition-colors ${
                    isActive ? "bg-ink text-paper" : "hover:bg-line/30"
                  }`}
                >
                  <span
                    className={`font-sans text-xs shrink-0 ${
                      isActive ? "text-paper/60" : "text-ink/40"
                    }`}
                  >
                    {isWatched ? "✓" : i + 1}
                  </span>
                  <span className="font-sans text-sm">{video.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

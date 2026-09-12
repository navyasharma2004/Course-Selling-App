import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userToken, adminToken, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-baseline justify-between">
        <Link to="/" className="font-serif text-2xl tracking-tight text-ink">
          Coursebound
        </Link>

        <nav className="flex items-baseline gap-6 font-sans text-sm">
          <Link to="/" className="text-ink/70 hover:text-ink transition-colors">
            Catalogue
          </Link>

          {userToken ? (
            <>
              <Link to="/my-courses" className="text-ink/70 hover:text-ink transition-colors">
                My courses
              </Link>
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/");
                }}
                className="text-ink/70 hover:text-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-ink/70 hover:text-ink transition-colors">
              Student login
            </Link>
          )}

          {adminToken ? (
            <>
              <Link to="/admin" className="text-indigo hover:text-indigo-dark transition-colors">
                Admin panel
              </Link>
              <button
                onClick={() => {
                  logoutAdmin();
                  navigate("/");
                }}
                className="text-ink/70 hover:text-ink transition-colors"
              >
                Admin log out
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="text-ink/50 hover:text-ink transition-colors">
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  return (
    <div className="bg-slate-50 py-4 z-30 w-full">
      <div className="flex justify-between mx-2">
        <div>
          <Link to="/" className="text-2xl font-bold">
            Vehicle Info
          </Link>
        </div>
        <div className="flex items-center mx-2">
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              to="/"
              className="px-2 text-xl text-blue-500 hover:text-blue-700 font-semibold"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

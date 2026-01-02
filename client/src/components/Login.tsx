import { useState } from "react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";
import { getErrorMessage } from "../utils/error";

export default function Login() {
  const { setShowLogin, axios, setToken, navigate, verifyAndFetchUser } = useAppContext();

  const [state, setState] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        if (state === "register") {
          toast.success("Account created. Please log in.");
          setState("login");
          setName("");
          setEmail("");
          setPassword("");
        } else {
          setToken(data.token);
          await verifyAndFetchUser(false);
          setShowLogin(false);
          toast.success("Login successful!");
          navigate("/");
          setEmail("");
          setPassword("");
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your full name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email address"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
            disabled={isLoading}
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => !isLoading && setState("login")}
              className={`text-primary ${
                !isLoading ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              Log in here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => !isLoading && setState("register")}
              className={`text-primary ${
                !isLoading ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              Sign up here
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { BASE_URL } from "../utils/api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`${BASE_URL}/api/auth/signin`, {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);

      console.log("TOKEN SAVED:", localStorage.getItem("token"));

      localStorage.setItem("token", data.token);
      dispatch(setUserData(data.user));
      setErr("");
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const { data } = await api.post(`${BASE_URL}/api/auth/google-auth`, {
        email: result.user.email,
        fullName: result.user.displayName,
      });

      localStorage.setItem("token", data.token);
      dispatch(setUserData(data.user));
    } catch (error) {
      console.log(error);
      setErr("Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#fff9f6] to-[#fff1ed]">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(255,77,45,0.08)] w-full max-w-md p-10 border border-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d2d] opacity-[0.03] rounded-full -mr-16 -mt-16"></div>

        <div className="text-center mb-10">
          <h1
            className="text-4xl font-black mb-3 tracking-tight"
            style={{ color: primaryColor }}
          >
            Vingo<span className="text-gray-800">.</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <FaEnvelope size={16} />
              </div>
              <input
                type="email"
                className="w-full bg-gray-50 rounded-2xl px-11 py-3.5 outline-none"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <FaLock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-gray-50 rounded-2xl px-11 py-3.5 outline-none"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {!showPassword ? (
                  <FaRegEye size={18} />
                ) : (
                  <FaRegEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-3 mb-8">
          <button
            className="text-sm font-bold text-[#ff4d2d]"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <button
          className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        {err && (
          <div className="mt-4 text-red-500 text-center text-sm">{err}</div>
        )}

        <div className="my-8 text-center text-gray-400 text-xs">
          OR CONTINUE WITH
        </div>

        <button
          className="w-full flex items-center justify-center gap-3 border rounded-2xl py-3"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={22} />
          <span>Google</span>
        </button>

        <p className="text-center mt-8 text-gray-500">
          New to Vingo?
          <span
            className="text-[#ff4d2d] font-bold ml-2 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

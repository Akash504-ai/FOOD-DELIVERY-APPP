import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
// import { BASE_URL } from "../utils/api";
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
      const { data } = await await api.post(`/api/auth/signin`, {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", data);
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

  // UI Design Constants
  const labelStyle =
    "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";
  const inputClass =
    "w-full bg-white/60 border border-gray-200 rounded-2xl px-11 py-4 outline-none transition-all focus:bg-white focus:border-[#ff4d2d] focus:ring-4 focus:ring-orange-100 shadow-sm placeholder:text-gray-300";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50 p-6">
      {/* Background Aesthetic Layers */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=2000"
          alt="Food Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      {/* Animated Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white p-8 md:p-12">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-black tracking-tighter mb-2"
            style={{ color: primaryColor }}
          >
            Foodigo<span className="text-gray-800">.</span>
          </h1>
          <p className="text-gray-500 font-medium italic">
            Your favorite meals, delivered fast.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="group relative">
            <label className={labelStyle}>Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors">
                <FaEnvelope size={18} />
              </div>
              <input
                type="email"
                className={inputClass}
                placeholder="hello@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="group relative">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className={labelStyle}>Password</label>
              <button
                type="button"
                className="text-xs font-bold text-[#ff4d2d] hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors">
                <FaLock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {err && (
          <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
            <p className="text-red-600 text-sm font-semibold">{err}</p>
          </div>
        )}

        {/* Sign In Button */}
        <div className="mt-8 space-y-4">
          <button
            className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff7b2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center text-lg"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Sign In"}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] w-full bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-300 whitespace-nowrap">
              OR
            </span>
            <div className="h-[1px] w-full bg-gray-100"></div>
          </div>

          {/* Google Button */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-gray-500 font-medium">
          New to Foodigo?
          <button
            className="text-[#ff4d2d] font-black ml-2 hover:underline underline-offset-4"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

import React, { useState } from "react";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc"; // Commented out Google Icon
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Commented out Firebase Auth
// import { auth } from "../../firebase"; // Commented out Firebase Config
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const primaryColor = "#ff4d2d";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await api.post("/api/auth/signup", {
        fullName,
        email,
        password,
        mobile,
        role,
      });

      localStorage.setItem("token", result.data.token);
      dispatch(setUserData(result.data.user));
      setErr("");
      
      // Optional: navigate("/dashboard");
    } catch (error) {
      console.log("SIGNUP ERROR:", error?.response?.data);
      setErr(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* // Commented out Google Authentication Logic
  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("Mobile number is required for Google Sign-up");
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const { data } = await api.post("/api/auth/google-auth", {
        fullName: result.user.displayName,
        email: result.user.email,
        role,
        mobile,
      });

      dispatch(setUserData(data));
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Google authentication failed");
    }
  };
  */

  // UI Enhancement Classes
  const inputWrapper = "relative group";
  const labelStyle = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1";
  const inputIcon = "absolute left-4 top-[42px] text-gray-400 transition-colors group-focus-within:text-[#ff4d2d]";
  const inputClass = "w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:border-[#ff4d2d] focus:ring-4 focus:ring-orange-100 placeholder-gray-300 shadow-sm";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
            alt="food background" 
            className="w-full h-full object-cover"
         />
      </div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg p-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Join <span className="text-[#ff4d2d]">Foodigo</span><span className="text-gray-800">.</span>
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Deliciousness is just a sign-up away</p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className={inputWrapper}>
              <label className={labelStyle}>Full Name</label>
              <FaUser className={inputIcon} />
              <input
                type="text"
                placeholder="John Doe"
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email & Mobile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={inputWrapper}>
                <label className={labelStyle}>Email Address</label>
                <FaEnvelope className={inputIcon} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={inputWrapper}>
                <label className={labelStyle}>Phone Number</label>
                <FaPhoneAlt className={inputIcon} />
                <input
                  type="text"
                  placeholder="0000 000 000"
                  className={inputClass}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className={inputWrapper}>
              <label className={labelStyle}>Secure Password</label>
              <FaLock className={inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>

            {/* Role Selection */}
            <div className={inputWrapper}>
              <label className={labelStyle}>Registering as</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 outline-none transition-all focus:border-[#ff4d2d] focus:ring-4 focus:ring-orange-100 appearance-none shadow-sm font-medium text-gray-700"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Hungry Customer</option>
                <option value="owner">Restaurant Owner</option>
                <option value="deliveryBoy">Delivery Partner</option>
              </select>
              <div className="absolute right-4 top-[44px] pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Error Message */}
            {err && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{err}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-4">
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff7b2d] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? <ClipLoader size={24} color="white" /> : "Create Account"}
              </button>

              {/* Commented out Google Divider and Button UI
              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-4 text-sm text-gray-400 absolute">or</span>
              </div>

              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
              >
                <FcGoogle size={22} />
                Continue with Google
              </button>
              */}
            </div>

            {/* Footer Link */}
            <p className="text-center text-gray-500 font-medium mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-[#ff4d2d] font-bold hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
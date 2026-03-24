import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import api from "../utils/axios";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const primaryColor = "#ff4d2d";

    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")

    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    // ✅ FIXED SIGNUP
    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await api.post("/api/auth/signup", {
                fullName,
                email,
                password,
                mobile,
                role
            });

            dispatch(setUserData(result.data))
            setErr("")
        } catch (error) {
            console.log("SIGNUP ERROR:", error?.response?.data)
            setErr(error?.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    // ✅ FIXED GOOGLE AUTH
    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("Mobile number is required for Google Sign-up")
        }

        const provider = new GoogleAuthProvider()

        try {
            const result = await signInWithPopup(auth, provider)

            const { data } = await api.post("/api/auth/google-auth", {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            });

            dispatch(setUserData(data))
            setErr("")
        } catch (error) {
            console.log(error)
            setErr("Google authentication failed")
        }
    }

    const inputWrapper = "relative group space-y-1.5";
    const inputIcon = "absolute left-4 top-[38px] text-gray-400 group-focus-within:text-[#ff4d2d]";
    const inputClass = "w-full bg-gray-50 border border-gray-300 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:bg-white focus:border-[#ff4d2d]";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white border rounded-3xl shadow w-full max-w-md p-8">

                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                <div className="space-y-4">

                    <div className={inputWrapper}>
                        <FaUser className={inputIcon} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className={inputClass}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className={inputWrapper}>
                            <FaEnvelope className={inputIcon} />
                            <input
                                type="email"
                                placeholder="Email"
                                className={inputClass}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={inputWrapper}>
                            <FaPhoneAlt className={inputIcon} />
                            <input
                                type="text"
                                placeholder="Mobile"
                                className={inputClass}
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={inputWrapper}>
                        <FaLock className={inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={inputClass}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="absolute right-4 top-[38px]"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>

                    <select
                        className="w-full border p-3 rounded-xl"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="deliveryBoy">Courier</option>
                    </select>

                    <button
                        onClick={handleSignUp}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
                    </button>

                    {err && (
                        <p className="text-red-500 text-sm text-center">{err}</p>
                    )}

                    <button
                        onClick={handleGoogleAuth}
                        className="w-full flex items-center justify-center gap-2 border p-3 rounded-xl"
                    >
                        <FcGoogle size={20} />
                        Sign up with Google
                    </button>

                    <p className="text-center text-sm">
                        Already have an account?
                        <span
                            className="text-orange-500 cursor-pointer ml-1"
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </span>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default SignUp;
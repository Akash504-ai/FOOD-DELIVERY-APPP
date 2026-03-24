import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaStore,
  FaMapMarkerAlt,
  FaCity,
  FaMap,
  FaCloudUploadAlt,
} from "react-icons/fa";
import api from "../utils/axios";
import { BASE_URL } from "../utils/api";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || "",
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentCity) setCity(currentCity);
    if (currentState) setState(currentState);
    if (currentAddress) setAddress(currentAddress);
  }, [currentCity, currentState, currentAddress]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !city || !state || !address) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await api.post(
        `${BASE_URL}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    /* STEP 1: Main Page Background changed to bg-gray-100 */
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-40" />

      {/* Back Navigation */}
      <button
        onClick={() => navigate("/")}
        /* STEP 2: Back button border updated to border-gray-300 */
        className="absolute top-6 left-6 z-20 p-2 bg-white shadow-sm rounded-full hover:bg-orange-50 transition-all group border border-gray-300"
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-gray-700 group-hover:text-[#ff4d2d]"
        />
      </button>

      <div className="max-w-2xl w-full z-10">
        {/* Dynamic Header Section */}
        <div className="text-center mb-10">
          {/* STEP 2: Header icon container border updated to border-gray-300 */}
          <div className="inline-flex bg-white p-4 rounded-3xl mb-4 shadow-sm border border-gray-300">
            <FaStore className="text-[#ff4d2d] w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {myShopData ? "Refine" : "Create"}{" "}
            <span className="text-[#ff4d2d]">Shop</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">
            "
            {myShopData
              ? "Keep your restaurant details up to date"
              : "Let's set up your digital storefront"}
            "
          </p>
        </div>

        {/* STEP 2 & 6: Main Form Container - Solid bg-white, gray-300 border, and refined shadow */}
        <form
          className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12 border border-gray-300 space-y-8 relative"
          onSubmit={handleSubmit}
        >
          {/* Name Input Group */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <FaStore className="text-orange-400" /> Shop Identity
            </label>
            {/* STEP 3: Input background set to bg-gray-50 with border-gray-200 */}
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] focus:bg-white transition-all font-semibold text-gray-800 shadow-inner outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Enhanced Image Upload Group */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <FaCloudUploadAlt className="text-orange-400" /> Storefront Image
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImage}
              />
              {/* STEP 4: Dashed border updated to gray-400, bg updated to gray-50 */}
              <div
                className={`w-full h-56 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative ${frontendImage ? "border-[#ff4d2d]" : "border-gray-400 bg-gray-50 group-hover:border-[#ff4d2d]"}`}
              >
                {frontendImage ? (
                  <>
                    <img
                      src={frontendImage}
                      alt="preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Change Photo
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* STEP 3: Inner icon circle changed to bg-white for depth */}
                    <div className="bg-white p-4 rounded-full shadow-sm mb-3 border border-gray-200">
                      <FaCloudUploadAlt className="w-8 h-8 text-gray-400 group-hover:text-[#ff4d2d] transition-colors" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold">
                      Click or drag to upload banner
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <FaCity className="text-orange-400" /> City
              </label>
              {/* STEP 3: bg-gray-50 */}
              <input
                type="text"
                placeholder="City"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] focus:bg-white transition-all font-medium shadow-inner outline-none"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <FaMap className="text-orange-400" /> State
              </label>
              {/* STEP 3: bg-gray-50 */}
              <input
                type="text"
                placeholder="State"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] focus:bg-white transition-all font-medium shadow-inner outline-none"
                onChange={(e) => setState(e.target.value)}
                value={state}
                required
              />
            </div>
          </div>

          {/* Address Input Group */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
              <FaMapMarkerAlt className="text-orange-400" /> Detailed Address
            </label>
            {/* STEP 3: bg-gray-50 */}
            <textarea
              rows="2"
              placeholder="Enter Shop Address"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff4d2d] focus:bg-white transition-all font-medium shadow-inner resize-none outline-none"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
            />
          </div>

          {/* Action Button */}
          {/* STEP 6: Shadow depth updated for visual elevation */}
          <button
            className="w-full bg-[#ff4d2d] text-white mt-4 px-6 py-5 rounded-[1.5rem] font-black text-lg shadow-[0_20px_40px_rgba(255,77,45,0.15)] hover:shadow-[0_25px_50px_rgba(255,77,45,0.25)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={24} color="white" />
            ) : (
              <>
                <FaUtensils size={18} />
                {myShopData ? "Update Shop Details" : "Launch Shop"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Renovation images array
  const renovationImages = [
    {
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
      title: "Modern Living Room",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      title: "Contemporary Kitchen",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      title: "Elegant Bedroom",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      title: "Luxury Bathroom",
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1664478290068-f29f0db6cabd?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cozy Home Office",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
  ];

  // Auto-rotate images  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % renovationImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInLeft">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                 AI-Powered Design Assistant
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Transform Your Home with Expert{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Renovation Ideas
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Discover personalized renovation ideas tailored to your style,
              budget, and space. Let AI help you create the home of your dreams.
            </p>

            {/* wizard Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/wizard"
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <button className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-400 hover:text-purple-600 transition-all duration-300 hover:shadow-lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-6">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">10k+</span> Happy
                  Homeowners
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-900">
                  4.8/5
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual - Image Slider */}
          <div className="relative animate-fadeInRight">
            <div className="relative">
              {/* Main image container with gradient overlay */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <div className="aspect-w-4 aspect-h-3 relative h-[500px]">
                  {renovationImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        index === currentImage
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${image.gradient}`}
                      ></div>
                    </div>
                  ))}

                  {/* Image title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">
                      {renovationImages[currentImage].title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Image indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {renovationImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "w-8 bg-gradient-to-r from-blue-600 to-purple-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI
                  </div>
                  <div className="text-xs text-gray-600 font-semibold">
                    Powered
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                <div className="text-center">
                  <div className="text-2xl font-bold">🌿</div>
                  <div className="text-xs font-semibold">Eco-Friendly</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 blur-3xl"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out 0.2s both;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;

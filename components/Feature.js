"use client";
// functional components, 
const Features = () => {
  // feature  array  
  const features = [
    {
      id: 1,
      title: "AI powered style suite to understand your aesthetics",
      icon: "🎨",
    },
    {
      id: 2,
      title: "Visualizations to see what different styles look in space",
      icon: "👁️",
    },
    {
      id: 3,
      title: "Drag and-drop furniture flow and furniture sizing",
      icon: "🪑",
    },
  ];

  const spaceFeatures = [
    {
      id: 1,
      title: "Interactive 3D models of your rooms",
      icon: "🏠",
    },
    {
      id: 2,
      title: "Drag and-drop furniture placement arrangement",
      icon: "📐",
    },
    {
      id: 3,
      title: "Recommendations for traffic flow and furniture sizing",
      icon: "📊",
    },
  ];

  const personalizationFeatures = [
    {
      id: 1,
      title:
        "Tailors designs by combining style, budget, room type, environment type and eco-friendly preferences",
      icon: "🧠",
    },
    {
      id: 2,
      title:
        "Provides high-quality visual references directly within the platform for inspiration",
      icon: "🖼️",
    },
  ];

  const climateFeatures = [
    {
      id: 1,
      title:
        "Integrates local weather data for optimal, energy-efficient renovation suggestions",
      icon: "🌦️",
    },
    {
      id: 2,
      title:
        "Users can easily adjust preferences, budget, and styles at any project stage",
      icon: "🔧",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
               Powerful Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unlocking the Secrets of{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stunning Home Design
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Get personalized recommendations to transform your space. Our
            AI-powered system helps you discover the perfect design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-32">
          {/* Personalized Style Discovery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
                <span className="text-2xl">🎨</span>
                <span className="text-sm font-semibold text-blue-700">
                  Style Discovery
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Personalized Style Discovery
              </h3>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Our system analyzes size preferences to recommend styles,
                colors, and furniture that match your unique aesthetic. Easy
                questionnaire to be seen scrolling and efficiencies at sight.
              </p>

              <ul className="space-y-5">
                {features.map((feature) => (
                  <li key={feature.id} className="flex items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4">
                      <span className="text-white text-xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition duration-300">
                        {feature.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border border-gray-100">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop"
                      alt="Personalized Style Discovery"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>

                    {/* Floating style cards overlay */}
                    <div className="absolute inset-0 p-8 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl hover:scale-105 transition-transform">
                          <div className="w-full h-16 bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl mb-2"></div>
                          <div className="text-xs font-semibold text-center text-gray-700">
                            Modern
                          </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl hover:scale-105 transition-transform">
                          <div className="w-full h-16 bg-gradient-to-br from-green-200 to-green-400 rounded-xl mb-2"></div>
                          <div className="text-xs font-semibold text-center text-gray-700">
                            Rustic
                          </div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl hover:scale-105 transition-transform">
                          <div className="w-full h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-xl mb-2"></div>
                          <div className="text-xs font-semibold text-center text-gray-700">
                            Traditional
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Space Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border border-gray-100">
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop"
                    alt="Smart Space Planning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20"></div>

                  {/* 3D grid overlay */}
                  <div className="absolute inset-0 p-8">
                    <div className="w-full h-full border-2 border-white/30 rounded-2xl grid grid-cols-3 grid-rows-3 gap-2 p-4">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-200">
                <span className="text-2xl">📐</span>
                <span className="text-sm font-semibold text-amber-700">
                  Space Planning
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Smart Space Planning
              </h3>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Maximize your home's potential with intelligent layout options.
                We help you find options for flow functionality & flow -
                Maximizing every square foot budget cost.
              </p>

              <ul className="space-y-5">
                {spaceFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4">
                      <span className="text-white text-xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition duration-300">
                        {feature.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* All-in-One Personalization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                <span className="text-2xl">🧠</span>
                <span className="text-sm font-semibold text-green-700">
                  Personalization
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                All-in-One Personalization
              </h3>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Tailored design recommendations that balance style, budget, room
                type, and eco-conscious choices—all in one smart system.
              </p>

              <ul className="space-y-5">
                {personalizationFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4">
                      <span className="text-white text-xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition duration-300">
                        {feature.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border border-gray-100">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop"
                      alt="All-in-One Personalization"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20"></div>

                    {/* Settings overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl max-w-sm w-full">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Budget
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-3/4 h-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Style
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-5/6 h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">
                              Eco-Friendly
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Climate-Smart & Flexible Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 border border-gray-100">
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop"
                    alt="Climate-Smart Planning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-blue-600/20"></div>

                  {/* Weather widget overlay */}
                  <div className="absolute top-8 right-8">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                      <div className="text-center">
                        <div className="text-4xl mb-2">☀️</div>
                        <div className="text-2xl font-bold text-gray-900">
                          24°C
                        </div>
                        <div className="text-xs text-gray-600 font-semibold">
                          Optimal
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-2 rounded-full border border-sky-200">
                <span className="text-2xl">🌦️</span>
                <span className="text-sm font-semibold text-sky-700">
                  Climate-Smart
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Climate-Smart & Flexible Planning
              </h3>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Make smarter renovation decisions with climate-aware suggestions
                and flexible design controls that adapt to your evolving needs.
              </p>

              <ul className="space-y-5">
                {climateFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4">
                      <span className="text-white text-xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition duration-300">
                        {feature.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Features;

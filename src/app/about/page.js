import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: "🌱",
      title: "Sustainability First",
      description:
        "Eco-friendly solutions that protect our planet while beautifying your home",
    },
    {
      icon: "💡",
      title: "Innovation-Driven Design",
      description:
        "Cutting-edge AI technology for smart, personalized recommendations",
    },
    {
      icon: "🏡",
      title: "Affordable Solutions",
      description:
        "Beautiful renovations that fit any budget without compromising quality",
    },
    {
      icon: "🤝",
      title: "Customer-Centered",
      description:
        "Your vision and satisfaction are at the heart of everything we do",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Homeowners" },
    { number: "50K+", label: "Designs Created" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
  ];

  const team = [
    { role: "AI Technology", icon: "🤖", color: "from-blue-500 to-purple-600" },
    {
      role: "Design Experts",
      icon: "🎨",
      color: "from-purple-500 to-pink-600",
    },
    {
      role: "Sustainability",
      icon: "🌿",
      color: "from-green-500 to-emerald-600",
    },
    { role: "Support Team", icon: "💬", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ Transforming Homes Since 2020
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                About HomeSpark
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Combining innovation and sustainability to help homeowners
                transform their spaces into modern, eco-friendly dream homes.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To empower homeowners with{" "}
                  <strong>AI-driven renovation ideas</strong> that blend style,
                  functionality, and sustainability—making every home truly
                  unique and environmentally responsible.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To be the leading platform for{" "}
                  <strong>eco-conscious home transformations</strong>, inspiring
                  a future where sustainable living is accessible, affordable,
                  and beautiful for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                  💎 Our Core Values
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Drives Us
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide every decision we make
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-white">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Why Choose HomeSpark?
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  From smart space-saving solutions to sustainable materials,
                  HomeSpark ensures your renovation journey is simple,
                  inspiring, and future-ready.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">AI-Powered Precision</h3>
                  </div>
                  <p className="text-white/80">
                    Intelligent recommendations tailored to your unique style
                    and needs
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">Budget Flexibility</h3>
                  </div>
                  <p className="text-white/80">
                    Solutions for every budget without compromising on quality
                    or style
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">Eco-Conscious Design</h3>
                  </div>
                  <p className="text-white/80">
                    Sustainable materials and energy-efficient solutions for a
                    greener future
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-lg font-bold">Expert Support</h3>
                  </div>
                  <p className="text-white/80">
                    Dedicated team ready to help you every step of your journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Team Expertise
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A diverse team of experts dedicated to your home transformation
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {member.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.role}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of happy homeowners who have already started their
              renovation journey with HomeSpark
            </p>
            <a
              href="/wizard"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105"
            >
              Get Started Now
              <svg
                className="w-5 h-5 ml-2"
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
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

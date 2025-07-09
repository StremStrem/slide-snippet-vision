import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Download, Search, Zap, Video, File, ChevronRight } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void; //tells Typescript this is a function that returns nothing
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => { //onGetStarted function is defined elsewhere and passed as prop.
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SlideSnip</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-orange-500 hover:to-orange-400 transition-all shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Videos Into <br />
              <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Presentation Decks
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Automatically extract slides from any video or playlist. 
              Perfect for lectures, tutorials, and presentations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-orange-500 hover:to-orange-400 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Extract Slides Free
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl border-gray-300"
              >
                See Demo
              </Button>
            </div>
          </motion.div>

          {/* Extraction Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transform rotate-1">
              {/* Video Thumbnail */}
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 aspect-video rounded-lg flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/80" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  12:45 / 45:22
                </div>
              </div>
              
              {/* Extracted Frames */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Extracted Slides</h3>
                  <span className="text-sm text-blue-900 font-medium">3 slides found</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: item * 0.2 }}
                      className="relative"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-blue-900/10 to-blue-700/10 w-full h-full" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-blue-900/90 text-white text-xs px-2 py-1 rounded">
                          0:{item * 5}:00
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg transform rotate-6">
              AI-Powered
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 shadow-md rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-orange-500 mr-1" />
                <span>Processing complete</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SlideSnip Works
            </h2>
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
              Transform videos into slides in three simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Video, 
                title: "Add Video URL", 
                desc: "Paste any YouTube, Vimeo, or video link",
                color: "from-blue-900 to-blue-700"
              },
              { 
                icon: Zap, 
                title: "AI Extraction", 
                desc: "Our AI detects and extracts presentation slides",
                color: "from-orange-500 to-orange-400"
              },
              { 
                icon: File, 
                title: "Download Deck", 
                desc: "Export as PDF or ZIP with timestamps",
                color: "from-blue-900 to-blue-700"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm rounded-2xl h-full">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform videos into professional slide decks
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Download, 
                title: "Bulk Extraction", 
                desc: "Process entire playlists and extract slides from multiple videos simultaneously.",
                color: "bg-blue-900"
              },
              { 
                icon: File, 
                title: "PDF & ZIP Export", 
                desc: "Export your extracted slides as organized PDFs or convenient ZIP archives.",
                color: "bg-orange-500"
              },
              { 
                icon: Search, 
                title: "Search & Filter", 
                desc: "Find specific slides instantly with OCR-powered search and smart filtering.",
                color: "bg-blue-900"
              },
              { 
                icon: Video, 
                title: "Time Stamps", 
                desc: "Every slide includes the exact video timestamp it was captured from.",
                color: "bg-orange-500"
              },
              { 
                icon: Zap, 
                title: "Smart Detection", 
                desc: "AI identifies the clearest slide frames automatically.",
                color: "bg-blue-900"
              },
              { 
                icon: Play, 
                title: "Video Previews", 
                desc: "Play video segments directly from your extracted slides.",
                color: "bg-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-left hover:shadow-lg transition-all duration-300 border-0 shadow-sm rounded-xl h-full">
                  <div className="flex items-start">
                    <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mr-4`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Extract Slides?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of educators and professionals saving hours with automated slide extraction
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-white hover:to-white hover:text-orange-500 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-blue-200 mt-6 text-sm">
              No credit card required • Free forever plan
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SlideSnip</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SlideSnip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
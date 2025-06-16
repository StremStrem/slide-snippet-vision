
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Download, FileText, Archive, ArrowLeft, Play } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Screen } from "@/pages/Index";

interface ResultsViewerProps {
  onNavigate: (screen: Screen) => void;
}

const mockSlides = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
    timestamp: "00:01:23",
    duration: "8s",
    text: "Introduction to React Components",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop",
    timestamp: "00:02:15",
    duration: "12s",
    text: "JSX Syntax and Best Practices",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
    timestamp: "00:03:42",
    duration: "15s",
    text: "State Management with useState Hook",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop",
    timestamp: "00:05:18",
    duration: "10s",
    text: "Props and Component Communication",
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop",
    timestamp: "00:07:03",
    duration: "14s",
    text: "Lifecycle Methods and useEffect",
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
    timestamp: "00:09:27",
    duration: "9s",
    text: "Conditional Rendering Techniques",
  },
];

export const ResultsViewer = ({ onNavigate }: ResultsViewerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState([20]);

  const filteredSlides = mockSlides.filter(slide => {
    const matchesSearch = slide.text.toLowerCase().includes(searchQuery.toLowerCase());
    const slidesDuration = parseInt(slide.duration.replace('s', ''));
    const matchesDuration = slidesDuration <= durationFilter[0];
    return matchesSearch && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onNavigate={onNavigate} currentScreen="extraction" />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => onNavigate('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Extraction Results</h1>
                <p className="text-gray-600">React Masterclass - Complete Course</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-2" />
                ZIP
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <div className="w-80">
              <Card className="p-6 sticky top-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">
                      Search slide text
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">
                      Max Duration: {durationFilter[0]}s
                    </label>
                    <Slider
                      value={durationFilter}
                      onValueChange={setDurationFilter}
                      max={20}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>Total Slides:</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Showing:</span>
                        <span className="font-medium">{filteredSlides.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Video Duration:</span>
                        <span className="font-medium">2h 34m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSlides.map((slide) => (
                  <Card key={slide.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img 
                        src={slide.thumbnail} 
                        alt={`Slide ${slide.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-black/70 text-white">
                          {slide.duration}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="text-sm font-medium text-blue-900 mb-2">
                        {slide.timestamp}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {slide.text}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredSlides.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No slides match your current filters.</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setDurationFilter([20]);
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

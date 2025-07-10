import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import Gallery from "./Gallery";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

  const [extractions, setExtractions] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [userID, setUserID] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user || !user.uid) return; // wait until user is available

    setUserID(user.uid);
  }, [user]);

  useEffect(() => {
    if (!userID) return; // wait until userID is set

    fetchExtractions(); // immediate fetch on mount
    const interval = setInterval(() => {
      fetchExtractions();
    }, 3000); // every 3 seconds

    return () => clearInterval(interval); // cleanup
  }, [userID]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user){
      console.log("User is not logged in");
      navigate("/");
    }
  }, [user]);

  const fetchExtractions = async () => {
    const res = await axios.get('https://slide-snip-backend.onrender.com/session/get-sessions', {
      params: { userID }
    });
    setExtractions(res.data);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your video extractions</p>
            </div>
            {selectedCardId && (
              <div className="flex">
                <button 
                  className="bg-[#1E3A8A] text-[#F8F8F8] px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-[#F97316]"
                  onClick={() => setSelectedCardId('')}
                > 
                  Back 
                </button>
              </div>
            )}
          </div>

          {/* MAIN CONTENT AREA */}
          {selectedCardId ? (
            <Gallery id={selectedCardId} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extractions && extractions.length > 0 ? 
                extractions.map((extraction) => (
                  <Card 
                    onClick={() => setSelectedCardId(extraction.extraction_id)} 
                    key={extraction.extraction_id} 
                    className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img 
                        src={extraction.thumbnail_path} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {extraction.video_title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(extraction.date_created).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {getStatusBadge(extraction.status)}
                        
                        {extraction.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/results')}
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            View ({extraction.slideCount})
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )) 
                : <p>No Extractions found</p>
              }
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate('/extractions')}
        size="lg"
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-blue-900 hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

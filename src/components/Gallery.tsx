import React, { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Play } from 'lucide-react'
import axios from 'axios';

const Gallery = ({ id }) => {
    const [gallery, setGallery] = useState([]);

    useEffect( () => {
        const fetchGallery = async () => {
            const res = await axios.get('http://localhost:3000/session/get-gallery', {params:{id}});
            console.log(res.data.frames);
            setGallery(res.data.frames);
        }
        fetchGallery();
    }, [id])

    useEffect(() => {
      console.log("Gallery updated:", gallery);
    }, [gallery]);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {gallery ? 
    gallery.map((frame) => ( //() implicitly returns contents
        <Card key={frame} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="aspect-video bg-gray-200 relative overflow-hidden">
            <img 
              src={`http://localhost:3000/static/sessions/${id}/gallery/${frame}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>
    ))
        :
        <p>No frames found</p>
    }
    </div>
    
  )
}

export default Gallery
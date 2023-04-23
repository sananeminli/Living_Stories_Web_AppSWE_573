import React, { useState, useRef, ChangeEvent } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const urlEndpoint = "http://localhost:8080/stories";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface Location {
  name: string;
  lat: number;
  lng: number;
}



interface Story{
  text:string,
  header:string,
  labels:string[],
  locations:Location[],
  mediaString:string[]
}

const Story: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 41.0856396, lng: 29.0424937 });
  const [locations, setLocations] = useState<Location[]>([]);
  const [text, setText] = useState<string>('');
  const [header, setHeader] = useState<string>('');
  const [labels, setLabels] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([])
  const navigate = useNavigate()
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleLocationSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const locationData: Location = {
        name: place.name || "",
        lat: Number(place.geometry?.location?.lat().toFixed(6)),
        lng: Number(place.geometry?.location?.lng().toFixed(6)),
      };
      
      setLocations([...locations, locationData]);
      console.log(locationData)
      setMapCenter({ lat: locationData.lat, lng: locationData.lng });
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    const { latLng } = e;
    const lat = latLng?.lat();
    const lng = latLng?.lng();
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAXFU7t-c9q8N7D7c8ELp7h4eGj5LtSoHA`);
      const { results } = response.data;
      if (results.length > 0) {
        const locationData: Location = {
          name: results[0].formatted_address,
          lat: Number(lat?.toFixed(6)),
          lng: Number(lng?.toFixed(6)),
        };
        setLocations([...locations, locationData]);
        setMapCenter({ lat: locationData.lat, lng: locationData.lng });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () =>{
    
    const storyRequest: Story = {
      text,
      header,
      labels,
      locations,
      mediaString: media
    };
    async function postData() {
      try {
        console.log(storyRequest)
        const response = await axios.post('http://localhost:8080/stories', storyRequest, {
          withCredentials: true
        });
        
        console.log(response)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    postData();
    navigate("/home",{replace:true})
    
    

  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1]; // Get the base64 part without the data URL prefix
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };


  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleHeaderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHeader(event.target.value);
  };

  const handleLabelsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabels(event.target.value.split(',').map((label) => label.trim()));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const blobs = Array.from(event.target.files).map((file) => file.slice(0));
      const base64Strings = await Promise.all(blobs.map(blobToBase64));
      
      console.log(base64Strings); // Array of base64-encoded strings
      setMedia(base64Strings);
    }
  };
  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAXFU7t-c9q8N7D7c8ELp7h4eGj5LtSoHA" libraries={["places"]}>
          <form >

          <label>
            Text:
            <input type="text" value={text} onChange={handleTextChange} />
          </label>
          <label>
            Header:
            <input type="text" value={header} onChange={handleHeaderChange} />
          </label>
          <label>
            Labels (comma-separated):
            <input type="text" value={labels.join(', ')} onChange={handleLabelsChange} />
          </label>
          <input type="file" onChange={handleFileChange} multiple required />
          
          <button type="submit" onClick={handleSubmit}>Submit</button>
          
        </form>
        <div className="form-group">
          <label>Locations:</label>
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handleLocationSelect}
          >
            <input type="text" className="form-control" />
          </Autocomplete>
          <ul>
            {locations.map((loc, index) => (
              <div key={index}>
                <li>{loc.name || `${loc.lat}, ${loc.lng}`}</li>
                <button type="button" onClick={() => setLocations(locations.filter((_, i) => i !== index))}>Remove</button>
              </div>
            ))}
          </ul>
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={20}
          onClick={handleMapClick}
        >
          {locations.map((loc, index) => (
            <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} />
          ))}
        </GoogleMap>
        
      </LoadScript>
    </div>
  );
};

export default Story;

'use client';

import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';

export function Map() {
  const position = { lat: 26.9124, lng: 75.7873 }; // Jaipur, Rajasthan

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Google Maps API key is missing.</p>
        </div>
    )
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        style={{ width: '100%', height: '100%' }}
        defaultCenter={position}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={'f9d3a958a598d9c5'}
      >
        <Marker position={position} />
      </GoogleMap>
    </APIProvider>
  );
}

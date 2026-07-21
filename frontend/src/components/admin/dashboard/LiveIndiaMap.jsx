import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Activity, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../../../api/dashboard';

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json";


const LiveIndiaMap = () => {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    const fetchLiveVisitors = async () => {
      try {
        const response = await dashboardApi.getLiveVisitors(); 
        setVisitors(response.data || []); 
      } catch (error) {
        console.error("Failed to fetch live visitors", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveVisitors();
    
    const interval = setInterval(fetchLiveVisitors, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col h-full relative overflow-hidden min-h-[500px]">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            Live Visitors (India)
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            {visitors.length} active users on site right now
          </p>
        </div>
      </div>

      <div className="flex-1 w-full h-full flex items-center justify-center relative z-0 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="animate-pulse text-zinc-500 text-sm font-medium">Connecting to telemetry...</div>
          </div>
        ) : geoError ? (
          <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium text-zinc-600">Failed to load map data.</p>
          </div>
        ) : (
          <div className="w-full h-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1150, center: [82.8, 22.5] }}
              width={750}
              height={800}
              className="w-full h-full object-contain focus:outline-none"
            >
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies, error }) => {
                  if (error) {
                    setGeoError(true);
                    return null;
                  }
                  return geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#f4f4f5" 
                      stroke="#d4d4d8" 
                      strokeWidth={0.5}
                      className="focus:outline-none hover:fill-zinc-300 transition-colors duration-300"
                    />
                  ));
                }}
              </Geographies>

              {visitors.map((visitor, index) => (
                <Marker key={index} coordinates={visitor.coordinates}>
                  <g>
                    <circle cx="0" cy="0" r="10" fill="#10b981" className="animate-ping origin-center" opacity="0.3" />
                    <circle cx="0" cy="0" r="4" fill="#10b981" />
                  </g>
                  <title>{visitor.name} - Active</title>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveIndiaMap;
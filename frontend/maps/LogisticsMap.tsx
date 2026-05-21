"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Shipment {
  id: string;
  source: string;
  sourceCoords: [number, number];
  destination: string;
  destinationCoords: [number, number];
  status: string;
  delayHours: number;
  riskLevel: string;
  inventoryStatus: string;
  cargoType: string;
}

interface LogisticsMapProps {
  shipments: Shipment[];
}

const cities = [
  { name: "Delhi", coords: [28.6139, 77.2090] as [number, number] },
  { name: "Mumbai", coords: [19.0760, 72.8777] as [number, number] },
  { name: "Bangalore", coords: [12.9716, 77.5946] as [number, number] },
  { name: "Chennai", coords: [13.0827, 80.2707] as [number, number] },
  { name: "Kochi", coords: [9.9312, 76.2673] as [number, number] },
  { name: "Hyderabad", coords: [17.3850, 78.4867] as [number, number] },
  { name: "Pune", coords: [18.5204, 73.8567] as [number, number] },
];

export default function LogisticsMap({ shipments }: LogisticsMapProps) {
  // Leaflet map needs a custom css style in page to be dark
  useEffect(() => {
    // Correct Leaflet default icon paths if needed, though we use custom HTML divIcon
  }, []);

  const createHubIcon = (cityName: string) => {
    // Check if there's any active HIGH risk shipment departing or arriving here
    const hasHighRisk = shipments.some(
      (s) =>
        (s.source === cityName || s.destination === cityName) &&
        s.riskLevel === "HIGH"
    );
    const hasMedRisk = shipments.some(
      (s) =>
        (s.source === cityName || s.destination === cityName) &&
        s.riskLevel === "MEDIUM"
    );

    let colorClass = "bg-cyan-400 animate-pulse-cyan";
    let glowClass = "rgba(6, 182, 212, 0.4)";
    if (hasHighRisk) {
      colorClass = "bg-rose-500 animate-pulse-red shadow-[0_0_10px_#ef4444]";
      glowClass = "rgba(239, 68, 68, 0.5)";
    } else if (hasMedRisk) {
      colorClass = "bg-orange-500 animate-pulse-orange shadow-[0_0_10px_#f97316]";
      glowClass = "rgba(249, 115, 22, 0.5)";
    }

    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative flex items-center justify-center w-6 h-6">
          <div class="absolute w-4 h-4 rounded-full ${colorClass} opacity-30"></div>
          <div class="w-2.5 h-2.5 rounded-full ${colorClass.split(" ")[0]} border border-white/20"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getRouteColor = (riskLevel: string) => {
    if (riskLevel === "HIGH") return "#ef4444";
    if (riskLevel === "MEDIUM") return "#f97316";
    return "#10b981";
  };

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[480px] rounded-2xl overflow-hidden border border-white/[0.08] relative dark-map">
      {/* Map Stats overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-[#0b101c]/90 border border-white/[0.1] rounded-xl p-3.5 backdrop-blur-md text-[11px] font-mono pointer-events-auto">
        <div className="font-bold text-white mb-2 uppercase tracking-wider text-[10px] text-cyan-400">
          Operational Leg Legend
        </div>
        <div className="space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-rose-500 inline-block" />
            <span>High Risk Route (Customs/Delay)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-orange-500 inline-block" />
            <span>Medium Risk Route (Congestion)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
            <span>Low Risk Route (Nominal)</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[21.0, 78.0]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Plot Warehouse City Hubs */}
        {cities.map((city) => (
          <Marker
            key={city.name}
            position={city.coords}
            icon={createHubIcon(city.name)}
          >
            <Popup>
              <div className="text-xs p-1">
                <span className="font-bold text-cyan-400 text-sm">{city.name} Logistics Center</span>
                <div className="text-slate-300 mt-1">
                  Active shipments associated:{" "}
                  {
                    shipments.filter(
                      (s) => s.source === city.name || s.destination === city.name
                    ).length
                  }
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Plot Shipment Routes */}
        {shipments.map((shipment) => {
          const routeColor = getRouteColor(shipment.riskLevel);
          return (
            <React.Fragment key={shipment.id}>
              {/* Outer Glow Route Polyline */}
              <Polyline
                positions={[shipment.sourceCoords, shipment.destinationCoords]}
                pathOptions={{
                  color: routeColor,
                  weight: 3,
                  opacity: 0.8,
                  className: "route-flow-line", // Animated moving dash effect
                }}
              >
                <Popup>
                  <div className="text-xs p-1.5 font-mono">
                    <div className="font-bold text-cyan-400 text-sm mb-1">{shipment.id}</div>
                    <div className="text-slate-300">Route: {shipment.source} → {shipment.destination}</div>
                    <div className="text-slate-300">Cargo: {shipment.cargoType}</div>
                    <div className="text-slate-300">Status: <span className="font-bold">{shipment.status}</span></div>
                    <div className="text-slate-300">Risk: <span className="font-bold" style={{ color: routeColor }}>{shipment.riskLevel}</span></div>
                  </div>
                </Popup>
              </Polyline>
              
              {/* Underlay Static Line for Base glow */}
              <Polyline
                positions={[shipment.sourceCoords, shipment.destinationCoords]}
                pathOptions={{
                  color: routeColor,
                  weight: 5,
                  opacity: 0.15,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

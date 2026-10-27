/**
 * Adventure Game - Interactive Map Component
 * Leaflet-based map showing player, NPCs, enemies, items, and quest points
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng, GeoPoint } from '../../game/geo/types';
import styles from './InteractiveMap.module.scss';

interface MapObject {
  id: string;
  position: LatLng;
  type: 'player' | 'npc' | 'enemy' | 'item' | 'quest_point';
  icon?: string;
}

interface InteractiveMapProps {
  playerPosition: GeoPoint | null;
  objects: MapObject[];
  interactionRadius?: number;
  onMarkerClick?: (objectId: string, type: string) => void;
  zoom?: number;
  center?: LatLng;
  showRadius?: boolean;
}

// Custom icons for different object types
const createMarkerIcon = (type: string): L.Icon => {
  const iconMap: Record<string, string> = {
    player: '🧙',
    npc: '🧝',
    enemy: '👹',
    item: '🪙',
    quest_point: '⭐',
  };

  const icon = iconMap[type] || '📍';

  return L.divIcon({
    html: `
      <div style="
        font-size: 2rem;
        text-align: center;
        filter: drop-shadow(0 0 3px rgba(0,0,0,0.5));
        transform: scale(1.2);
      ">
        ${icon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-marker',
  }) as L.Icon;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  playerPosition,
  objects,
  interactionRadius = 30,
  onMarkerClick,
  zoom = 15,
  center,
  showRadius = true,
}) => {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState<LatLng>(
    center || playerPosition || { lat: 48.8566, lng: 2.3522 }
  );

  // Update map center when player moves
  useEffect(() => {
    if (playerPosition && mapRef.current) {
      setMapCenter({ lat: playerPosition.lat, lng: playerPosition.lng });
    }
  }, [playerPosition]);

  if (!playerPosition && !center) {
    return (
      <div className={styles.mapError}>
        <p>GPS position unavailable</p>
        <p className={styles.hint}>Enable location services or use Demo Mode</p>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Player Position with Accuracy Circle */}
        {playerPosition && (
          <>
            {showRadius && (
              <Circle
                center={[playerPosition.lat, playerPosition.lng]}
                radius={interactionRadius + (playerPosition.accuracy || 0)}
                pathOptions={{
                  color: '#d4af37',
                  fillColor: '#d4af37',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '5, 5',
                }}
              />
            )}

            <Marker
              position={[playerPosition.lat, playerPosition.lng]}
              icon={createMarkerIcon('player')}
            >
              <Popup>
                <div className={styles.popup}>
                  <p className={styles.popupTitle}>Your Position</p>
                  <p>Lat: {playerPosition.lat.toFixed(4)}</p>
                  <p>Lng: {playerPosition.lng.toFixed(4)}</p>
                  {playerPosition.accuracy && (
                    <p>Accuracy: ±{Math.round(playerPosition.accuracy)}m</p>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Game Objects (NPCs, Enemies, Items, etc.) */}
        {objects.map((obj) => (
          <Marker
            key={obj.id}
            position={[obj.position.lat, obj.position.lng]}
            icon={createMarkerIcon(obj.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(obj.id, obj.type),
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <p className={styles.popupTitle}>{obj.id}</p>
                <p>Type: {obj.type}</p>
                <p>Lat: {obj.position.lat.toFixed(4)}</p>
                <p>Lng: {obj.position.lng.toFixed(4)}</p>
                {playerPosition && (
                  <p>
                    Distance:{' '}
                    {Math.round(
                      calculateDistance(playerPosition, obj.position)
                    )}
                    m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls/Info */}
      <div className={styles.mapInfo}>
        {playerPosition && playerPosition.accuracy && (
          <p className={styles.accuracy}>
            GPS Accuracy: ±{Math.round(playerPosition.accuracy)}m
          </p>
        )}
        <p className={styles.zoom}>Interaction Radius: {interactionRadius}m</p>
      </div>
    </div>
  );
};

/**
 * Simple distance calculation for display (in meters)
 */
function calculateDistance(from: GeoPoint | LatLng, to: LatLng): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
  const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const R = 6371000; // Earth's radius in meters

  return R * c;
}

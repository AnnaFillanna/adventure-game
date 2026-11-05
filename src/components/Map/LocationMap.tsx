import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import type { GeoPoint } from '../../game/geo/types';
import 'leaflet/dist/leaflet.css';

const positionIcon = divIcon({
  className: 'location-marker',
  html: '<span style="display:block;width:20px;height:20px;border:3px solid white;border-radius:50%;background:#1769aa;box-shadow:0 0 0 2px #1769aa"></span>',
  iconSize: [20, 20], iconAnchor: [10, 10],
});
function FollowPosition({ position }: { position: GeoPoint }) {
  const map = useMap();
  useEffect(() => {
    map.panTo([position.lat, position.lng], { animate: false });
  }, [map, position.lat, position.lng]);
  return null;
}
export function LocationMap({ position }: { position: GeoPoint }) {
  const [failed, setFailed] = useState(false);
  return <section aria-label="Karte deines Standorts">
    {failed && <p role="alert">Die Karte konnte nicht vollständig geladen werden. Dein Standort bleibt unten als Koordinaten sichtbar.</p>}
    <MapContainer center={[position.lat, position.lng]} zoom={16} style={{ height: 'min(50vh, 360px)', width: '100%', zIndex: 0 }} scrollWheelZoom={false}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19} eventHandlers={{ tileerror: () => setFailed(true) }} />
      <Marker position={[position.lat, position.lng]} icon={positionIcon} alt="Dein letzter empfangener Standort" />
      {position.accuracy !== undefined && <Circle center={[position.lat, position.lng]} radius={position.accuracy} pathOptions={{ color: '#1769aa', weight: 1, fillOpacity: .1 }} />}
      <FollowPosition position={position} />
    </MapContainer>
  </section>;
}

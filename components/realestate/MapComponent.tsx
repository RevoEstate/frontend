"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import { useState } from 'react'

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const LocationPicker = ({ onLocationSelect }: { 
  onLocationSelect: (coords: LatLngTuple) => void 
}) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng])
    }
  })
  return null
}

export default function MapComponent({ 
  center, 
  onLocationSelect 
}: {
  center: LatLngExpression
  onLocationSelect: (coords: LatLngTuple) => void
}) {
  const [position, setPosition] = useState<LatLngTuple>([center[0], center[1]])

  const handleLocationSelect = (coords: LatLngTuple) => {
    setPosition(coords)
    onLocationSelect(coords)
  }

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />
      <LocationPicker onLocationSelect={handleLocationSelect} />
    </MapContainer>
  )
}
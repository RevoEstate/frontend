"use client"

import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { Property } from '@/types'
import Image from 'next/image'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
})

interface MapProps {
    center?: number[]
    property?: Property
}

const Map:React.FC<MapProps> = ({
    center,
    property
}) => {
  const defaultCenter: L.LatLngExpression = [9.0192, 38.7525];
  const mapCenter: L.LatLngExpression = center ? [center[1], center[0]] : defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={center ? 13 : 2}
      scrollWheelZoom={false}
      className="w-full rounded-lg" 
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        { center && (
            <Marker position={[center[1], center[0]] as L.LatLngExpression}>
                <Popup>
                    <div className="flex flex-col gap-2 max-w-[200px]">
                        <div>
                            <h1 className="text-lg font-bold pb-1">{property?.title}</h1>
                            <img
                                src={property?.images[0]}
                                alt={property?.title}
                                className="w-full h-24 object-cover rounded"
                            />
                        </div>
                        
                        <div className=''>
                            <p className="text-sm text-sky-700">{property?.address.specificLocation}</p>
                            <p className="text-sm font-semibold my-0">{property?.price.toLocaleString()} ETB</p>
                            <p className="text-sm">
                            {property?.bedrooms} Bed • {property?.bathrooms} Bath • {property?.area} sqft
                            </p>
                        </div>
                       
                    </div>
                </Popup>
            </Marker>
        )}

    </MapContainer>
  )
}

export default Map
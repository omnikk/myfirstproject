import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const SalonMap = ({ salons, onSalonClick }) => {
  // Центр карты - Москва по умолчанию
  const defaultCenter = [55.751574, 37.573856];
  
  return (
    <YMaps>
      <Map 
        defaultState={{ center: defaultCenter, zoom: 11 }} 
        width="100%" 
        height="500px"
      >
        {salons.map((salon) => (
          <Placemark
            key={salon.id}
            geometry={[55.751574 + salon.id * 0.01, 37.573856 + salon.id * 0.01]}
            properties={{ 
              balloonContent: `<strong>${salon.name}</strong><br/>${salon.address}` 
            }}
            options={{
              preset: 'islands#redDotIcon'
            }}
            modules={['geoObject.addon.balloon']}
            onClick={() => onSalonClick && onSalonClick(salon)}
          />
        ))}
      </Map>
    </YMaps>
  );
};

export default SalonMap;
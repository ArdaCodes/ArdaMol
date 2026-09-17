// @ts-nocheck
"use client";

import { MapProvider } from "@yanikemmenegger/react-world-map";
import World from "@yanikemmenegger/react-world-map";

export default function WorldMapClient({
  initialFillColors,
  onClickPlace,
}: {
  initialFillColors: Record<string, string>;
  onClickPlace: (code: string, name: string) => void;
}) {
  return (
    <MapProvider
      initialFillColors={initialFillColors}
      defaultOnClickHandler={(country: any) =>
        onClickPlace(country.alpha2Code || country.code, country.commonName || country.name)
      }
    >
      <World />
    </MapProvider>
  );
}

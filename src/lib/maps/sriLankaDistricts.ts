import type { FeatureCollection } from 'geojson';

export const districtData: FeatureCollection = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "district_id": "colombo",
                "district_name": "Colombo"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [79.80, 6.70],
                        [80.10, 6.70],
                        [80.10, 6.95],
                        [79.80, 6.95],
                        [79.80, 6.70]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "district_id": "kandy",
                "district_name": "Kandy"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [80.40, 7.10],
                        [80.80, 7.10],
                        [80.80, 7.45],
                        [80.40, 7.45],
                        [80.40, 7.10]
                    ]
                ]
            }
        }
    ]
};
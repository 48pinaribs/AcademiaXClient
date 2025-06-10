import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, Table, Typography, Divider } from "antd";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { Title } = Typography;

const MapView = () => {
    const [stops, setStops] = useState([]);
    const [selectedStopId, setSelectedStopId] = useState(null);
    const [stopTimes, setStopTimes] = useState([]);

    const customMarkerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [30, 30], // boyut
        iconAnchor: [15, 30], // konum noktası
        popupAnchor: [0, -30], // popup açılma noktası
    });

    useEffect(() => {
        axios.get("https://localhost:7111/api/Gtfs/stops").then((res) => {
            setStops(res.data.result);
        });
    }, []);

    const handleMarkerClick = (stopId) => {
        setSelectedStopId(stopId);
        axios
            .get(`https://localhost:7111/api/Gtfs/timetable?stopId=${stopId}`)
            .then((res) => {
                setStopTimes(res.data.result);
            });
    };

    const columns = [
        {
            title: "Trip ID",
            dataIndex: "tripId",
            key: "tripId",
        },
        {
            title: "Arrival Time",
            dataIndex: "arrivalTime",
            key: "arrivalTime",
        },
        {
            title: "Departure Time",
            dataIndex: "departureTime",
            key: "departureTime",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card bordered style={{ marginBottom: 24 }}>
                <Title level={3} style={{ marginBottom: 16 }}>
                    Campus Shuttle Map
                </Title>
                <MapContainer center={[39.93, 32.85]} zoom={15} style={{ height: 500, width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {stops.map((stop) => (
                        <Marker
                            key={stop.stopId}
                            position={[stop.stopLat, stop.stopLon]}
                            icon={customMarkerIcon}
                            eventHandlers={{
                                click: () => handleMarkerClick(stop.stopId),
                            }}
                        >
                            <Popup>{stop.stopName}</Popup>
                        </Marker>

                    ))}
                </MapContainer>
            </Card>

            {selectedStopId && (
                <Card bordered>
                    <Title level={4}>🕒 Timetable for Stop ID: {selectedStopId}</Title>
                    <Divider />
                    <Table
                        columns={columns}
                        dataSource={stopTimes}
                        rowKey={(record, index) => index}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            )}
        </div>
    );
};

export default MapView;

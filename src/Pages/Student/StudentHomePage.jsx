import React from 'react';
import MapView from '../../Components/MapView';
import '../../styles/theme.css';

const StudentHomePage = () => {
    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Kampüs Haritası</h1><div className="meta">Durak zaman çizelgesi ve konum</div></div>
            </div>
            <div className="ax-card">
                <div className="ax-card-body">
                    <MapView />
                </div>
            </div>
        </div>
    );
};

export default StudentHomePage;

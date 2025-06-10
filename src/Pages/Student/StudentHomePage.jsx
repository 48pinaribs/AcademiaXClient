import React from 'react'
import MapView from '../../Components/MapView'
import { Card, Typography } from 'antd'
const { Title } = Typography

const StudentHomePage = () => {
    return (
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "100%", maxWidth: 1000 }}>
                <MapView />
            </Card>
        </div>
    )
}

export default StudentHomePage

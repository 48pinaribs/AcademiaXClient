import { Card, Descriptions, Button, Image, Spin } from 'antd';
import '../Components/Styles/ProfilePage.css';
import { useGetUserByIdQuery } from "../Api/accountApi";
//import photo from '../Assets/Ali.jpg';

const ProfilePage = () => {

    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    // console.log(decoded.nameid);//  Kullanıcı ID'si
    const userId = decoded.nameid;

    const { data, error, isLoading } = useGetUserByIdQuery(userId);
    const user = data?.result;
    console.log('🔎 data:', data);
    // user.photoUrl = "https://www.w3schools.com/howto/img_avatar.png"; // Placeholder for photoUrl

    if (isLoading) return <Spin tip="Profil yükleniyor..." />;
    if (error) return <p style={{ color: "red" }}>Kullanıcı bilgisi alınamadı.</p>;

    return (
        <div className="profile-container">
            <Card>
                <div className="profile-content">
                    <Image
                        //src={photo}
                        alt="Profil Fotoğrafı"
                        width={150} // 👈 burada genişliği ayarlarsın
                        height={180} // 👈 burada yüksekliği ayarlarsın
                        className='profile-photo'
                        style={{ objectFit: 'cover', borderRadius: 8, marginTop: 80 }} // yuvarlak köşeler
                        preview={false}
                    />
                    <div className="profile-info">
                        <h2>{user.userName}</h2>
                        <p style={{ color: '#888', marginBottom: 16 }}>{user.email}</p>

                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Ad">{user.firstName}</Descriptions.Item>
                            <Descriptions.Item label="Soyad">{user.lastName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Telefon">{user.phoneNumber}</Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <Button type="primary">Profili Düzenle</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;

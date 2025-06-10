import { Card, Descriptions, Button, Image, Spin } from 'antd';
import '../Components/Styles/ProfilePage.css';
import { useParams } from 'react-router-dom';
import { useGetUserTypeQuery } from '../Api/accountApi'; // Kullanıcının tipi için
import { useGetTeacherProfileQuery } from '../Api/teacherApi';
import { useGetStudentProfileQuery } from '../Api/studentApi';

const UserDetail = () => {
    const { userId } = useParams();

    // 1. userType sorgusu (örnek endpoint: /api/user/type/{id})
    const { data: userTypeData, isLoading: isLoadingType } = useGetUserTypeQuery(userId);
    const userType = userTypeData?.result;

    // 2. Profil sorguları
    const {
        data: teacherData,
        isLoading: isTeacherLoading,
        error: teacherError
    } = useGetTeacherProfileQuery(userId, { skip: userType !== 'Teacher' });

    const {
        data: studentData,
        isLoading: isStudentLoading,
        error: studentError
    } = useGetStudentProfileQuery(userId, { skip: userType !== 'Student' });

    const profile = userType === 'Teacher' ? teacherData?.result : studentData?.result;

    // 3. Durumlar
    if (isLoadingType || isTeacherLoading || isStudentLoading) {
        return <Spin tip="Profil yükleniyor..." />;
    }

    if (!profile) {
        return <p style={{ color: "red" }}>Kullanıcı profili alınamadı.</p>;
    }

    return (
        <div className="profile-container">
            <Card>
                <div className="profile-content">
                    <Image
                        src={profile.image || undefined}
                        alt="Profil Fotoğrafı"
                        width={150}
                        height={180}
                        className='profile-photo'
                        style={{ objectFit: 'cover', borderRadius: 8, marginTop: 80 }}
                        preview={false}
                    />
                    <div className="profile-info">
                        <Descriptions column={1} size="small" bordered>
                            <Descriptions.Item label="Name">{profile.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>

                            {userType === 'Teacher' && (
                                <>
                                    <Descriptions.Item label="Branch">{profile.branch}</Descriptions.Item>
                                    <Descriptions.Item label="Title">{profile.title}</Descriptions.Item>
                                    <Descriptions.Item label="Biography">{profile.biography}</Descriptions.Item>
                                    <Descriptions.Item label="Office">{profile.office}</Descriptions.Item>
                                    <Descriptions.Item label="Total Students">{profile.totalStudents}</Descriptions.Item>
                                </>
                            )}

                            {userType === 'Student' && (
                                <>
                                    <Descriptions.Item label="Class">{profile.className}</Descriptions.Item>
                                    <Descriptions.Item label="Advisor">{profile.advisorTeacher}</Descriptions.Item>
                                    <Descriptions.Item label="GPA">{profile.gpa}</Descriptions.Item>
                                    <Descriptions.Item label="Biography">{profile.biography}</Descriptions.Item>
                                </>
                            )}
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

export default UserDetail;

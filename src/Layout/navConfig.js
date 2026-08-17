/**
 * Rol bazlı sidebar menüsü. Tasarım onayında kararlaştırılan bilgi mimarisiyle birebir:
 * her rol kendi grubunu görür, "Herkes" grubu (Profilim) her rol için ayrıca eklenir.
 */
export function getNavGroups(role) {
    switch (role) {
        case 'Administrator':
            return [
                {
                    label: 'Yönetim',
                    items: [
                        { label: 'Panel', path: '/admin/dashboard' },
                        { label: 'Kurslar', path: '/admin/courses' },
                        { label: 'Öğretmenler', path: '/admin/teachers' },
                        { label: 'Öğrenciler', path: '/admin/students' },
                        { label: 'Kampüs Ring Yönetimi', path: '/admin/transport' },
                        { label: 'Duyurular', path: '/announcements' },
                    ],
                },
            ];
        case 'Teacher':
            return [
                {
                    label: 'Öğretim',
                    items: [
                        { label: 'Panel', path: '/teacher/dashboard' },
                        { label: 'Derslerim', path: '/teachercourse' },
                        { label: 'Not Girişi', path: '/teacher/grades' },
                        { label: 'Yoklama', path: '/teacher/attendance' },
                        { label: 'Duyurular', path: '/announcements' },
                    ],
                },
            ];
        case 'Student':
            return [
                {
                    label: 'Öğrencilik',
                    items: [
                        { label: 'Panel', path: '/student/dashboard' },
                        { label: 'Ders Seç', path: '/selectcourse' },
                        { label: 'Derslerim', path: '/enrolledcourse' },
                        { label: 'Notlarım', path: '/student/grades' },
                        { label: 'Yoklamam', path: '/student/attendance' },
                        { label: 'Duyurular', path: '/announcements' },
                        { label: 'Kampüs Haritası', path: '/studenthomepage' },
                    ],
                },
            ];
        default:
            return [];
    }
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // Получаем полную ссылку и сегменты
            const fullUrl = window.location.href;
            const hasHash = window.location.hash;
            const segments = hasHash ? window.location.hash.replace('#/', '').split('/') : window.location.pathname.split('/');
            const id = segments[segments.length - 1];

            console.log('Полная ссылка:', fullUrl);
            console.log('Хэш присутствует:', hasHash);
            console.log('Сегменты:', segments);
            console.log('ID:', id);

            // Проверяем, есть ли id и если да, является ли оно целым числом и в диапазоне от 1 до 20
            if (id && id.trim() !== '') {
                const idNumber = parseInt(id, 10);

                if (!isNaN(idNumber) && idNumber >= 1 && idNumber <= 20) {
                    // Если всё корректно, перенаправляем на LandingPage и передаем id
                    navigate(`/LandingPage/${idNumber}`, { state: { id: idNumber } });
                } else {
                    // Если id не целое число или вне диапазона, переходим на 404
                    navigate('/Page404');
                }
            } else {
                // Если id отсутствует, переходим на LandingPage без параметров
                navigate('/landing');
            }
        } catch (error) {
            // В случае ошибки, переходим на 404
            console.error('Ошибка при обработке URL:', error);
            navigate('/Page404');
        }
    }, [navigate]);

    return null; // Компонент не рендерит ничего, только обрабатывает редирект
};

export default RedirectHandler;

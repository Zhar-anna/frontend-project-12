import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <Image
        src="404.svg"
        alt='Page not found'
        fluid
        className="h-25 img-fluid"
      />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className='text-muted'>Но вы можете перейти
      <Link to="/">на главную страницу</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;

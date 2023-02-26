// import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import logo from '../images/404.svg';

const NotFoundPage = () => (
  <div className="text-center">
    <img
      src={logo}
      alt="Page not found"
      className="h-25 img-fluid"
    />
    <h1 className="h4 text-muted">Страница не найдена</h1>
    <p className="text-muted">
      Но вы можете перейти
      <Link to="/login">на главную страницу</Link>
    </p>
  </div>
);

export default NotFoundPage;

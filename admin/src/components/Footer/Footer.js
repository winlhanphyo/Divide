import {Container, Navbar} from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  const location = useLocation().pathname;

  return (
    <>
      {/* <Navbar className={location.indexOf('/create') !== -1 || location.indexOf('/profile') !== -1 || location.indexOf('/update') !== -1 ? styles.createNavBar+ ' shadow' : styles.navBar+ ' shadow'} variant="dark">
        <Container>
          <div className="d-flex w-100 justify-content-center">Seattle Consulting Myanmar</div>
        </Container>
      </Navbar> */}
    </>
  )
}

export default Footer;
import React, { Fragment } from 'react';
import {Spinner} from 'react-bootstrap';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = ({text}) => {
    return(
        // <div className={styles.loadingContainer}>
        // <span>{text}</span>
        //     <Spinner variant="dark" animation="grow" size="sm" />
        //     <Spinner variant="dark" animation="grow" />
        // </div>

        <div className={styles.loadingContainer}>
      	  <div className={styles.spinner}></div>
        </div>
    );
}

export default LoadingSpinner;

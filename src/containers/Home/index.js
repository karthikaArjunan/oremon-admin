import React from 'react';
import { Layout } from '../../components/Layout';
import { Row, Col, Container } from 'react-bootstrap'
import './style.css';
import {NavLink} from 'react-router-dom';
/**
* @author
* @function Home
**/

const Home = (props) => {
    return (
        <div>
            <Layout sidebar>

                
                {/*<div className="container-fluid bg-light text-dark p-5">
                <div className="container bg-light p-5">
                    <h1 className="display-4 fw-bold">Welcome to Admin Dashboard</h1>
                </div>
            </div>*/}
            </Layout>
        </div>
    )

}
export default Home
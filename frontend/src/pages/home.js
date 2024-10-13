import React, { useState } from 'react';
import axios from 'axios';
const backend = process.env.REACT_APP_BACKEND;
const Home = () => {
    console.log('back:');
    console.log(backend);
    const [data, setData] = useState('a');
    axios.get(backend+'aa',
    {
        headers: {
            'a':'b'
        }
    }
    )
    .then(response => {
        console.log(response.data);
        setData(response.data);
    })
    .catch(error => {
        console.log(error);
    });
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the home page of our application.</p>
            <h1>{data.toString()}</h1>
        </div>
    );
};

export default Home;
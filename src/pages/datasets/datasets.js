// COMPONENT/REACT IMPORTS
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import "./datasets.css";

// SIDEBAR COMPONENT
export default function Datasets(props) {
    
    const [data, setData] = useState("");

    useEffect(() => {
        axios.get('http://127.0.0.1:2000/ds/get-dataset-data')
            .then(function (response) {
                console.log(response);
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error retrieving datasets list!");
            })
    }, [])

    return (
        <><p id="data">{JSON.stringify(data)}</p></>
    )
};
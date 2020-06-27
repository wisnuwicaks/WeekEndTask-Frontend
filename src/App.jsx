import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Axios from "axios";

import CrudProduct from "./CrudProduct"

const API_URL = `http://localhost:8080`;

const App = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const btnHandler = async () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        alert("Data masuk!");
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        for (const key in err) {
          console.log(key);
        }
        console.log(err.toJSON());
      });

    // try {
    //   const response = await Axios.post(`${API_URL}/projects`, {
    //     name: text,
    //   });

    //   console.log(response);
    //   alert("Data terkirim!");
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const onChangeTextHandler = (e) => {
    // setstate
    setText(e.target.value);
  };

  return (
    <div>
    
      <CrudProduct/>
    </div>
  );
};

export default App;

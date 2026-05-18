import { useEffect, useState } from "react";
import axios from "axios";

function Test() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    axios
      .get("https://skyhavenbackend.onrender.com/api/products")
      .then((response) => {

        console.log(response.data);

        setProducts(response.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  return (

    <div
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: "40px"
      }}
    >

      <h1>TEST PAGE</h1>

      <h1>Total Products: {products.length}</h1>

      {products.map((product) => (

        <div key={product.id}>

          <h2>{product.productName}</h2>

        </div>

      ))}

    </div>

  );

}

export default Test;
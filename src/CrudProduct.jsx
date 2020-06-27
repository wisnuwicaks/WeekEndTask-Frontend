import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, InputGroup, Form, Row, Col, Table } from "react-bootstrap";

import Axios from "axios";

const API_URL = `http://localhost:8080`;

class CrudProduct extends React.Component {
  state = {
    editIndexActive: [],
    allproducts: [],
    selectedFile: null,
    productdata: {
      productName: "",
      price: 0,
    },
  };

  componentDidMount() {
    this.getAllProducts();
  }
  inputHandler = (event, key) => {
    const { value } = event.target;

    this.setState({
      productdata: {
        ...this.state.productdata,
        [key]: value,
      },
    });
  };

  getAllProducts = () => {
    const { allproducts } = this.state;
    Axios.get(`${API_URL}/products/allproducts`)
      .then((res) => {
        console.log(res.data);
        this.setState({ allproducts: res.data });
        this.renderProduct()
      })
      .catch((err) => {
        alert("Yah error");
      });
  };

  deleteProduct = (idProduct) => {
    Axios.delete(`${API_URL}/products/delete/${idProduct}`)
      .then((res) => {
        this.getAllProducts();
      })
      .catch((err) => {
        console.log("Error deleting product");
      });
  };

  editProduct = (idEdit) => {
    const { editIndexActive } = this.state;
    if (editIndexActive.length == 0) {
      this.setState({ editIndexActive: [...editIndexActive, idEdit] });
      this.renderProduct();
    } else alert("Only can edit 1 row");
  };

  saveEditedProduct = (val) => {
    const {productdata} = this.state
    let arrtemp = this.state.editIndexActive;
    this.setState({ editIndexActive: [] });

    let formData = new FormData();

    let editedData = {...val,...productdata}
    console.log(editedData);
    
    formData.append("productData", JSON.stringify(editedData));
    Axios.put(`${API_URL}/products/updateproduct/${val.id}`,formData)
    .then((res)=>{
      console.log("Berhasil diedit");
      alert("Sukses edit")
      this.getAllProducts()
    })
    .catch((err)=>{
      alert("edit error")
    })
    

  };

  renderProduct = () => {
    const { allproducts } = this.state;
    return allproducts.map((val, idx) => {
      return (
        <>
          {this.state.editIndexActive.includes(val.id) ? (
            <tr>
              <td>{idx + 1}</td>
              <td>
                <Form.Control type="text" defaultValue={val.productName} 
                  onChange={(e) => this.inputHandler(e, "productName")}
                />
              </td>
              <td>
                <Form.Control type="number" defaultValue={val.price} 
                onChange={(e) => this.inputHandler(e, "price")}
                />
              </td>
              <td>
                <img src={val.imageLink} width="50px" alt="" />
              </td>
              <td>
                <Button onClick={() => this.saveEditedProduct(val)}>
                  Save
                </Button>
              </td>
              <td></td>
            </tr>
          ) : (
            <tr>
              <td>{idx + 1}</td>
              <td>{val.productName}</td>
              <td>{val.price}</td>
              <td>
                <img src={val.imageLink} width="50px" alt="" />
              </td>
              <td>
                <Button onClick={() => this.editProduct(val.id)}>Edit</Button>
              </td>
              <td>
                <Button onClick={() => this.deleteProduct(val.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          )}
        </>
      );
    });
  };

  submitProduct = () => {
    let formData = new FormData();

    formData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("productData", JSON.stringify(this.state.productdata));
      console.log(formData);
      console.log("enter");
      
    Axios.post(`${API_URL}/products/addproduct`, formData)
      .then((res) => {
        alert("Success add product");
        console.log(res.data);
        this.getAllProducts();
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err);
      });

    console.log(this.state.productdata);
    console.log(JSON.stringify(this.state.productdata));
  };

  fileChangeHandler = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  render() {
    return (
      <>
        <div className="container w-50 mt-5">
          <h2>CRUD PRODUCT</h2>
          <Form>
            <Form.Group as={Row} className="">
              <Form.Label column sm={2}>
                Product Name
              </Form.Label>

              <Col sm={10}>
                <div className="d-flex flex-column justify-content-center h-100">
                  <Form.Control
                    type="text"
                    onChange={(e) => this.inputHandler(e, "productName")}
                  />
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                Price
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="number"
                  onChange={(e) => this.inputHandler(e, "price")}
                />
              </Col>
            </Form.Group>
            <fieldset>
              <Form.Group as={Row} className="">
                <Form.Label as="legend" column sm={2}>
                  Select Picture
                </Form.Label>
                <Col sm={10}>
                  <div className="d-flex flex-column justify-content-center h-100">
                    <Form.File onChange={this.fileChangeHandler} />
                  </div>
                </Col>
              </Form.Group>
            </fieldset>

            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="button" onClick={this.submitProduct}>
                  Submit
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
        <div className="container w-50 mt-5">
          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Product Image</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>{this.renderProduct()}</tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default CrudProduct;

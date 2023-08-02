import { useState, useEffect } from "react";
import axios from "axios";

export function ReactShopper(){

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([{id:0,title:'',price:0,image:'',category:'',description:'',rating:{rate:0, count:0}}]);
    const [cartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showToggle, setShowToggle] = useState({'display':'none'});
    const [totalPrice, setTotalPrice] = useState(0);

    function GetCategories(){
        axios.get("http://fakestoreapi.com/products/categories")
        .then(response =>{
            response.data.unshift("all")
            setCategories(response.data);
        })
    }
    
    function GetProducts(url){
        axios.get(url)
        .then(response=>{
            setProducts(response.data);
        })
    }

    function GetCartCount(){
        setCartCount(cartItems.length)
    }

    function TotalPrice(){
        const total = cartItems.reduce((initial,total)=>{
            return initial + total.price
        },0)
        setTotalPrice(total)
    }

    function RemoveItems(e){
        cartItems.splice(e.currentTarget.id,1); 
        GetCartCount();
        TotalPrice();
    }

    useEffect(()=>{
        GetCategories();
        GetProducts("http://fakestoreapi.com/products");
        GetCartCount();
        TotalPrice();
    },[]);

    function handleCategoryChange(e){
        if(e.target.value=="all"){
            GetProducts("http://fakestoreapi.com/products")
        } else {
            GetProducts(`http://fakestoreapi.com/products/category/${e.target.value}`)
        }
    }
    
    function handleAddToCartClick(e){
        axios.get(`http://fakestoreapi.com/products/${e.target.value}`)
        .then(response=>{
            cartItems.push(response.data);
            alert(`${response.data.title}/n Added to Cart`);
            GetCartCount();
            TotalPrice()
        })
    }

    function handleCartToggleClick(){
        setShowToggle({'display':'block'});
    }

    return(
        <div className="container-fluid">
            <header className="d-flex flex-wrap justify-content-between p-2 bg-dark text-white">
                <div>
                    <span className="h4">Shopper</span>
                </div>
                <div className="mt-1">
                    <span className="me-5 fw-bold">Home</span>
                    <span className="me-5 fw-bold">Electronics</span>
                    <span className="me-5 fw-bold">Jewellary</span>
                    <span className="me-5 fw-bold">Men's Clothing</span>
                    <span className="me-5 fw-bold">Women's Clothing</span>
                </div>
                <div>
                    <button onClick={handleCartToggleClick} className="btn btn-danger">
                        <span className="bi bi-cart4"></span> Your Items
                        <span>[ {cartCount} ]</span>
                    </button>
                </div>
            </header>

            <section className="mt-3 row">
                <nav className="col-2">
                    <label className="form-label fw-bold">Category</label>
                    <select onChange={handleCategoryChange} className="form-select">
                        {
                            categories.map(category=>
                                <option value={category} key={category}>{category.toUpperCase()}</option>    
                            )
                        }
                    </select>
                </nav>
                <main className="col-7 ">
                    <div className="d-flex flex-wrap justify-content-between overflow-auto" height={'500px'}>
                        {
                            products.map(product =>
                                <div key={product.id} className="card p-2 m-3" style={{width:'250px'}}>
                                    <img src={product.image} width={'150px'} height={'150px'} className="card-img-top"/>
                                    <div className="card-header">
                                        <p>{product.title}</p>
                                    </div>
                                    <div className="card-body">
                                        <dl>
                                            <dt className="text-warning">Price</dt>
                                            <dd>{product.price} <span className="bi bi-currency-dollar text-success"></span></dd>
                                            <dt className="text-warning">Rating</dt>
                                            <dd>
                                                {product.rating.rate}
                                                <span className="bi bi-star-fill text-success"></span>
                                                [{product.rating.count}]
                                            </dd>
                                        </dl>
                                    </div>
                                    <div className="card-footer">
                                        <button value={product.id}  onClick={handleAddToCartClick} className="btn btn-danger w-100">
                                            <span className="bi bi-cart4"></span> Add to Cart
                                        </button>
                                    </div>
                                </div>    
                            )
                        }
                    </div>
                </main>
                <aside className="col-3">
                    <div style={showToggle}>
                        <label className="form-label fw-bold text-warning">Your Item's</label>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Previwe</th>
                                    <th>Price</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartItems.map((item, i)=>
                                        <tr key={item.id}>
                                            <td><img src={item.image} width="50" height="50"/></td>
                                            <td>{item.price} <span className="bi bi-currency-dollar"></span></td>
                                            <td>
                                                <button onClick={RemoveItems} id={i} className="btn btn-danger">
                                                    <span className="bi bi-trash-fill"></span>
                                                </button>
                                            </td>
                                        </tr>    
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" className="fw-bold text-success">Toatl Amount</td>
                                    <td className="fw-bold text-success">{totalPrice} <span className="bi bi-currency-dollar"></span></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </aside>
            </section>
        </div>
    )
}
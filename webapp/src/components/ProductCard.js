import '../assets/css/product-card.css'

const ProductCard = () => {
    return(
        <div className="container">
            <div className="col-3 row product-card">
                <div className="card">
                    <div className="card-tag" >Hot</div>
                    <img src="/img/gettyimages-96418382-1024x1024.jpg" alt="" className="img-fluid"/>
                    <button className="card-add">Add to cart <i className="bi bi-bag-plus-fill"></i></button>
                    <div className="card-content">
                        <a routerLink="/products/{{products.id}}">Lotus</a>
                        <p className="card-price">Current price: <span >$ 20</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductCard;
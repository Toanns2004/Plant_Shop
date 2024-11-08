import logo from '../assets/images/logo.png'
import {Link} from "react-router-dom";
import '../assets/css/footer.css'
import SearchProduct from "./SearchProduct";
const Footer = () => {
    return(
        <>
            <div className=" main-footer">
                <div className="footer-row">
                    <div className="container">
                        <div className="row">
                            <div className="col-8">
                                <h4>Blossoming Dreams, One Seed at a Time!</h4>
                            </div>
                            <div className="col-4">

                            </div>
                        </div>
                    </div>
                </div>
            <div className="footer-info">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Link to={'/'}><img src={logo} alt=""/></Link>
                            <br/>
                                <p><i class="bi bi-geo-alt-fill"></i>  01 Dinh Tien Hoang, Hoan Kiem, Ha Noi</p>
                                <p><i class="bi bi-envelope-at"></i>  bussiness@tinyseeds.com</p>
                                <p><i class="bi bi-telephone"></i>  +84 888 888 888</p>
                            </div>
                        <div className="col">
                            <h4>Quick links</h4>
                            <div className="row">
                                <div className="col">
                                    <p><Link to={"/category/flowering"}><i className="bi bi-chevron-double-right"></i> Flowering</Link></p>
                                </div>
                                <div className="col">
                                    <p><Link to={"/category/indoor"}><i className="bi bi-chevron-double-right"></i> Indoor Plants</Link></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p><Link to={"/category/outdoor"}><i className="bi bi-chevron-double-right"></i> Outdoor Plants</Link></p>
                                </div>
                                <div className="col">
                                    <p><Link to={"/category/gift"}><i className="bi bi-chevron-double-right"></i> Gifts</Link></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p><Link to={"/category/pots"}><i className="bi bi-chevron-double-right"></i> Pots</Link></p>
                                </div>
                                <div className="col">
                                    <p><Link to={"/category/supplies"}><i className="bi bi-chevron-double-right"></i> Supplies</Link></p>
                                </div>
                            </div>
                        <div className="row">
                            <div className="col">
                                <p><Link to={"/category/accessories"}><i className="bi bi-chevron-double-right"></i> Accessories</Link></p>
                            </div>
                            <div className="col">
                                <p><Link to={"/aboutus"}><i className="bi bi-chevron-double-right"></i> About TinySeeds</Link></p>
                            </div>
                        </div>
                        </div>
                        <div className="col">
                            <h4>Subscribe to our Newsletter</h4>
                                <form action="#">
                                    <div className="row">
                                        <div className="col-8">
                                            <input type="email" placeholder="Enter your e-mail" required className="form-control" />
                                        </div>
                                        <div className="col-4">
                                            <button type="submit" className="form-control btn btn-lg">Submit   </button>
                                        </div>
                                    </div>
                                </form>
                                <br/>
                                <h4>Folow Us on</h4>
                                <div className="row">
                                    <div className="col nav__icons">
                                        <a href="/"><i className="bi bi-facebook"></i></a>
                                    </div>
                                    <div className="col nav__icons">
                                        <a href="/"><i className="bi bi-twitter"></i></a>
                                    </div>
                                    <div className="col nav__icons">
                                        <a href="/"><i className="bi bi-linkedin"></i></a>
                                    </div>
                                    <div className="col nav__icons">
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Footer;
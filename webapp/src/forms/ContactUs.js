import '../assets/css/contact.css'

const ContactUs = () => {
    return(
        <div className="container">
            <br/>
            <div className="row">
                <div className="col-2 contact-page">

                </div>
                <div className="col-10 contact-page">
                    <div className="contact-info">
                        <h2>Contact Us</h2>
                        <br/>
                            <p><i className="bi bi-geo-alt-fill"></i> 01 Dinh Tien Hoang, Hoan Kiem, Ha Noi</p>
                            <p><i className="bi bi-envelope-at"></i> bussiness@tinyseeds.com</p>
                            <p><i className="bi bi-telephone"></i> +84 988 888 888</p>
                    </div>
                    <div className="send-mess">
                        <h2>Send us a message</h2>
                        <p><i>We'd love to hear from you! Let us know how we can help.</i></p>
                        <form>
                            <div className="row">
                                <div className="col">
                                    <input type="text" formControlName="name" className="form-control"
                                           placeholder="Your name"/>
                                </div>
                                <div className="col">
                                    <input type="email" formControlName="email" className="form-control"
                                           placeholder="Your e-mail"/>
                                </div>
                            </div>
                            <br/>
                                <div>
                                    <textarea formControlName="mess" cols="50" rows="5" className="form-control"
                                              placeholder="Your message"></textarea>
                                </div>
                                <br/>
                                    <button type="submit" className="btn btn-lg">Send Message <i
                                        className="bi bi-arrow-right-circle"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ContactUs;
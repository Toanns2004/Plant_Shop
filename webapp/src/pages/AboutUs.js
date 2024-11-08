import '../assets/css/about.css';

const AboutUs = () => {

    return(
        <div className="container">
            <br/>
            <div className="row">
                <div className="intro-page">
                    <div className="row">
                        <div className="col main-intro">
                            <div>
                                <h2>About TinySeeds</h2>
                                <br/>
                                    <h4>Welcome to TinySeeds, your premier destination for all things green and growing! Nestled in the heart of our community, TinySeeds is not just a plant store, but a haven for plant enthusiasts, nature lovers, and anyone seeking to bring a touch of greenery into their life.</h4>
                                    <p>At TinySeeds, we understand the power of plants to transform spaces, improve well-being, and add a breath of fresh air to your daily routine. Whether you're an experienced gardener or a first-time plant parent, we're here to provide you with a curated selection of the finest indoor and outdoor plants, succulents, cacti, and botanical accessories to help you nurture your green thumb.</p>
                                    <p>Our team of dedicated plant enthusiasts is passionate about sharing their knowledge and expertise with you. We're more than just a store; we're a community of like-minded individuals who believe that plants have the ability to inspire, heal, and connect us to the natural world.</p>
                                    <p>At TinySeeds, you'll find not only a wide variety of plants but also everything you need to care for them, from pots and soil to fertilizer and expert advice. Whether you're looking to create an urban jungle in your living room, revamp your outdoor garden, or simply add a touch of serenity to your workspace, TinySeeds has you covered.</p>
                                    <p>Join us on a journey of growth and discovery as we celebrate the beauty and wonder of plants. Come and explore our store, where every plant tells a story, and every visit is a chance to cultivate your love for all things green. TinySeeds is not just a store; it's a celebration of the magic of nature. Welcome to our green world!</p>

                            </div>
                        </div>
                    </div>
                    <hr/>
                        <h4>Our team</h4>
                        <br/>
                            <div className="row team-intro">
                                <div className="col">
                                    <img src="assets/images/hung-ava.jpg" alt="" className="img-fluid"/>
                                        <br/>
                                            <br/>
                                                <h5>Phung Duy Hung</h5>
                                </div>
                                <div className="col">
                                    <img src="assets/images/blank.avatar.webp" alt="" className="img-fluid"/>
                                        <br/>
                                            <br/>
                                                <h5>Nguyen Phi Long</h5>
                                </div>
                                <div className="col">
                                    <img src="assets/images/blank.avatar.webp" alt="" className="img-fluid"/>
                                        <br/>
                                            <br/>
                                                <h5>Nguyen Duc Lam</h5>
                                </div>
                                <div className="col">
                                    <img src="assets/images/blank.avatar.webp" alt="" className="img-fluid"/>
                                        <br/>
                                            <br/>
                                                <h5>Nguyen Van Truong</h5>
                                </div>
                                <div className="col">
                                    <img src="assets/images/blank.avatar.webp" alt="" className="img-fluid"/>
                                        <br/>
                                            <br/>
                                                <h5>Nguyen Sy Toan</h5>
                                </div>
                            </div>
                </div>
            </div>
        </div>
    )
}
export default AboutUs;
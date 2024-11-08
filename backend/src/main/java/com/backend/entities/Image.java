package com.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int img_id;

    @Column(name = "img_name")
    private String img_name;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "product_id", insertable = false, updatable = false)
//    private Product product;

//    public Image(String img_name, Product product) {
//        this.img_name = img_name;
//        this.product = product;
//    }


    public Image(String img_name, Product product) {
        this.img_name = img_name;
        this.product = product;
    }

    public Image(){super();};

    public int getImg_id() {
        return img_id;
    }

    public void setImg_id(int img_id) {
        this.img_id = img_id;
    }

    public String getImg_name() {
        return img_name;
    }

    public void setImg_name(String img_name) {
        this.img_name = img_name;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }


}

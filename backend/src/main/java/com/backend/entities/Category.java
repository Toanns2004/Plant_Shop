package com.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cat_id;

    @Column(name = "prefix")
    private String prefix;

    @Column(name = "cat_name")
    private String cat_name;

    @Column(name = "cat_description")
    private String cat_description;

    public Category(String prefix, String cat_name, String cat_description) {
        this.prefix = prefix;
        this.cat_name = cat_name;
        this.cat_description = cat_description;
    }

    public Category(){super();};

    public int getCat_id() {
        return cat_id;
    }

    public void setCat_id(int cat_id) {
        this.cat_id = cat_id;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getCat_name() {
        return cat_name;
    }

    public void setCat_name(String cat_name) {
        this.cat_name = cat_name;
    }

    public String getCat_description() {
        return cat_description;
    }

    public void setCat_description(String cat_description) {
        this.cat_description = cat_description;
    }


}

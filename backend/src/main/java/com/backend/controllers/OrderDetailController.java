package com.backend.controllers;

import com.backend.services.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping(value = "/oderdetails")
public class OrderDetailController {
    @Autowired
    OrderDetailService orderDetailService;



}

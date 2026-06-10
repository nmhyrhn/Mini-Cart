package com.minicart.product;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/products")
public class ProductApiServlet extends HttpServlet {

    private final ObjectMapper mapper = new ObjectMapper();
    private final ProductService productService = new ProductService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        resp.setContentType("application/json; charset=UTF-8");

        List<ProductDTO> products = productService.findAllProducts();
        mapper.writeValue(resp.getWriter(), products);

    }

}

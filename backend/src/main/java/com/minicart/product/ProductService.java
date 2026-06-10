package com.minicart.product;

import java.sql.Connection;
import java.util.List;

import static com.minicart.common.JDBCTemplate.close;
import static com.minicart.common.JDBCTemplate.getConnection;

public class ProductService {

    private final ProductDAO productDAO = new ProductDAO();

    public List<ProductDTO> findAllProducts() {
        Connection con = getConnection();

        try {
            return productDAO.selectAllProducts(con);
        } finally {
            close(con);
        }
    }

}

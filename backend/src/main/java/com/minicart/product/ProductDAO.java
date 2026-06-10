package com.minicart.product;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static com.minicart.common.JDBCTemplate.close;

public class ProductDAO {

    //상품 전체 조회
    public List<ProductDTO> selectAllProducts(Connection con) {

        List<ProductDTO> products = new ArrayList<>();

        String query =
                """
                    SELECT product_id, name, price, image
                    FROM products
                    ORDER BY product_id
                """;

        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            pstmt = con.prepareStatement(query);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                products.add(new ProductDTO(
                        rs.getInt("product_id"),
                        rs.getString("name"),
                        rs.getInt("price"),
                        rs.getString("image")

                ));
            }



        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(rs);
            close(pstmt);

        }

        return products;
    }

}

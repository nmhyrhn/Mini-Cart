package com.minicart.cart;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static com.minicart.common.JDBCTemplate.close;

public class CartDAO {

    public List<CartItemDTO> selectCartItems(Connection con, int userId) {
        PreparedStatement pstmt = null;
        ResultSet rset = null;
        List<CartItemDTO> cartItems = new ArrayList<>();

        String query = """
                SELECT ci.cartitem_id,
                       ci.user_id,
                       ci.product_id,
                       p.name,
                       p.price,
                       p.image,
                       ci.quantity
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.user_id = ?
                ORDER BY ci.cartitem_id
                """;

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, userId);
            rset = pstmt.executeQuery();

            while (rset.next()) {
                cartItems.add(new CartItemDTO(
                        rset.getInt("cartitem_id"),
                        rset.getInt("user_id"),
                        rset.getInt("product_id"),
                        rset.getString("name"),
                        rset.getInt("price"),
                        rset.getString("image"),
                        rset.getInt("quantity")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(rset);
            close(pstmt);
        }

        return cartItems;
    }

    public void insertOrIncreaseCartItem(Connection con, int userId, int productId) {
        Integer quantity = selectQuantity(con, userId, productId);

        if (quantity == null) {
            insertCartItem(con, userId, productId);
            return;
        }

        updateQuantity(con, userId, productId, quantity + 1);
    }

    public void updateQuantity(Connection con, int userId, int productId, int quantity) {
        PreparedStatement pstmt = null;

        String query = """
                UPDATE cart_items
                SET quantity = ?
                WHERE user_id = ?
                  AND product_id = ?
                """;

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, quantity);
            pstmt.setInt(2, userId);
            pstmt.setInt(3, productId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(pstmt);
        }
    }

    public void deleteCartItem(Connection con, int userId, int productId) {
        PreparedStatement pstmt = null;

        String query = """
                DELETE FROM cart_items
                WHERE user_id = ?
                  AND product_id = ?
                """;

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, productId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(pstmt);
        }
    }

    public void deleteAllCartItems(Connection con, int userId) {
        PreparedStatement pstmt = null;

        String query = "DELETE FROM cart_items WHERE user_id = ?";

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, userId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(pstmt);
        }
    }

    private Integer selectQuantity(Connection con, int userId, int productId) {
        PreparedStatement pstmt = null;
        ResultSet rset = null;

        String query = """
                SELECT quantity
                FROM cart_items
                WHERE user_id = ?
                  AND product_id = ?
                """;

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, productId);
            rset = pstmt.executeQuery();

            if (rset.next()) {
                return rset.getInt("quantity");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(rset);
            close(pstmt);
        }

        return null;
    }

    private void insertCartItem(Connection con, int userId, int productId) {
        PreparedStatement pstmt = null;

        String query = """
                INSERT INTO cart_items (user_id, product_id, quantity)
                VALUES (?, ?, 1)
                """;

        try {
            pstmt = con.prepareStatement(query);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, productId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(pstmt);
        }
    }
}

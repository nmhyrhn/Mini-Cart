package com.minicart.cart;

import java.sql.Connection;
import java.util.List;

import static com.minicart.common.JDBCTemplate.close;
import static com.minicart.common.JDBCTemplate.getConnection;

public class CartService {

    private final CartDAO cartDAO = new CartDAO();

    public List<CartItemDTO> findCartItems(int userId) {
        Connection con = getConnection();

        try {
            return cartDAO.selectCartItems(con, userId);
        } finally {
            close(con);
        }
    }

    public List<CartItemDTO> addCartItem(int userId, int productId) {
        Connection con = getConnection();

        try {
            cartDAO.insertOrIncreaseCartItem(con, userId, productId);
            return cartDAO.selectCartItems(con, userId);
        } finally {
            close(con);
        }
    }

    public List<CartItemDTO> updateQuantity(int userId, int productId, int quantity) {
        Connection con = getConnection();

        try {
            if (quantity <= 0) {
                cartDAO.deleteCartItem(con, userId, productId);
            } else {
                cartDAO.updateQuantity(con, userId, productId, quantity);
            }

            return cartDAO.selectCartItems(con, userId);
        } finally {
            close(con);
        }
    }

    public List<CartItemDTO> removeCartItem(int userId, int productId) {
        Connection con = getConnection();

        try {
            cartDAO.deleteCartItem(con, userId, productId);
            return cartDAO.selectCartItems(con, userId);
        } finally {
            close(con);
        }
    }

    public void clearCart(int userId) {
        Connection con = getConnection();

        try {
            cartDAO.deleteAllCartItems(con, userId);
        } finally {
            close(con);
        }
    }
}

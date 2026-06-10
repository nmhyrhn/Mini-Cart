package com.minicart.cart;

import com.minicart.user.UserDTO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/cart")
public class CartApiServlet extends HttpServlet {

    private final ObjectMapper mapper = new ObjectMapper();
    private final CartService cartService = new CartService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        UserDTO loginUser = getLoginUser(req, resp);

        if (loginUser == null) {
            return;
        }

        List<CartItemDTO> cartItems = cartService.findCartItems(loginUser.getUserId());
        mapper.writeValue(resp.getWriter(), cartItems);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        UserDTO loginUser = getLoginUser(req, resp);

        if (loginUser == null) {
            return;
        }

        CartItemDTO requestCartItem = mapper.readValue(req.getReader(), CartItemDTO.class);
        int productId = requestCartItem.getProductId() == 0 ? requestCartItem.getId() : requestCartItem.getProductId();

        List<CartItemDTO> cartItems = cartService.addCartItem(loginUser.getUserId(), productId);
        mapper.writeValue(resp.getWriter(), cartItems);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        UserDTO loginUser = getLoginUser(req, resp);

        if (loginUser == null) {
            return;
        }

        CartItemDTO requestCartItem = mapper.readValue(req.getReader(), CartItemDTO.class);
        int productId = requestCartItem.getProductId() == 0 ? requestCartItem.getId() : requestCartItem.getProductId();

        List<CartItemDTO> cartItems = cartService.updateQuantity(
                loginUser.getUserId(),
                productId,
                requestCartItem.getQuantity()
        );

        mapper.writeValue(resp.getWriter(), cartItems);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        UserDTO loginUser = getLoginUser(req, resp);

        if (loginUser == null) {
            return;
        }

        String productIdValue = req.getParameter("productId");

        if (productIdValue == null) {
            cartService.clearCart(loginUser.getUserId());
            mapper.writeValue(resp.getWriter(), List.of());
            return;
        }

        int productId = Integer.parseInt(productIdValue);
        List<CartItemDTO> cartItems = cartService.removeCartItem(loginUser.getUserId(), productId);
        mapper.writeValue(resp.getWriter(), cartItems);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private UserDTO getLoginUser(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);

        if (session == null || session.getAttribute("loginUser") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            mapper.writeValue(resp.getWriter(), "로그인이 필요합니다.");
            return null;
        }

        return (UserDTO) session.getAttribute("loginUser");
    }

    private void setJsonResponse(HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setContentType("application/json; charset=UTF-8");
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}

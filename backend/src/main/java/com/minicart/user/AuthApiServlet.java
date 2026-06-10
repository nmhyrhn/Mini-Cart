package com.minicart.user;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@WebServlet(urlPatterns = {"/api/auth/login", "/api/auth/me", "/api/auth/logout"})
public class AuthApiServlet extends HttpServlet {

    private final ObjectMapper mapper = new ObjectMapper();
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        if (!"/api/auth/me".equals(req.getServletPath())) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            mapper.writeValue(resp.getWriter(), "지원하지 않는 요청입니다.");
            return;
        }

        HttpSession session = req.getSession(false);

        if (session == null || session.getAttribute("loginUser") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            mapper.writeValue(resp.getWriter(), "로그인이 필요합니다.");
            return;
        }

        mapper.writeValue(resp.getWriter(), session.getAttribute("loginUser"));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setJsonResponse(resp);

        if ("/api/auth/logout".equals(req.getServletPath())) {
            logout(req, resp);
            return;
        }

        if (!"/api/auth/login".equals(req.getServletPath())) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            mapper.writeValue(resp.getWriter(), "지원하지 않는 요청입니다.");
            return;
        }

        UserDTO requestUser = mapper.readValue(req.getReader(), UserDTO.class);

        UserDTO loginUser = userService.login(
                requestUser.getLoginId(),
                requestUser.getPassword()
        );

        if (loginUser == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            mapper.writeValue(resp.getWriter(), "아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }

        loginUser.setPassword(null);
        req.getSession().setAttribute("loginUser", loginUser);

        mapper.writeValue(resp.getWriter(), loginUser);

    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void logout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        mapper.writeValue(resp.getWriter(), "로그아웃 되었습니다.");
    }

    private void setJsonResponse(HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setContentType("application/json; charset=UTF-8");
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}

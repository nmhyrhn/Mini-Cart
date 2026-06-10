package com.minicart.user;

import java.sql.Connection;

import static com.minicart.common.JDBCTemplate.close;
import static com.minicart.common.JDBCTemplate.getConnection;

public class UserService {

    private final UserDAO userDAO = new UserDAO();

    public UserDTO login(String loginId, String password) {

        Connection con = getConnection();

        try{
            return userDAO.selectUserByLoginIdAndPassword(con, loginId, password);

        } finally {
            close(con);
        }

    }
}

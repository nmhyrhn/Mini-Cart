package com.minicart.user;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import static com.minicart.common.JDBCTemplate.close;

public class UserDAO {

    public UserDTO selectUserByLoginIdAndPassword(Connection con, String loginId, String password) {
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        UserDTO loginUser = null;


        String query = """
            SELECT user_id, login_id, password, name
            FROM users
            WHERE login_id = ?
            AND password = ?
        """;

        try{
            pstmt = con.prepareStatement(query);
            pstmt.setString(1, loginId);
            pstmt.setString(2, password);
            rs = pstmt.executeQuery();

            if(rs.next()){
                loginUser = new UserDTO(
                        rs.getInt("user_id"),
                        rs.getString("login_id"),
                        rs.getString("password"),
                        rs.getString("name")
                );
            }

        }catch (Exception e){
            e.printStackTrace();
        } finally {
            close(rs);
            close(pstmt);
        }

        return loginUser;
    }

}

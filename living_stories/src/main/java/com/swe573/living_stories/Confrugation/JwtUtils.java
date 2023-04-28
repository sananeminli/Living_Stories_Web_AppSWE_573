package com.swe573.living_stories.Confrugation;


import com.swe573.living_stories.Models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Objects;
import java.util.function.Function;

import static java.lang.Long.parseLong;

@Component
public class JwtUtils {

    private static final String JWT_SECRET_KEY = "my-secret-key";
    private static final int EXPIRATION_DAYS = 1;

    public String generateJwtToken(User user) {
        Date expirationDate = new Date(System.currentTimeMillis() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000));

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith( SignatureAlgorithm.HS256, JWT_SECRET_KEY)
                .compact();
    }
   
   



    public Boolean validateToken(String token, User user) {
        final Long extractedUserId = extractId(token);
        return ((Objects.equals(extractedUserId, user.getId())) && !isTokenExpired(token));
    }

    public Long extractId(String token) {
        return parseLong(extractClaim(token, Claims::getSubject));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(JWT_SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }






}

package com.swe573.living_stories.Confrugation;

import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


@Component
public class DateParser {
    private static final List<String> DATE_FORMATS = Arrays.asList(
            "yyyy",
            "MM/yyyy",
            "dd/MM/yyyy",
            "dd/MM/yyyy HH:mm:ss"

    );

    public static Date parseDate(String dateString) {
        for (String format : DATE_FORMATS) {
            if (format.length() != dateString.length()){continue;}
            try {

                SimpleDateFormat formatter = new SimpleDateFormat(format);
                System.out.println(formatter.parse(dateString));
                return formatter.parse(dateString);
            } catch (Exception e) {

            }
        }
        throw new IllegalArgumentException("Invalid date format: " + dateString);
    }

    public static Date parseDateTime(String dateTimeString) {
        System.out.printf(dateTimeString);
        for (String format : DATE_FORMATS) {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                return formatter.parse(dateTimeString);
            } catch (Exception e) {

            }
        }
        throw new IllegalArgumentException("Invalid date-time format: " + dateTimeString);
    }




    public static String getDateFromDate(Date date) {



        for (String format : DATE_FORMATS ) {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat(format);
                String dateString = formatter.format(date);
                Date parsedDate = formatter.parse(dateString);
                if (parsedDate.equals(date)) {


                    return dateString;
                }
            } catch (Exception e) {

            }
        }

        return null;
    }

}

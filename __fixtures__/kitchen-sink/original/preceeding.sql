WITH timestamp_measurement AS (SELECT count(t1.id) AS count_num
                                    , date_trunc('month', t1.start_date) AS timestamp
                               FROM trip AS t1
                               GROUP BY timestamp)

  SELECT t2.timestamp AS timestamp
       , avg(t2.count_num) OVER (ORDER BY t2.timestamp ASC RANGE BETWEEN '3 months' PRECEDING AND CURRENT ROW) AS moving_count_num
  FROM timestamp_measurement AS t2
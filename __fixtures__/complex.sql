SELECT
  p1.playerid,
  f1.playername,
  p2.playerid,
  f2.playername
FROM
  player f1,
  player f2,
  plays p1 FULL OUTER JOIN plays p2 ON p1.playerid < p2.playerid AND p1.teamid = p2.teamid
GROUP BY
  p1.playerid,
  f1.playerid,
  p2.playerid,
  f2.playerid
HAVING
  count(p1.playerid) = count(*) AND count(p2.playerid) = count(*) AND p1.playerid = f1.playerid AND p2.playerid = f2.playerid;

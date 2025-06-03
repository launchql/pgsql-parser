SELECT
  array_agg(players),
  player_teams
FROM
  (SELECT DISTINCT
    t1.t1player AS players_dist,
    t1.player_teams
  FROM
    (SELECT
      p.playerid AS t1id,
      concat(p.playerid, ':', p.playername, ' ') AS t1player,
      array_agg(pl.teamid ORDER BY pl.teamid) AS player_teams
    FROM player p
    LEFT JOIN plays pl ON p.playerid = pl.playerid
    GROUP BY p.playerid, p.playername
    ) t1
INNER JOIN (
  SELECT
    p.playerid AS t2id,
    array_agg(pl.teamid ORDER BY pl.teamid) AS player_teams
  FROM player p
  LEFT JOIN plays pl ON p.playerid = pl.playerid
  GROUP BY p.playerid, p.playername
) t2 ON t1.player_teams=t2.player_teams AND t1.t1id <> t2.t2id
) innerQuery
GROUP BY player_teams;

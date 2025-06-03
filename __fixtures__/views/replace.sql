CREATE OR REPLACE VIEW public.view_ticket AS
 SELECT a.id,
    a.name,
    a.project,
    a.search,
    a.labels,
    a.minutes,
    b.name AS "user",
    b.email,
    b.language,
    b.photo,
    b.company,
    a.iduser,
    a.iduserlast,
    a.idsolver,
    a.issolved,
    a.ispriority,
    b.isnotification,
    a.datecreated,
    a.dateupdated,
    b.minutes AS minutesuser,
    a.idsolution,
    b."position",
    a.countcomments
   FROM tbl_ticket a
     JOIN tbl_user b ON b.id::text = a.iduser::text
  WHERE a.isremoved = false
select * from game_submissions gs
join guesses g on g.game_submission_id = gs.game_submission_id
where gs.game_id = $1
select g.*, count(gs.game_id) as submission_count from games g
full join game_submissions gs on g.game_id = gs.game_id
where user_id = $1
group by g.game_id;
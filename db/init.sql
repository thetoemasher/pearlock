create table users(
    user_id serial primary key,
    username varchar(50),
    password varchar(100)
);

create table games (
    game_id serial primary key,
    user_id integer references users(user_id),
    game_name varchar(50),
    complete boolean default false
    game_description varchar(255)
);

create table game_submissions(
    game_submission_id serial primary key,
    img_url text,
    submitter_name varchar(50),
    game_id integer references games(game_id)
);

create table guesses(
    guess_id serial primary key,
    guess_number integer default 0,
    correct boolean default false,
    game_submission_id integer references game_submissions(game_submission_id)
);
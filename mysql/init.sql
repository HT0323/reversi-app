drop database if exists reversi;

create database reversi;

use reversi;

create table games (
  id int primary key auto_increment,
  started_at datetime not null
);

create table turns (
  id int primary key auto_increment,
  game_id int not null,
  turn_count int not null,
  next_disc int,
  end_at datetime not null,
  foreign key (game_id) references games (id),
  unique (game_id, turn_count)
);

create table moves (
  id int primary key auto_increment,
  turn_id int not null,
  disc int not null,
  x int not null,
  y int not null,
  foreign key (turn_id) references turns (id)
);

create table squares (
  id int primary key auto_increment,
  turn_id int not null,
  x int not null,
  y int not null,
  disc int not null,
  foreign key (turn_id) references turns (id),
  unique (turn_id, x, y)
);

create table game_results (
  id int primary key auto_increment,
  game_id int not null,
  winner_disc int not null,
  end_at datetime not null,
  foreign key (game_id) references games (id)
);

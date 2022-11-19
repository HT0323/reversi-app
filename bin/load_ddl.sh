#!/bin/bash
cat mysql/init.sql | docker-compose exec -T mysql mysql --user=root --password=root

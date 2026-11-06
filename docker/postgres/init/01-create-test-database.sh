#!/bin/sh
set -eu

TEST_DB_NAME="${TEST_DB_NAME:-tcit_posts_test}"

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set ON_ERROR_STOP=1 <<SQL
CREATE DATABASE "${TEST_DB_NAME}";
SQL

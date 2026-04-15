#!/bin/sh
set -e

# Run database migrations
/nakama/nakama migrate up --database.address "postgres:localdb@postgres:5432/nakama"

# Start Nakama with correct database address
exec /nakama/nakama --database.address "postgres:localdb@postgres:5432/nakama"

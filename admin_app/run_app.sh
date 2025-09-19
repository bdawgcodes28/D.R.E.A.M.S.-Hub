#!/bin/bash
bash "./utils/build_react.sh" &
bash "./utils/build_server.sh" &

cd "./admin"
npm run dev
#!/bin/bash

if [ "$1" = 'multical-web']; then
    cd /multical-web
    source /multical-web-env/bin/activate
    flask run -h 0.0.0.0 -p 5000
fi

exec "$@"
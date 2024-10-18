#!/bin/sh  
  
flask db upgrade  

# flask run -h 0.0.0.0 -p 80
exec gunicorn --bind 0.0.0.0:80 "app:create_app()"
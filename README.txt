Develop:
npm install
nodemon wnp-cli.js (to autorestart on server changes)

Test before publish:
    Terminal1:
        cd ~/wnp
        npm install
        npm link
        gulp serve #(coffee compile) or should it be nodemon? //triptec
    Terminal2:
        wnp
    Browser:
        http://localhost:3000/wnpc

Example
To run wnp type 'wnp' in the terminal. Visit localhost:3000/wnpc to access UI
New Tech-stack implementations!

1. NodeJs - Hapi

   - Understanding Nodejs and Npm
        - Serverside js
        - V8 - Javascript Engine
        - modular js
        - asynchronous by nature
        - node modules ~ nugets

   - Create repo in gitlab and clone locally https://gitlab.com/
   - Download and Install the Editor of your preference
         
     protip: Editor config http://editorconfig.org/

   - Download and Install Nodejs from https://nodejs.org/es/
   - Initialize project `npm init`
   - Install Hapi `npm install hapi --save --save-exact`
     
     **Protips**:
     
     1) Before installing a module on your project configure globally to save 
     the exact version instead of typing this every time: `--save --save-exact`
     
            npm config set save=true
            npm config set save-exact=true

     2) For avoiding to manually use the command `npm start` several times, you
     can install this package: `npm install nodemon --g`.
     After installing it, just use the command `nodemon server.js` (where `sever.js`
     is the name of your file.)

2. Elastic Search
3. React - Redux
     - Fundamentals course: https://www.udemy.com/react-redux/learn/v4/
     - React getting started: https://facebook.github.io/react/docs/hello-world.html
     - React state: https://medium.com/react-tutorials/react-state-14a6d4f736f5#.ddinpfxaf
     - React components lifecycle: http://busypeoples.github.io/post/react-component-lifecycle/
4. Redis
5. Docker

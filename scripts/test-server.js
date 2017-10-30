var FirebaseServer  = require('firebase-server');

var server = new FirebaseServer(5000, 'test.firebase.localhost', {
      /* You can put your initial data model here, or just leave it empty */
});

require('child_process').exec('react-scripts test --env=jsdom');
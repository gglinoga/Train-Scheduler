 $(document).ready(function () {

     var config = {
         apiKey: "AIzaSyCDvNv7Cf5qtiATi__OvQ28fqz1iC5zx70",
         authDomain: "train-839e6.firebaseapp.com",
         databaseURL: "https://train-839e6.firebaseio.com",
         projectId: "train-839e6",
         storageBucket: "train-839e6.appspot.com",
         messagingSenderId: "775293342657"
     };
     firebase.initializeApp(config);

     var db = firebase.database();
     var train = {
         trainName: "",
         dest: "",
         ftt: "",
         hz: 0,
         minAway: 0,
         next: 0,
         nextConverted: 0,

         trainInfo: function () {
             train.trainName = $("#trainName").val().trim()
             train.dest = $("#destination").val().trim()
             train.ftt = $("#firstTrain").val().trim()
             train.hz = $("#frequency").val().trim()
             train.trainCalc();
             db.ref().push({
                 trainName: train.trainName,
                 destination: train.dest,
                 frequency: train.hz,
                 minAway: train.minAway,
                 next: train.nextConverted
             })

         },
         trainCalc: function () {
             var firstTrainConverted = moment(train.ftt, "HH:mm").subtract(1, "years");
             console.log(firstTrainConverted);

             // Current Time
             var currentTime = moment();
             console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

             // Difference between the times
             var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
             console.log("DIFFERENCE IN TIME: " + diffTime);

             // Time apart (remainder)
             var tRemainder = diffTime % train.hz;
             console.log(tRemainder);

             // Minute Until Train
             train.minAway = train.hz - tRemainder;
             console.log("MINUTES TILL TRAIN: " + train.minAway);

             // Next Train
             train.next = moment().add(train.minAway, "minutes");
             train.nextConverted = moment(train.next).format("hh:mm");
             console.log("ARRIVAL TIME: " + train.nextConverted);
             return train.next;
             return train.minAway;
         }
     } //end train obj

     db.ref().on("value", function (snapshot) {

     }, function (errorObject) {
         console.log("The read failed: " + errorObject.code);
     });

     $("#submit").on("click", function () {
         train.trainInfo();

     });

     db.ref().on("child_added", function(childSnapshot) {
      
        var name = childSnapshot.val().trainName;
        var dest = childSnapshot.val().destination;
        var hz = childSnapshot.val().frequency;
        var next = childSnapshot.val().next;
        var minAway = childSnapshot.val().minAway;

        var newRow = $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(dest),
            $("<td>").text(hz),
            $("<td>").text(next),
            $("<td>").text(minAway),
          );
        
          $("#tbody").append(newRow);
        });
        

 }); //end doc ready wrapper
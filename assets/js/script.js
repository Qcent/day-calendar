let daysEvents = [];

const saveTheDay = function() {
    localStorage.setItem("dayPlanner", JSON.stringify(daysEvents));
}
const loadTheDay = function() {
        daysEvents = JSON.parse(localStorage.getItem("dayPlanner")); // try and load the events from localStorage

        if (!daysEvents) { // if there are no events in localStorage
            daysEvents = []; // reinitialize as an empty array
            for (let i = 0; i < 24; i++) {
                daysEvents[i] = ""; // set 24 blank events: one for every possible hour in the day
            }
        }
    }
    // Event save button was clicked
const saveTimeBlock = function(tbDiscription, idx) {
        //find our target element to update
        let target = $(tbDiscription).closest(".row").find(".discription");
        // get the current text from textarea
        let text = target.val().trim();
        //recreate p element
        let eventP = $("<p>").addClass('col-10 discription').text(text);
        //add bg-color
        addEventBgColor(eventP, idx);
        // replace textarea with p element in DOM
        target.replaceWith(eventP);

        //replace in memory
        daysEvents[idx] = text;
        //save new memories
        saveTheDay();
    }
    // Event text was clicked to be edited
$("#Timeblocks").on("click", "p.discription", function() {
    var textInput = $("<textarea>").addClass("col-10 discription").val($(this).text().trim()); // create an editable textarea with the same text as the event
    addEventBgColor(textInput, $(this).closest(".time-block").attr("id").replace("tb-", "")); // add a time based bg-color :: the id has the hour attached to it

    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

// Event text being edited lost focus
$("#Timeblocks").on("blur", "textarea", function(event) {

    // get the parent time-block's id attribute 
    var tbId = $(this).closest(".time-block").attr("id").replace("tb-", "");

    //if relatedTarget is a saveBtn with same parent id then save new text else restore old text
    if (event.relatedTarget && event.relatedTarget.matches(".saveBtn") &&
        $(event.relatedTarget).closest(".time-block").attr("id").replace("tb-", "") === tbId) {
        saveTimeBlock(this, tbId);
    } else {

        //recreate p element with text saved in localstorage/daysEvents
        var eventP = $("<p>").addClass('col-10 discription').text(daysEvents[tbId]);
        //Add the bg-color
        addEventBgColor(eventP, tbId);
        // replace textarea with p element
        $(this).replaceWith(eventP);
    }
});

const addEventBgColor = function(tbEvent, eventTime) {
    let rightNow = luxon.DateTime.now(); // get a date object for right now
    eventTime = rightNow.startOf('day').plus({ hours: eventTime }); // create a date object with the eventTime

    if (rightNow > eventTime) {
        tbEvent.addClass("bg-secondary"); // past event

        if (rightNow.hour <= eventTime.hour) {
            tbEvent.addClass("bg-danger"); // present event
        }
    } else { tbEvent.addClass("bg-success"); } // future event


}

const printTimeblocks = function() {
    let dayStart = 7; //7am
    let dayEnd = 20; //8pm

    let rightNow = luxon.DateTime.now(); // get a date object for right now
    let freshDay = rightNow.startOf('day'); // get a date object starting 12am today

    for (let i = dayStart; i <= dayEnd; i++) { // a loop for every hour in the day
        let eventText = daysEvents[i]; // load the event text for the hour
        let eventTime = freshDay.plus({ hours: i }); // set the events time to the hour of the day

        //create all the HTML elements we need for the time block
        // container
        let tb = $("<div>").attr("id", 'tb-' + i).addClass('col-12 time-block');
        //time of day
        let tbTime = $("<div>").addClass('col-1 hour').text(eventTime.toFormat('h a'));
        //event
        let tbEvent = $("<p>").addClass('col-10 discription').text(eventText);
        // save icon
        let tbSave = $("<button>").addClass('col-1 saveBtn').text("SAVE");

        // add a background color depending if event is in past,present,future
        addEventBgColor(tbEvent, i);

        //compile all elements
        tb.append($("<div>").addClass('row').append(tbTime, tbEvent, tbSave));

        //add to timeblock list
        $("#Timeblocks").append(tb);
    }
}

loadTheDay();
printTimeblocks();
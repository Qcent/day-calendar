//set the default hours to display for the work day
let dayStart = 7; //7am
let dayEnd = 20; //8pm
// declare an array to hold the days events
let daysEvents = [];
// create a global luxon date object for right now  
let rightNow = luxon.DateTime.now();

// Saves events for the day to localStorage
const saveTheDay = function() {
        localStorage.setItem("dayPlanner", JSON.stringify(daysEvents));
    }
    // Loads events for the day from localStorage
const loadTheDay = function() {
    daysEvents = JSON.parse(localStorage.getItem("dayPlanner")); // try and load the events from localStorage

    if (!daysEvents) { // if there are no events in localStorage
        daysEvents = []; // reinitialize as an empty array
        for (let i = 0; i < 24; i++) {
            daysEvents[i] = ""; // set 24 blank events: one for every possible hour in the day
        }
    }
};
// this function is to be called at intervals to update the date/time and event bg-color 
const updateTheDay = function() {
    rightNow = luxon.DateTime.now(); //update rightNow

    $("#currentTime").text(rightNow.toFormat('h:mm a')); // update time of day
    $("#currentDay").text(rightNow.toFormat('EEEE, MMMM ') + getOrdinal(rightNow.toFormat('d'))); //update the date

    jQuery('.time-block').each(function() { // go through every .time-block
        var tbEvent = $(this).find(".discription"); //find the event discription element
        var idx = $(this).attr("id").replace("tb-", ""); //get the hour of the event
        addEventBgColor(tbEvent, idx); //set the bg-color
    });
    console.log("updated")
};
// Event save button was clicked
const saveTimeBlock = function(tbDiscription, idx) {
        //find our target element to update :: go to the parent: ".row" and find the first ".discription"
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
    // Prints out the days schedual from hour (start) to  hour (end)
const printTimeblocks = function(start, end) {
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
            // this is now handeled in updateDay which runs periodically
            // addEventBgColor(tbEvent, i);

            //compile all elements
            tb.append($("<div>").addClass('row').append(tbTime, tbEvent, tbSave));

            //add to timeblock list
            $("#Timeblocks").append(tb);
        }
    }
    //this function takes in an element and an hour of the day. it will set the element
    // "tbEvent" background color by comparing the hour given to the current hour of the day
const addEventBgColor = function(tbEvent, eventTime) {
        let rightNow = luxon.DateTime.now(); // get a date object for right now
        eventTime = rightNow.startOf('day').plus({ hours: eventTime }); // create a date object with the hour set to eventTime

        if (rightNow > eventTime) {
            tbEvent.addClass("bg-secondary"); // past event
            if (rightNow.hour === eventTime.hour) {
                tbEvent.addClass("bg-danger"); // present event
            }
        } else { tbEvent.addClass("bg-success"); } // future event
    }
    // Because luxion does not support ordinals this helper function is needed
    // it uses Intl.PluralRules API built into modern browsers
    // the following code wrapped in the getOrdinal function is taken directly from
    // https://v8.dev/features/intl-pluralrules
const getOrdinal = function(n) {
        const pr = new Intl.PluralRules('en-US', {
            type: 'ordinal'
        });
        const suffixes = new Map([
            ['one', 'st'],
            ['two', 'nd'],
            ['few', 'rd'],
            ['other', 'th'],
        ]);
        const formatOrdinals = (n) => {
            const rule = pr.select(n);
            const suffix = suffixes.get(rule);
            return `${n}${suffix}`;
        };

        return formatOrdinals(n);
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

const startTheDay = (() => {
    loadTheDay();
    printTimeblocks(dayStart, dayEnd);
    updateTheDay();

    setInterval(updateTheDay, 15000);
})();
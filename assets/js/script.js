let daysEvents = [];

const saveTheDay = function() {
    localStorage.setItem("dayPlanner", JSON.stringify(daysEvents));
}
const loadTheDay = function() {
    daysEvents = JSON.parse(localStorage.getItem("dayPlanner"));

    if (!daysEvents) {
        daysEvents = [];
        for (let i = 0; i < 24; i++) {
            daysEvents[i] = "";
        }
    }
}

// Event text was clicked to be edited
$("#Timeblocks").on("click", "p.discription", function() {
    var textInput = $("<textarea>").addClass("col-10 discription form-control").val($(this).text().trim());

    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

// Event save button was clicked
const saveTimeBlock = function(tbDiscription, idx) {

    //find our target element to update
    let target = $(tbDiscription).closest(".row").find(".discription");

    // get the current text from textarea
    let text = target.val().trim();

    //recreate p element
    let eventP = $("<p>").addClass('col-10 discription test').text(text);

    // replace textarea with p element in DOM
    target.replaceWith(eventP);

    //replace in memory
    daysEvents[idx] = text;
    //save new memories
    saveTheDay();
}

// Event text being edited lost focus
$("#Timeblocks").on("blur", "textarea", function(event) {

    // get the parent time-block's id attribute
    var tbId = $(this).closest(".time-block").attr("id").replace("tb-", "");

    //if related.target is a saveBtn with same parent id then save new text else restore old text
    if (event.relatedTarget && event.relatedTarget.matches(".saveBtn") &&
        $(event.relatedTarget).closest(".time-block").attr("id").replace("tb-", "") === tbId) {
        saveTimeBlock(this, tbId);
    } else {

        //recreate p element
        var eventP = $("<p>").addClass('col-10 discription').text(daysEvents[tbId]);

        // replace textarea with p element
        $(this).replaceWith(eventP);
    }
});


const printTimeblocks = function() {
    let dayStart = 7; //7am
    let dayEnd = 20; //8pm

    for (let i = dayStart; i <= dayEnd; i++) {
        let eventText = daysEvents[i];

        // container
        let tb = $("<div>").attr("id", 'tb-' + i).addClass('col-12 time-block');
        //time of day
        let tbTime = $("<div>").addClass('col-1 hour').text(i);
        //event
        let tbEvent = $("<p>").addClass('col-10 discription').text(eventText);
        // save icon
        let tbSave = $("<button>").addClass('col-1 saveBtn').text("SAVE");

        //compile all elements
        tb.append($("<div>").addClass('row').append(tbTime, tbEvent, tbSave));

        //add to timeblocklist
        $("#Timeblocks").append(tb);
    }

}

loadTheDay();
printTimeblocks();